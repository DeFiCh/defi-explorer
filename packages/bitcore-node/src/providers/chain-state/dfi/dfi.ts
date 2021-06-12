import { InternalStateProvider } from '../internal/internal';
import { CSP } from '../../../types/namespaces/ChainStateProvider';
import { TransactionStorage } from '../../../models/transaction';
import { BlockStorage } from '../../../models/block';
import orderBy from 'lodash/orderBy';
import { TransactionJSON } from '../../../types/Transaction';
import {
  DefichainTransactionAccountToAccount,
  DefichainTransactionAccountToUtxos,
  DefichainTransactionAddPoolLiquidity,
  DefichainTransactionAnyAccountsToAccounts,
  DefichainTransactionMintToken,
  DefichainTransactionUtxosToAccount
} from '../../../types/namespaces/Defichain/Transaction';
import uniq from 'lodash/uniq';
import nodeCache from '../../../NodeCache';

export class DFIStateProvider extends InternalStateProvider {
  constructor(chain: string = 'DFI') {
    super(chain);
  }

  async getTransaction(params: CSP.StreamTransactionParams) {
    let { chain, network, txId } = params;
    if (typeof txId !== 'string' || !chain || !network) {
      throw 'Missing required param';
    }
    network = network.toLowerCase();
    const query = { chain, network, txid: txId };
    const tip = await this.getLocalTip(params);
    const tipHeight = tip ? tip.height : 0;
    const found = await TransactionStorage.collection.findOne(query);
    let isCustomTxApplied = false;
    if (found) {
      let confirmations = 0;
      if (found.blockHeight && found.blockHeight >= 0) {
        confirmations = tipHeight - found.blockHeight + 1;
      }
      if (found.blockHeight && found.isCustom && found.customData) {
        isCustomTxApplied = (await this.getRPC(chain, network).getCustomTxApplied(txId, found.blockHeight)) as boolean;
        switch (found.txType) {
          case 'M': {
            const tokensPromises = (found.customData as DefichainTransactionMintToken).minted.map(mint => {
              return this.getRPC(chain, network).getToken(mint.token);
            });
            const tokens = await Promise.all(tokensPromises);
            (found.customData as DefichainTransactionMintToken).minted = (found.customData as DefichainTransactionMintToken).minted.map(
              (mint, index) => {
                return `${mint.balance}@${tokens[index][mint.token].symbol}`;
              }
            );
            break;
          }
          case 'l': {
            for (const key in (found.customData as DefichainTransactionAddPoolLiquidity).from) {
              const tokensPromises = (found.customData as DefichainTransactionAddPoolLiquidity).from[key].map(from => {
                return this.getRPC(chain, network).getToken(from.token);
              });
              const tokens = await Promise.all(tokensPromises);
              (found.customData as DefichainTransactionAddPoolLiquidity).from[
                key
              ] = (found.customData as DefichainTransactionAddPoolLiquidity).from[key].map((from, index) => {
                return `${from.balance}@${tokens[index][from.token].symbol}`;
              });
            }
            break;
          }
          case 'U': {
            for (const key in (found.customData as DefichainTransactionUtxosToAccount).to) {
              const tokensPromises = (found.customData as DefichainTransactionUtxosToAccount).to[key].map(to => {
                return this.getRPC(chain, network).getToken(to.token);
              });
              const tokens = await Promise.all(tokensPromises);
              (found.customData as DefichainTransactionUtxosToAccount).to[
                key
              ] = (found.customData as DefichainTransactionUtxosToAccount).to[key].map((to, index) => {
                return `${to.balance}@${tokens[index][to.token].symbol}`;
              });
            }
            break;
          }
          case 'b': {
            const tokensPromises = (found.customData as DefichainTransactionAccountToUtxos).balances.map(balance => {
              return this.getRPC(chain, network).getToken(balance.token);
            });
            const tokens = await Promise.all(tokensPromises);
            (found.customData as DefichainTransactionAccountToUtxos).balances = (found.customData as DefichainTransactionAccountToUtxos).balances.map(
              (balance, index) => {
                return `${balance.balance}@${tokens[index][balance.token].symbol}`;
              }
            );
            break;
          }
          case 'B': {
            for (const key in (found.customData as DefichainTransactionAccountToAccount).to) {
              const tokensPromises = (found.customData as DefichainTransactionAccountToAccount).to[key].map(to => {
                return this.getRPC(chain, network).getToken(to.token);
              });
              const tokens = await Promise.all(tokensPromises);
              (found.customData as DefichainTransactionAccountToAccount).to[
                key
              ] = (found.customData as DefichainTransactionAccountToAccount).to[key].map((to, index) => {
                return `${to.balance}@${tokens[index][to.token].symbol}`;
              });
            }
            break;
          }
          case 'a': {
            for (let i = 0; i < (found.customData as DefichainTransactionAnyAccountsToAccounts).from.length; i++) {
              for (const key in (found.customData as DefichainTransactionAnyAccountsToAccounts).from[i]) {
                const tokensPromises = (found.customData as DefichainTransactionAnyAccountsToAccounts).from[i][key].map(
                  from => {
                    return this.getRPC(chain, network).getToken(from.token);
                  }
                );
                const tokens = await Promise.all(tokensPromises);
                (found.customData as DefichainTransactionAnyAccountsToAccounts).from[i][
                  key
                ] = (found.customData as DefichainTransactionAnyAccountsToAccounts).from[i][key].map((from, index) => {
                  return `${from.balance}@${tokens[index][from.token].symbol}`;
                });
              }
            }
            for (let i = 0; i < (found.customData as DefichainTransactionAnyAccountsToAccounts).to.length; i++) {
              for (const key in (found.customData as DefichainTransactionAnyAccountsToAccounts).to[i]) {
                const tokensPromises = (found.customData as DefichainTransactionAnyAccountsToAccounts).to[i][key].map(
                  to => {
                    return this.getRPC(chain, network).getToken(to.token);
                  }
                );
                const tokens = await Promise.all(tokensPromises);
                (found.customData as DefichainTransactionAnyAccountsToAccounts).to[i][
                  key
                ] = (found.customData as DefichainTransactionAnyAccountsToAccounts).to[i][key].map((to, index) => {
                  return `${to.balance}@${tokens[index][to.token].symbol}`;
                });
              }
            }
          }
        }
      }
      const convertedTx = TransactionStorage._apiTransform(found, { object: true }) as TransactionJSON;
      return { ...convertedTx, confirmations: confirmations, isCustomTxApplied };
    } else {
      return undefined;
    }
  }

