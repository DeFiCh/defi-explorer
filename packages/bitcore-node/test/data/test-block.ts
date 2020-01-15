import { TEST_TX, TEST_TX_1, TEST_TX_2, TEST_TX_3 } from './test-tx';
import { Defichain } from '../../src/types/namespaces/Defichain';
export const TEST_BLOCK: Defichain.Block = {
  hash: '64bfb3eda276ae4ae5b64d9e36c9c0b629bc767fb7ae66f9d55d2c5c8103a929',
  transactions: [TEST_TX],
  toBuffer: () => {
    return { length: 264 } as Buffer;
  },
  header: {
    toObject: () => {
      return {
        hash:
          '64bfb3eda276ae4ae5b64d9e36c9c0b629bc767fb7ae66f9d55d2c5c8103a929',
        version: 536870912,
        prevHash:
          '3420349f63d96f257d56dd970f6b9079af9cf2784c267a13b1ac339d47031fe9',
        merkleRoot:
          '08e23107e8449f02568d37d37aa76e840e55bbb5f100ed8ad257af303db88c08',
        time: 1526756523,
        bits: parseInt('207fffff', 16),
        height: 1355,
        mintedBlocks: 1354,
        stakeModifier: '0000000000000000000000000000000000000000000000000000000000000000',
        sig: '0000000000000000000000000000000000000000000000000000000000000000',
      };
    }
  }
};
export const TEST_BLOCK_1: Defichain.Block = {
  hash: '528f01c17829622ed6a4af51b3b3f6c062f304fa60e66499c9cbb8622c8407f7',
  transactions: [TEST_TX_1],
  toBuffer: () => {
    return { length: 264 } as Buffer;
  },
  header: {
    toObject: () => {
      return {
        hash:
          '528f01c17829622ed6a4af51b3b3f6c062f304fa60e66499c9cbb8622c8407f7',
        version: 536870912,
        prevHash:
          '64bfb3eda276ae4ae5b64d9e36c9c0b629bc767fb7ae66f9d55d2c5c8103a929',
        merkleRoot:
          'a2262b524615b6d2f409784ceff898fd46bdde6a584269788c41f26ac4b4919e',
        time: 1526326784,
        bits: parseInt('207fffff', 16),
        height: 1362,
        mintedBlocks: 1,
        stakeModifier: '0000000000000000000000000000000000000000000000000000000000000000',
        sig: '0000000000000000000000000000000000000000000000000000000000000000',
      };
    }
  }
};
export const TEST_BLOCK_2: Defichain.Block = {
  hash: '2a883ff89c7d6e9302bb4a4634cd580319a4fd59d69e979b344972b0ba042b86',
  transactions: [TEST_TX_2],
  toBuffer: () => {
    return { length: 264 } as Buffer;
  },
  header: {
    toObject: () => {
      return {
        hash:
          '2a883ff89c7d6e9302bb4a4634cd580319a4fd59d69e979b344972b0ba042b86',
        height: 1367,
        version: 536870912,
        merkleRoot:
          '8a351fa9fc3fcd38066b4bf61a8b5f71f08aa224d7a86165557e6da7ee13a826',
        time: 1526326785,
        bits: parseInt('207fffff', 16),
        prevHash:
          '528f01c17829622ed6a4af51b3b3f6c062f304fa60e66499c9cbb8622c8407f7',
        mintedBlocks: 1,
        stakeModifier: '0000000000000000000000000000000000000000000000000000000000000000',
        sig: '0000000000000000000000000000000000000000000000000000000000000000',
      };
    }
  }
};
export const TEST_BLOCK_3: Defichain.Block = {
  hash: '3279069d22ce5af68ef38332d5b40e79e1964b154d466e7fa233015a34c27312',
  transactions: [TEST_TX_3],
  toBuffer: () => {
    return { length: 264 } as Buffer;
  },
  header: {
    toObject: () => {
      return {
        hash:
          '3279069d22ce5af68ef38332d5b40e79e1964b154d466e7fa233015a34c27312',
        height: 1357,
        version: 536870912,
        merkleRoot:
          '8c29860888b915715878b21ce14707a17b43f6c51dfb62a1e736e35bc5d8093f',
        time: 1526326785,
        bits: parseInt('207fffff', 16),
        prevHash:
          '2a883ff89c7d6e9302bb4a4634cd580319a4fd59d69e979b344972b0ba042b86',
        mintedBlocks: 1,
        stakeModifier: '0000000000000000000000000000000000000000000000000000000000000000',
        sig: '0000000000000000000000000000000000000000000000000000000000000000',
      };
    }
  }
};
