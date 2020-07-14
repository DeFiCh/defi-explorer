import { IBlock } from './types/Block';
import { ITransaction, TransactionStorage } from './models/transaction';
import { ICoin, CoinStorage } from './models/coin';
import { BlockStorage } from './models/block';
import * as config from './constants/config';
import { toSha256 } from './utils/crypto';
import { IAddressAndAmount } from './interfaces';
import { networkMap, defaultNetworkValue } from './networkAddressMapping';

export const insertGenesisData = async (network: string) => {
  const blockTime = new Date();
  const hash = network === config.MAINNET ? config.GENESIS_BLOCK_HASH_MAINNET : config.GENESIS_BLOCK_HASH_TESTNET;
  const txid = toSha256(hash);

  const { getGenesisBlock, getGenesisTransaction, getAddressAndValueList } =
    networkMap.get(network) || defaultNetworkValue;

  const addressAndValueList: IAddressAndAmount[] = getAddressAndValueList();

  const block: IBlock = getGenesisBlock(blockTime, txid, network);

  const transaction: ITransaction = getGenesisTransaction(txid, blockTime, addressAndValueList.length, network);

  await BlockStorage.insertGenesisBlock(block, config.GENESIS_BLOCK_HEIGHT);
  await TransactionStorage.insertGenesisTransaction(transaction, txid);

  let mintIndex = 0;
  for (const addressAndValue of addressAndValueList) {
    const coin: ICoin = {
      chain: config.CHAIN,
      mintIndex,
      mintTxid: txid,
      network,
      address: addressAndValue.address,
      mintHeight: config.GENESIS_BLOCK_HEIGHT,
      coinbase: true,
      value: addressAndValue.value,
      script: new Buffer(addressAndValue.address),
      spentHeight: -2,
      wallets: []
    };

    await CoinStorage.insertGenesisCoins(coin, addressAndValue.address, txid);
    mintIndex++;
  }
};
