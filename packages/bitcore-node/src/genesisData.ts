import { IBlock } from './types/Block';
import { ITransaction, TransactionStorage } from './models/transaction';
import { ICoin, CoinStorage } from './models/coin';
import { BlockStorage } from './models/block';
import * as config from './constants/config';
import { toSha256 } from './utils/crypto';

interface IAddressAndAmount {
  address: string;
  value: number;
}

const getAddressAndValueList = () => {
  return [
    { address: '8ZWWN1nX8drxJBSMG1VS9jH4ciBSvA9nxp', value: 58800000 },
    { address: '8aGPBahDX4oAXx9okpGRzHPS3Td1pZaLgU', value: 44100000 },
    { address: '8RGSkdaft9EmSXXp6b2UFojwttfJ5BY29r', value: 11760000 },
    { address: '8L7qGjjHRa3Agks6incPomWCfLSMPYipmU', value: 11760000 },
    { address: 'dcZ3NXrpbNWvx1rhiGvXStM6EQtHLc44c9', value: 29400000 },
    { address: 'dMty9CfknKEaXqJuSgYkvvyF6UB6ffrZXG', value: 14700000 },
    { address: 'dZcY1ZNm5bkquz2J74smKqokuPoVpPvGWu', value: 64680000 },
    { address: 'dP8dvN5pnwbsxFcfN9DyqPVZi1fVHicDd2', value: 235200000 },
    { address: 'dMs1xeSGZbGnTJWqTwjR4mcjp2egpEXG6M', value: 117600000 }
  ];
};

const getGenesisBlock = (blockTime: Date, merkleRoot: string) => {
  return {
    chain: config.CHAIN,
    hash: config.GENESIS_BLOCK_HASH,
    network: config.NETWORK,
    height: config.GENESIS_BLOCK_HEIGHT,
    version: 536870912,
    nextBlockHash: config.NEXT_BLOCK_HASH,
    previousBlockHash: config.PREVIOUS_BLOCK_HASH,
    merkleRoot,
    time: blockTime,
    timeNormalized: blockTime,
    bits: 486604799,
    transactionCount: 1,
    size: 357,
    reward: 20000000000,
    processed: true
  };
};

const getGenesisTransaction = (txid: string, blockTime: Date, outputCount: number) => {
  return {
    chain: config.CHAIN,
    network: config.NETWORK,
    txid,
    blockHeight: config.GENESIS_BLOCK_HEIGHT,
    blockHash: config.GENESIS_BLOCK_HASH,
    blockTime,
    blockTimeNormalized: blockTime,
    coinbase: true,
    fee: 0,
    size: config.TX_INPUTS * 180 + outputCount * 34 + 10 + config.TX_INPUTS,
    locktime: 0,
    inputCount: config.TX_INPUTS,
    outputCount,
    value: config.TOTAL_PREMINED_VALUE,
    wallets: []
  };
};

export const insertGenesisData = async () => {
  const blockTime = new Date();
  const txid = toSha256(config.GENESIS_BLOCK_HASH);
  const addressAndValueList: IAddressAndAmount[] = getAddressAndValueList();

  const block: IBlock = getGenesisBlock(blockTime, txid);

  const transaction: ITransaction = getGenesisTransaction(txid, blockTime, addressAndValueList.length);

  await BlockStorage.insertGenesisBlock(block, config.GENESIS_BLOCK_HASH);
  await TransactionStorage.insertGenesisTransaction(transaction, txid);

  let mintIndex = 0;
  for (const addressAndValue of addressAndValueList) {
    const coin: ICoin = {
      chain: config.CHAIN,
      mintIndex,
      mintTxid: txid,
      network: config.NETWORK,
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
