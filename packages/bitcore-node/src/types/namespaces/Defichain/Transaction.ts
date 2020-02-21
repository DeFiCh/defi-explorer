export type DefichainAddress = {
  toString: (stripCash: boolean) => string;
};
export type DefichainScript = {
  toBuffer: () => Buffer;
  toHex: () => string;
  classify: () => string;
  chunks: Array<{ buf: Buffer }>;
  toAddress: (network: string) => DefichainAddress;
};
export type DefichainInputObj = {
  prevTxId: string;
  outputIndex: number;
};
export type DefichainInput = {
  toObject: () => DefichainInputObj;
};
export type DefichainOutput = {
  script: DefichainScript;
  satoshis: number;
};
export type DefichainTransactionAnchor = {
  btcTxHash: string,
  anchorBlockHeight: number,
  prevAnchorBlockHeight: number,
}
export type DefichainTransactionType = {
  outputAmount: number;
  hash: string;
  _hash: undefined | string;
  isCoinbase: () => boolean;
  isAnchor: () => boolean;
  outputs: DefichainOutput[];
  inputs: DefichainInput[];
  toBuffer: () => Buffer;
  getAnchor: () => DefichainTransactionAnchor | null,
  nLockTime: number;
};
