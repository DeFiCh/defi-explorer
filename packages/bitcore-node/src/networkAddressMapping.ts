import * as config from './constants/config';
import { INetworkMethods } from './interfaces';

export const getGenesisBlockForMainnet = (blockTime: Date, merkleRoot: string, network: string) => {
  return {
    chain: config.CHAIN,
    hash: config.GENESIS_BLOCK_HASH_MAINNET,
    network,
    height: config.GENESIS_BLOCK_HEIGHT,
    version: 536870912,
    nextBlockHash: config.NEXT_BLOCK_HASH_MAINNET,
    previousBlockHash: config.PREVIOUS_BLOCK_HASH_MAINNET,
    merkleRoot,
    time: blockTime,
    timeNormalized: blockTime,
    bits: 486604799,
    transactionCount: 1,
    size: 357,
    reward: 20000000000,
    processed: true,
  };
};

export const getGenesisBlockForTestnet = (blockTime: Date, merkleRoot: string, network: string) => {
  return {
    chain: config.CHAIN,
    hash: config.GENESIS_BLOCK_HASH_TESTNET,
    network,
    height: config.GENESIS_BLOCK_HEIGHT,
    version: 536870912,
    nextBlockHash: config.NEXT_BLOCK_HASH_TESTNET,
    previousBlockHash: config.PREVIOUS_BLOCK_HASH_TESTNET,
    merkleRoot,
    time: blockTime,
    timeNormalized: blockTime,
    bits: 486604799,
    transactionCount: 1,
    size: 359,
    reward: 20000000000,
    processed: true,
  };
};

export const getGenesisTransactionForMainnet = (txid: string, blockTime: Date, outputCount: number, network) => {
  return {
    chain: config.CHAIN,
    network,
    txid,
    blockHeight: config.GENESIS_BLOCK_HEIGHT,
    blockHash: config.GENESIS_BLOCK_HASH_MAINNET,
    blockTime,
    blockTimeNormalized: blockTime,
    coinbase: true,
    fee: 0,
    size: config.TX_INPUTS * 180 + outputCount * 34 + 10 + config.TX_INPUTS,
    locktime: 0,
    inputCount: config.TX_INPUTS,
    outputCount,
    value: config.TOTAL_PREMINED_VALUE_MAINNET,
    wallets: [],
  };
};

export const getGenesisTransactionForTestnet = (txid: string, blockTime: Date, outputCount: number, network) => {
  return {
    chain: config.CHAIN,
    network,
    txid,
    blockHeight: config.GENESIS_BLOCK_HEIGHT,
    blockHash: config.GENESIS_BLOCK_HASH_TESTNET,
    blockTime,
    blockTimeNormalized: blockTime,
    coinbase: true,
    fee: 0,
    size: config.TX_INPUTS * 180 + outputCount * 34 + 10 + config.TX_INPUTS,
    locktime: 0,
    inputCount: config.TX_INPUTS,
    outputCount,
    value: config.TOTAL_PREMINED_VALUE_TESTNET,
    wallets: [],
  };
};

export const getAddressAndValueListForMainnet = () => {
  return [
    { address: '8ZWWN1nX8drxJBSMG1VS9jH4ciBSvA9nxp', value: 5880000000000000 },
    { address: '8aGPBahDX4oAXx9okpGRzHPS3Td1pZaLgU', value: 4410000000000000 },
    { address: '8RGSkdaft9EmSXXp6b2UFojwttfJ5BY29r', value: 1176000000000000 },
    { address: '8L7qGjjHRa3Agks6incPomWCfLSMPYipmU', value: 1176000000000000 },
    { address: 'dcZ3NXrpbNWvx1rhiGvXStM6EQtHLc44c9', value: 2940000000000000 },
    { address: 'dMty9CfknKEaXqJuSgYkvvyF6UB6ffrZXG', value: 1470000000000000 },
    { address: 'dZcY1ZNm5bkquz2J74smKqokuPoVpPvGWu', value: 6468000000000000 },
    { address: 'dP8dvN5pnwbsxFcfN9DyqPVZi1fVHicDd2', value: 23520000000000000 },
    { address: 'dMs1xeSGZbGnTJWqTwjR4mcjp2egpEXG6M', value: 11760000000000000 },
  ];
};

export const getAddressAndValueListForTestnet = () => {
  return [
    { address: 'te7wgg1X9HDJvMbrP2S51uz2Gxm2LPW4Gr', value: 10000000000000000 },
    { address: 'tmYVkwmcv73Hth7hhHz15mx5K8mzC1hSef', value: 10000000000000000 },
    { address: 'tahuMwb9eX83eJhf2vXL6NPzABy3Ca8DHi', value: 10000000000000000 },
  ];
};

export const networkMap = new Map<string, INetworkMethods>();

networkMap.set(config.MAINNET, {
  getGenesisBlock: getGenesisBlockForMainnet,
  getGenesisTransaction: getGenesisTransactionForMainnet,
  getAddressAndValueList: getAddressAndValueListForMainnet,
});

networkMap.set(config.TESTNET, {
  getGenesisBlock: getGenesisBlockForTestnet,
  getGenesisTransaction: getGenesisTransactionForTestnet,
  getAddressAndValueList: getAddressAndValueListForTestnet,
});

export const defaultNetworkValue: INetworkMethods = {
  getGenesisBlock: getGenesisBlockForMainnet,
  getGenesisTransaction: getGenesisTransactionForMainnet,
  getAddressAndValueList: getAddressAndValueListForMainnet,
};
