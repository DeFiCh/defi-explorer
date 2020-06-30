import { LoggifyClass } from '../decorators/Loggify';
import { BaseModel, MongoBound } from './base';
import { ObjectID, CollectionAggregationOptions } from 'mongodb';
import { SpentHeightIndicators, CoinJSON } from '../types/Coin';
import { valueOrDefault } from '../utils/check';
import { StorageService } from '../services/storage';
import { BlockStorage } from './block';
import { TransactionStorage } from './transaction';
import { RICH_LIST_PAGE_SIZE, CACHE_TTL_SECONDS } from '../constants/config';
import { CacheItem } from '../CacheItem';

export type ICoin = {
  network: string;
  chain: string;
  mintTxid: string;
  mintIndex: number;
  mintHeight: number;
  coinbase: boolean;
  value: number;
  address: string;
  script: Buffer;
  wallets: Array<ObjectID>;
  spentTxid: string;
  spentHeight: number;
  confirmations?: number;
};

export const richListCache = new Map();

@LoggifyClass
class CoinModel extends BaseModel<ICoin> {
  constructor(storage?: StorageService) {
    super('coins', storage);
  }

  allowedPaging = [
    { key: 'mintHeight' as 'mintHeight', type: 'number' as 'number' },
    { key: 'spentHeight' as 'spentHeight', type: 'number' as 'number' }
  ];

  onConnect() {
    this.collection.createIndex({ mintTxid: 1, mintIndex: 1 }, { background: true });
    this.collection.createIndex(
      { address: 1, chain: 1, network: 1 },
      {
        background: true,
        partialFilterExpression: {
          spentHeight: { $lt: 0 }
        }
      }
    );
    this.collection.createIndex({ address: 1 }, { background: true });
    this.collection.createIndex({ chain: 1, network: 1, mintHeight: 1 }, { background: true });
    this.collection.createIndex({ spentTxid: 1 }, { background: true, sparse: true });
    this.collection.createIndex({ chain: 1, network: 1, spentHeight: 1 }, { background: true });
    this.collection.createIndex(
      { wallets: 1, spentHeight: 1, value: 1, mintHeight: 1 },
      { background: true, partialFilterExpression: { 'wallets.0': { $exists: true } } }
    );
    this.collection.createIndex(
      { wallets: 1, spentTxid: 1 },
      { background: true, partialFilterExpression: { 'wallets.0': { $exists: true } } }
    );
    this.collection.createIndex(
      { wallets: 1, mintTxid: 1 },
      { background: true, partialFilterExpression: { 'wallets.0': { $exists: true } } }
    );
  }

  async getRichList(params: { query: any }, options: CollectionAggregationOptions = {}) {
    const { pageNo } = params.query;
    const totalCacheName = 'total';
    const cacheResult = richListCache.get(pageNo);
    const totalCountCacheResult = richListCache.get(totalCacheName);
    const baseCodition = [
      {
        $match: {
          address: { $ne: 'false' },
          spentHeight: { $lt: SpentHeightIndicators.minimum },
          mintHeight: { $gt: SpentHeightIndicators.conflicting }
        }
      },
      { $group: { _id: '$address', balance: { $sum: '$value' } } },
      {
        $project: {
          _id: 0,
          address: '$_id',
          balance: 1
        }
      }
    ];

    const additionalCondition = [
      { $sort: { balance: -1 } },
      { $skip: RICH_LIST_PAGE_SIZE * (pageNo - 1) },
      { $limit: RICH_LIST_PAGE_SIZE }
    ];

    const response = {};

    const prepareRichListRow = async txIds => {
      const data = {
        txCount: '',
        firstTxTime: '',
        lastTxTime: ''
      };
      const tasks = [
        TransactionStorage.getTransactionCount({ query: { txIds } }),
        TransactionStorage.getFirstTransactionTime({
          query: { txIds }
        }),
        TransactionStorage.getLastTransactionTime({
          query: { txIds }
        })
      ];

      const taskResult = await Promise.all(tasks);

      Object.keys(data).forEach((item, ind) => {
        data[item] = taskResult[ind];
      });
      return data;
    };

    const fetchRichList = async conditions => {
      const result: any = await this.collection.aggregate(conditions, options).toArray();
      const updatedResult = await Promise.all(
        result.map(async curr => {
          const txIds = await this.getTransactionIdsForAddress({ query: { address: curr.address } });
          const data = await prepareRichListRow(txIds);
          return Object.assign({}, curr, data);
        })
      );
      return updatedResult || [];
    };

    const setCache = (key, value) => {
      const cache = new CacheItem(value);
      richListCache.set(key, cache);
    };
    // Have time stamp within the last 300 seconds, skip fetching again.
    if (!cacheResult || !cacheResult.isRecent(CACHE_TTL_SECONDS)) {
      const updatedConditions = [...baseCodition, ...additionalCondition];

      const result: any = await fetchRichList(updatedConditions);

      // add data to cache
      setCache(pageNo, result);
      response['data'] = result;
    } else {
      response['data'] = cacheResult.value;
    }

    if (!totalCountCacheResult || !totalCountCacheResult.isRecent(CACHE_TTL_SECONDS)) {
      const result = await fetchRichList(baseCodition);
      setCache(totalCacheName, result.length);
      response[totalCacheName] = result.length;
    } else {
      response[totalCacheName] = totalCountCacheResult.value;
    }
    return response;
  }

