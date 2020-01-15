import { DefichainTransactionType } from './Transaction';
export type BlockHeaderObj = {
  hash: string;
  version: number;
  prevHash: string;
  merkleRoot: string;
  time: number;
  bits: number;
  height: number,
  mintedBlocks: number,
  stakeModifier: string,
  sig: string,
}
export type BlockHeader = {
  toObject: () => BlockHeaderObj;
};
export type DefichainBlockType = {
  hash: string;
  transactions: DefichainTransactionType[];
  header: BlockHeader;
  toBuffer: () => Buffer;
};