  async getAnchoredBlock(params: CSP.StreamBlocksParams) {
    const {
      chain,
      network,
      res,
      sinceBlock,
      args,
    } = params;
    try {
      const limit = args?.limit ?? 10
      const cacheName = `${chain}-${network}-${sinceBlock}-${limit}`;
      const CACHE_TTL_SECONDS = 60;
      const cache = nodeCache.get(cacheName);
      if(!cache) {
        const data = await this.getRPC(chain, network).getAnchoredBlock();
        if(!data.length) res.sendStatus(404);
        const updatedData = orderBy(data, 'anchorHeight', 'desc');
        const lowerLimit = sinceBlock ?? +updatedData[updatedData.length - 1].anchorHeight - 1;
        const filteredData = updatedData.filter(el => el.anchorHeight > lowerLimit && el.active).splice(0, +limit);
        const uniqId = uniq(filteredData.map(item => item.anchorHeight));
        const blockData = await BlockStorage.collection.find({height: {$in: uniqId}}).sort({
          height: -1
        }).toArray();
        const mergerObj = {};
        blockData.forEach((item) => mergerObj[item.height] = item)
        const response = filteredData.map(item => ({
          ...item,
          ...mergerObj[item.anchorHeight],
          btcTxHash: item.btcTxHash,
        }))
        await nodeCache.set(cacheName, response, CACHE_TTL_SECONDS);
        res.json(response);
      }
      res.json(cache);
    } catch(err) {
      res.status(500).send(err);
    }
  }
  async getTotalAnchoredBlocks(params: CSP.GetTotalAnchoredBlocks) {
    const { chain, network } = params;
    const data: any[] = await this.getRPC(chain, network).getAnchoredBlock();
    const updatedData = data.filter((item) => item.active)
    return { total: updatedData.length };
  }
}
