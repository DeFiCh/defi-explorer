export const TEST_TX = {
  hash: '08e23107e8449f02568d37d37aa76e840e55bbb5f100ed8ad257af303db88c08',
  _hash: '08e23107e8449f02568d37d37aa76e840e55bbb5f100ed8ad257af303db88c08',
  isCoinbase: () => true,
  isAnchor: () => false,
  outputAmount: 0.09765625,
  inputs: [],
  outputs: [],
  nLockTime: 0,
  getAnchor: () => null,
  toBuffer: () => Buffer.from('')
};
export const TEST_TX_1 = {
  hash: 'b8abbdd4428b32cdf79a29728ea7a6d102444c880dca9be489c1ba346dcc5436',
  _hash: 'b8abbdd4428b32cdf79a29728ea7a6d102444c880dca9be489c1ba346dcc5436',
  isCoinbase: () => true,
  isAnchor: () => false,
  outputAmount: 0.0976,
  inputs: [],
  outputs: [],
  nLockTime: 0,
  getAnchor: () => null,
  toBuffer: () => Buffer.from('')
};
export const TEST_TX_2 = {
  hash: '1e28aa7b910f256dd49f020a668b69c427c2646bfc99b4f892deea71bb885062',
  _hash: '1e28aa7b910f256dd49f020a668b69c427c2646bfc99b4f892deea71bb885062',
  isCoinbase: () => true,
  isAnchor: () => false,
  getAnchor: () => null,
  outputAmount: 0.06763325,
  inputs: [],
  outputs: [],
  nLockTime: 0,
  toBuffer: () => Buffer.from('')
};
export const TEST_TX_3 = {
  hash: '947911ecc53cd8313220c94ba2211b90a4062a79ee8f830b100861c377f501ef',
  _hash: '947911ecc53cd8313220c94ba2211b90a4062a79ee8f830b100861c377f501ef',
  isCoinbase: () => true,
  isAnchor: () => false,
  getAnchor: () => null,
  outputAmount: 0.07865625,
  inputs: [],
  outputs: [],
  nLockTime: 0,
  toBuffer: () => Buffer.from('')
};

export const TEST_TX_4 = {
  hash: '947911ecc53cd8313220c94ba2211b90a4062a79ee8f830b100861c377f501ff',
  _hash: '947911ecc53cd8313220c94ba2211b90a4062a79ee8f830b100861c377f501ff',
  isCoinbase: () => true,
  isAnchor: () => true,
  getAnchor: () => ({
    btcTxHash: 'fffffffffffffffffffffff0000000000000000000000000fffffffffffffaaa',
    anchorBlockHeight: 1355,
    prevAnchorBlockHeight: 1335,
  }),
  outputAmount: 0.07865625,
  inputs: [],
  outputs: [],
  nLockTime: 0,
  toBuffer: () => Buffer.from(''),
};