  async getTransactionIdsForAddress(params: { query: any }) {
    const { address } = params.query;
    const result = await this.collection.distinct('mintTxid', { address });
    return result;
  }

  async getBalance(params: { query: any }, options: CollectionAggregationOptions = {}) {
    let { query } = params;
    const result = await this.collection
      .aggregate<{ _id: string; balance: number }>(
        [
          { $match: query },
          {
            $project: {
              value: 1,
              status: {
                $cond: {
                  if: { $gte: ['$mintHeight', SpentHeightIndicators.minimum] },
                  then: 'confirmed',
                  else: 'unconfirmed'
                }
              },
              _id: 0
            }
          },
          {
            $group: {
              _id: '$status',
              balance: { $sum: '$value' }
            }
          }
        ],
        options
      )
      .toArray();
    return result.reduce<{ confirmed: number; unconfirmed: number; balance: number }>(
      (acc, cur) => {
        acc[cur._id] = cur.balance;
        acc.balance += cur.balance;
        return acc;
      },
      { confirmed: 0, unconfirmed: 0, balance: 0 }
    );
  }

  async getBalanceAtTime(params: { query: any; time: string; chain: string; network: string }) {
    let { query, time, chain, network } = params;
    const [block] = await BlockStorage.collection
      .find({
        $query: {
          chain,
          network,
          timeNormalized: { $lte: new Date(time) }
        }
      })
      .limit(1)
      .sort({ timeNormalized: -1 })
      .toArray();
    const blockHeight = block!.height;
    const combinedQuery = Object.assign(
      {},
      {
        $or: [{ spentHeight: { $gt: blockHeight } }, { spentHeight: SpentHeightIndicators.unspent }],
        mintHeight: { $lte: blockHeight }
      },
      query
    );
    return this.getBalance({ query: combinedQuery }, { hint: { wallets: 1, spentHeight: 1, value: 1, mintHeight: 1 } });
  }

  resolveAuthhead(mintTxid: string, chain?: string, network?: string) {
    return this.collection
      .aggregate<{
        chain: string;
        network: string;
        authbase: string;
        identityOutputs: ICoin[];
      }>([
        {
          $match: {
            mintTxid: mintTxid.toLowerCase(),
            mintIndex: 0,
            ...(typeof chain === 'string' ? { chain } : {}),
            ...(typeof network === 'string' ? { network } : {})
          }
        },
        {
          $graphLookup: {
            from: 'coins',
            startWith: '$spentTxid',
            connectFromField: 'spentTxid',
            connectToField: 'mintTxid',
            as: 'authheads',
            maxDepth: 1000000,
            restrictSearchWithMatch: {
              mintIndex: 0
            }
          }
        },
        {
          $project: {
            chain: '$chain',
            network: '$network',
            authbase: '$mintTxid',
            identityOutputs: {
              $filter: {
                input: '$authheads',
                as: 'authhead',
                cond: {
                  $and: [
                    {
                      $lte: ['$$authhead.spentHeight', -1]
                    },
                    {
                      $eq: ['$$authhead.chain', '$chain']
                    },
                    {
                      $eq: ['$$authhead.network', '$network']
                    }
                  ]
                }
              }
            }
          }
        }
      ])
      .toArray();
  }

  _apiTransform(coin: Partial<MongoBound<ICoin>>, options?: { object: boolean }): any {
    const transform: CoinJSON = {
      _id: valueOrDefault(coin._id, new ObjectID()).toHexString(),
      chain: valueOrDefault(coin.chain, ''),
      network: valueOrDefault(coin.network, ''),
      coinbase: valueOrDefault(coin.coinbase, false),
      mintIndex: valueOrDefault(coin.mintIndex, -1),
      spentTxid: valueOrDefault(coin.spentTxid, ''),
      mintTxid: valueOrDefault(coin.mintTxid, ''),
      mintHeight: valueOrDefault(coin.mintHeight, -1),
      spentHeight: valueOrDefault(coin.spentHeight, SpentHeightIndicators.error),
      address: valueOrDefault(coin.address, ''),
      script: valueOrDefault(coin.script, Buffer.alloc(0)).toString('hex'),
      value: valueOrDefault(coin.value, -1),
      confirmations: valueOrDefault(coin.confirmations, -1)
    };
    if (options && options.object) {
      return transform;
    }
    return JSON.stringify(transform);
  }
}
export let CoinStorage = new CoinModel();
