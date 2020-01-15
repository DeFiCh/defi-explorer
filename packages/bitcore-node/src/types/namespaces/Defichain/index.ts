import { DefichainBlockType, BlockHeader, BlockHeaderObj } from './Block';
import {
  DefichainTransactionType,
  DefichainOutput,
  DefichainInput,
  DefichainScript,
  DefichainAddress,
  DefichainInputObj,
  DefichainTransactionAnchor,
} from './Transaction';

export declare namespace Defichain {
  export type Block = DefichainBlockType;
  export type Transaction = DefichainTransactionType;
  export type Script = DefichainScript;
  export type Address = DefichainAddress;
  export type Anchor = DefichainTransactionAnchor;
}

export declare namespace Defichain.Transaction {
  export type Output = DefichainOutput;
  export type Input = DefichainInput;
  export type InputObj = DefichainInputObj;
}

export declare namespace Defichain.Block {
  export type Header = BlockHeader;
  export type HeaderObj = BlockHeaderObj
}
