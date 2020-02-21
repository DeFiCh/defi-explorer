import { expect } from 'chai';
import * as sinon from 'sinon';
import { ObjectID } from 'mongodb';

import { Storage } from '../../../src/services/storage';
import { BlockStorage, IBlock } from '../../../src/models/block';
import { TransactionStorage } from '../../../src/models/transaction';
import { CoinStorage } from '../../../src/models/coin';
import { ChainStateProvider } from '../../../src/providers/chain-state';

import { TEST_BLOCK, TEST_BLOCK_4 } from '../../data/test-block';
import { mockStorage, mockCollection } from '../../helpers';

import { MongoBound } from '../../../src/models/base';

describe('Block Model', function() {
  let addBlockParams = {
    chain: 'DFI',
    network: 'testnet',
    block: TEST_BLOCK,
    height: 1355,
    initialSyncComplete: false
  };

  describe('addBlock', () => {
    let sandbox;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('should be able to add a block', async () => {
      let newBlock = Object.assign({ save: () => Promise.resolve() }, BlockStorage, addBlockParams);

      mockStorage(newBlock);
      sandbox.stub(BlockStorage, 'handleReorg').resolves();
      sandbox.stub(TransactionStorage, 'batchImport').resolves();

      const result = await BlockStorage.addBlock(addBlockParams);
      expect(result);
    });

    it('should be able to add a block and set anchor data to block', async function () {
      let newBlock = {
        save: () => Promise.resolve(),
        ...BlockStorage,
        ...addBlockParams
      };

      const updateOne = sinon.stub().resolves(newBlock);
      const spyUpdateOne = sinon.spy(updateOne);

      mockStorage(newBlock, { updateOne: spyUpdateOne });
      sandbox.stub(BlockStorage, 'handleReorg').resolves();
      sandbox.stub(TransactionStorage, 'batchImport').resolves();

      const result = await BlockStorage.addBlock({
        ...addBlockParams,
        block: TEST_BLOCK_4,
      });

      expect(result);
      expect(spyUpdateOne.getCall(1).args[1]).deep.equal({
        $set: { btcTxHash: 'fffffffffffffffffffffff0000000000000000000000000fffffffffffffaaa' },
      });
    });
  });

  describe('BlockModel find options', () => {
    it('should be able to create query options', () => {
      const id = new ObjectID();
      const { query, options } = Storage.getFindOptions<MongoBound<IBlock>>(BlockStorage, {
        since: id,
        paging: '_id',
        limit: 100,
        direction: -1
      });
      expect(options.limit).to.be.eq(100);
      expect(query._id).to.be.deep.eq({ $lt: id });
      expect(options.sort).to.be.deep.eq({ _id: -1 });
    });

    it('should default to descending', () => {
      const id = new ObjectID();
      const { query, options } = Storage.getFindOptions<MongoBound<IBlock>>(BlockStorage, {
        since: id,
        paging: '_id',
        limit: 100
      });
      expect(options.sort).to.be.deep.eq({ _id: -1 });
      expect(options.limit).to.be.eq(100);
      expect(query._id).to.be.deep.eq({ $lt: id });
    });

    it('should allow ascending', () => {
      const id = new ObjectID();
      const { query, options } = Storage.getFindOptions<MongoBound<IBlock>>(BlockStorage, {
        since: id,
        paging: '_id',
        limit: 100,
        direction: 1
      });
      expect(options.sort).to.be.deep.eq({ _id: 1 });
      expect(options.limit).to.be.eq(100);
      expect(query._id).to.be.deep.eq({ $gt: id });
    });
  });

  describe('getLocalTip', () => {
    let sandbox;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });
    afterEach(() => {
      sandbox.restore();
    });
    it('should return the new tip', async () => {
      mockStorage(null);
      const params = { chain: 'DFI', network: 'testnet' };
      const result = await ChainStateProvider.getLocalTip(params);
      expect(result.height).to.deep.equal(addBlockParams.height + 1);
      expect(result.chain).to.deep.equal(addBlockParams.chain);
      expect(result.network).to.deep.equal(addBlockParams.network);
    });
  });

  describe('getPoolInfo', () => {
    xit('should return pool info given a coinbase string');
  });

  describe('getLocatorHashes', () => {
    let sandbox;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });
    afterEach(() => {
      sandbox.restore();
    });
    it('should return 65 zeros if there are no processed blocks for the chain and network', async () => {
      const params = { chain: 'BTC', network: 'regtest' };
      const result = await ChainStateProvider.getLocatorHashes(params);
      expect(result).to.deep.equal([Array(65).join('0')]);
    });
  });

  describe('handleReorg', () => {
    let sandbox;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('should return if localTip hash equals the previous hash', async () => {
      Object.assign(BlockStorage.collection, mockCollection(null));
      Object.assign(TransactionStorage.collection, mockCollection(null));
      Object.assign(CoinStorage.collection, mockCollection(null));
      let blockModelRemoveSpy = BlockStorage.collection.deleteMany as sinon.SinonSpy;
      let transactionModelRemoveSpy = TransactionStorage.collection.deleteMany as sinon.SinonSpy;
      let coinModelRemoveSpy = CoinStorage.collection.deleteMany as sinon.SinonSpy;
      let coinModelUpdateSpy = CoinStorage.collection.updateMany as sinon.SinonSpy;

      const params = {
        header: {
          hash: '64bfb3eda276ae4ae5b64d9e36c9c0b629bc767fb7ae66f9d55d2c5c8103a929',
          version: 536870912,
          prevHash: '3420349f63d96f257d56dd970f6b9079af9cf2784c267a13b1ac339d47031fe9',
          merkleRoot: '08e23107e8449f02568d37d37aa76e840e55bbb5f100ed8ad257af303db88c08',
          time: 1526756523,
          bits: parseInt('207fffff', 16),
          height: 1,
          mintedBlocks: 1,
          stakeModifier: '08e23107e8449f02568d37d37aa76e840e55bbb5f100ed8ad257af303db88c08',
          sig: '08e23107e8449f02568d37d37aa76e840e55bbb5f100ed8ad257af303db88c08',
        },
        chain: 'DFI',
        network: 'testnet'
      };

      await BlockStorage.handleReorg(params);
      expect(blockModelRemoveSpy.notCalled).to.be.true;
      expect(transactionModelRemoveSpy.notCalled).to.be.true;
      expect(coinModelRemoveSpy.notCalled).to.be.true;
      expect(coinModelUpdateSpy.notCalled).to.be.true;
    });

    it('should return if localTip height is zero', async () => {
      let blockModelRemoveSpy = BlockStorage.collection.deleteMany as sinon.SinonSpy;
      let transactionModelRemoveSpy = TransactionStorage.collection.deleteMany as sinon.SinonSpy;
      let coinModelRemoveSpy = CoinStorage.collection.deleteMany as sinon.SinonSpy;
      let coinModelUpdateSpy = CoinStorage.collection.updateMany as sinon.SinonSpy;

      let blockMethodParams = {
        chain: 'DFI',
        network: 'testnet',
        block: TEST_BLOCK,
        height: 1355
      };
      let params = Object.assign(BlockStorage, blockMethodParams);

      await BlockStorage.handleReorg(params);
      expect(blockModelRemoveSpy.notCalled).to.be.true;
      expect(transactionModelRemoveSpy.notCalled).to.be.true;
      expect(coinModelRemoveSpy.notCalled).to.be.true;
      expect(coinModelUpdateSpy.notCalled).to.be.true;
    });

    it('should call blockModel deleteMany', async () => {
      mockStorage({
        height: 1,
        previousBlockHash: '3420349f63d96f257d56dd970f6b9079af9cf2784c267a13b1ac339d47031fe9'
      });
      let blockMethodParams = {
        chain: 'DFI',
        network: 'testnet',
        block: TEST_BLOCK,
        height: 1355
      };
      let params = Object.assign(BlockStorage, blockMethodParams);
      const removeSpy = BlockStorage.collection.deleteMany as sinon.SinonSpy;

      await BlockStorage.handleReorg(params);
      expect(removeSpy.called).to.be.true;
    });

    it('should call transactionModel deleteMany', async () => {
      mockStorage({
        height: 1,
        previousBlockHash: '3420349f63d96f257d56dd970f6b9079af9cf2784c267a13b1ac339d47031fe9'
      });

      let blockMethodParams = {
        chain: 'DFI',
        network: 'testnet',
        block: TEST_BLOCK,
        height: 1355
      };
      let params = Object.assign(BlockStorage, blockMethodParams);
      const removeSpy = TransactionStorage.collection.deleteMany as sinon.SinonSpy;

      await BlockStorage.handleReorg(params);
      expect(removeSpy.called).to.be.true;
    });

    it('should call coinModel deleteMany', async () => {
      mockStorage({
        height: 1,
        previousBlockHash: '3420349f63d96f257d56dd970f6b9079af9cf2784c267a13b1ac339d47031fe9'
      });

      let blockMethodParams = {
        chain: 'DFI',
        network: 'testnet',
        block: TEST_BLOCK,
        height: 1355
      };
      let params = Object.assign(BlockStorage, blockMethodParams);
      const collectionSpy = Storage.db!.collection as sinon.SinonSpy;
      const removeSpy = CoinStorage.collection.deleteMany as sinon.SinonSpy;

      await BlockStorage.handleReorg(params);
      expect(collectionSpy.calledOnceWith('coins'));
      expect(removeSpy.callCount).to.eq(3);
    });

    it('should call coinModel update', async () => {
      mockStorage({
        height: 1,
        previousBlockHash: '3420349f63d96f257d56dd970f6b9079af9cf2784c267a13b1ac339d47031fe9'
      });

      let blockMethodParams = {
        chain: 'DFI',
        network: 'testnet',
        block: TEST_BLOCK,
        height: 1355
      };
      let params = Object.assign(BlockStorage, blockMethodParams);
      const collectionSpy = Storage.db!.collection as sinon.SinonSpy;
      const updateSpy = CoinStorage.collection.updateMany as sinon.SinonSpy;

      await BlockStorage.handleReorg(params);
      expect(collectionSpy.calledOnceWith('coins'));
      expect(updateSpy.called).to.be.true;
    });
  });

  describe('_apiTransform', () => {
    it('should return the transform object with block values', () => {
      const block: IBlock = {
        chain: 'DFI',
        network: 'testnet',
        height: 1,
        hash: 'abcd',
        version: 1,
        merkleRoot: 'deff',
        time: new Date(),
        timeNormalized: new Date(),
        previousBlockHash: 'aabb',
        nextBlockHash: 'bbcc',
        transactionCount: 1,
        size: 255,
        bits: 256,
        reward: 5000000000,
        processed: true
      };

      const result = BlockStorage._apiTransform(block, { object: true });

      expect(result.hash).to.be.equal(block.hash);
      expect(result.height).to.be.equal(block.height);
      expect(result.version).to.be.equal(block.version);
      expect(result.size).to.be.equal(block.size);
      expect(result.merkleRoot).to.be.equal(block.merkleRoot);
      expect(result.time).to.equal(block.time);
      expect(result.timeNormalized).to.equal(block.timeNormalized);
      expect(result.bits).to.be.equal(block.bits);
      expect(result.previousBlockHash).to.be.equal(block.previousBlockHash);
      expect(result.nextBlockHash).to.be.equal(block.nextBlockHash);
      expect(result.transactionCount).to.be.equal(block.transactionCount);
      expect(result).to.not.have.property('processed');
    });
  });
});
