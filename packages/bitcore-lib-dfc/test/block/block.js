'use strict';

var bitcore = require('../..');
var BN = require('../../lib/crypto/bn');
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;
var BlockHeader = bitcore.BlockHeader;
var Block = bitcore.Block;
var chai = require('chai');
var fs = require('fs');
var should = chai.should();
var Transaction = bitcore.Transaction;

// https://test-insight.bitpay.com/block/000000000b99b16390660d79fcc138d2ad0c89a0d044c4201a02bdf1f61ffa11
var dataRawBlockBuffer = fs.readFileSync('test/data/blk1243-defitest.dat');
var dataRawBlockBinary = fs.readFileSync('test/data/blk1243-defitest.dat', 'binary');
var dataJson = fs.readFileSync('test/data/blk1243-defitest.json').toString();
var data = require('../data/blk1243-defitest');
var dataBlocks = require('../data/bitcoind/blocks');

describe('Block', function() {
  var blockhex;
  var blockbuf;
  var bh;
  var txs = [];
  var json;
  var genesishex;
  var genesisbuf;
  var genesisidhex;
  var blockOneHex;
  var blockOneBuf;
  var blockOneId;

  before(function () {
    blockhex = data.blockhex;
    blockbuf = new Buffer(blockhex, 'hex');
    bh = BlockHeader.fromBuffer(new Buffer(data.blockheaderhex, 'hex'));
    txs = [];
    JSON.parse(dataJson).transactions.forEach(function(tx) {
      txs.push(new Transaction().fromObject(tx));
    });
    json = dataJson;

    genesishex = '01000000000000000000000000000000000000000000000000000000000000000000000006d15aa8387597bc92fa26b645745328799a640a26c87f2e9f6a2f3b3ddf22aef52e4a4dffff001d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000501000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4e0004ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100c817a804000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac0000000001000000010000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff0200e1f505000000001c6a1a446654784301973b63dac26d40e0dbdcaa27457a36c44576516900ca9a3b000000001976a914c52fcb3c6dd28e530e5d162fee41f235bf7709cd88ac0000000001000000010000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff0200e1f505000000001c6a1a4466547843012b8ea722de3e0478bcff36cd869551e4cdd61c5b00ca9a3b000000001976a914b9eddc0d355344af8e9863ba56b087b6a2d22def88ac0000000001000000010000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff0200e1f505000000001c6a1a446654784301b899863909638e8cbd3ff0b53f280bc618775d5d00ca9a3b000000001976a9141ad1ba5d8a2dacdc0687d6a0d766efcfee13fb8288ac0000000001000000010000000000000000000000000000000000000000000000000000000000000000ffffffff00ffffffff0200e1f505000000001c6a1a4466547843011e44f9c24c1085b1d280350af78c061c69cc2d5e00ca9a3b000000001976a914c10e46caefcb2402f3f1c29d6c88a4416c96bdf488ac00000000';
    genesisbuf = new Buffer(genesishex, 'hex');
    genesisidhex = '0000088af9af8ea4627c5fb2d6cf2075235caaaf62aae791040700cbcaa05cc7';
    blockOneHex = '0000002088f7d87af992ae6732cadca522144fe4995ad5435a31b8906ede6dac6937e91e66220917698a8b85fedf8b8bb877dacd47454c551665c5ca63947d21b8aa790f82e8ed5dfcff031df00c27c7432800319144caba0d8a0ed3c0e64199e9d6855e65ff18fbc5c484349a020000000000006001000000000000411fc5e507d9758ad317a8e8f71ace2ce7bdf8bca102bcb229b84d22d56f563d2562487be0621e235faa2b87c23b08ceb16286e99c4a1f417dab1c65fcf05ba299c701020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff04029a0200ffffffff030034e230040000001976a914973b63dac26d40e0dbdcaa27457a36c44576516988ac00943577000000001976a9142bbdcdb7f90e8bb1a1ae5eb7d0b2f7b1a029ece688ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000';
    blockOneBuf = new Buffer(blockOneHex, 'hex');
    blockOneId = '8c2731fad796605e7ac8108d0659595f5bc32f6c57a8b0a8a65661c0f43ae570';
  });

  it('should make a new block', function() {
    var b = Block(blockbuf);
    b.toBuffer().toString('hex').should.equal(blockhex);
  });

  it('should not make an empty block', function() {
    (function() {
      return new Block();
    }).should.throw('Unrecognized argument for Block');
  });

  describe('#constructor', function() {

    it('should set these known values', function() {
      var b = new Block({
        header: bh,
        transactions: txs
      });
      should.exist(b.header);
      should.exist(b.transactions);
    });

    it('should properly deserialize blocks', function() {
      dataBlocks.forEach(function(block) {
        var b = Block.fromBuffer(new Buffer(block.data, 'hex'));
        b.transactions.length.should.equal(block.transactions);
      });
    });

  });

  describe('#fromRawBlock', function() {

    it('should instantiate from a raw block binary', function() {
      var x = Block.fromRawBlock(dataRawBlockBinary);
      x.header.version.should.equal(536870912);
      new BN(x.header.bits).toString('hex').should.equal('1c2513a7');
    });

    it('should instantiate from raw block buffer', function() {
      var x = Block.fromRawBlock(dataRawBlockBuffer);
      x.header.version.should.equal(536870912);
      new BN(x.header.bits).toString('hex').should.equal('1c2513a7');
    });

  });

  describe('#fromJSON', function() {

    it('should set these known values', function() {
      var block = Block.fromObject(JSON.parse(json));
      should.exist(block.header);
      should.exist(block.transactions);
    });

    it('should set these known values', function() {
      var block = new Block(JSON.parse(json));
      should.exist(block.header);
      should.exist(block.transactions);
    });

  });

  describe('#toJSON', function() {

    it('should recover these known values', function() {
      var block = Block.fromObject(JSON.parse(json));
      var b = block.toJSON();
      should.exist(b.header);
      should.exist(b.transactions);
    });

  });

  describe('#fromString/#toString', function() {

    it('should output/input a block hex string', function() {
      var b = Block.fromString(blockhex);
      b.toString().should.equal(blockhex);
    });

  });

  describe('#fromBuffer', function() {

    it('should make a block from this known buffer', function() {
      var block = Block.fromBuffer(blockbuf);
      block.toBuffer().toString('hex').should.equal(blockhex);
    });

    it('should instantiate from block buffer from the network', function() {
      var networkBlock = '000000201c669f5a5ca05657405e6982c42f4ee1621309e65838eb3fae0d83d53487eda05e86314efe81ea6a5dd56356b3cb469986fd3f29279831b3f185ae7d28c054ae5009ee5da713251c85f750b5084b80ccd3055e25836c250c46b314f72e0b49f83c347110f329fa6bdb040000000000009d03000000000000411f17a570bbaab9ae44d02e2ba7bdd749bf903a3df6f7f54b15b299caaa15da7167071c1e340e12b9ca3c140e543fc19787d01a0ba7e74574c6c5dac59da926b9d601020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff0402db0400ffffffff030034e230040000001976a914973b63dac26d40e0dbdcaa27457a36c44576516988ac00943577000000001976a9142bbdcdb7f90e8bb1a1ae5eb7d0b2f7b1a029ece688ac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000';
      var x = Block.fromBuffer(networkBlock);
      x.toBuffer().toString('hex').should.equal(networkBlock);
    });

  });

  describe('#fromBufferReader', function() {

    it('should make a block from this known buffer', function() {
      var block = Block.fromBufferReader(BufferReader(blockbuf));
      block.toBuffer().toString('hex').should.equal(blockhex);
    });

  });

  describe('#toBuffer', function() {

    it('should recover a block from this known buffer', function() {
      var block = Block.fromBuffer(blockbuf);
      block.toBuffer().toString('hex').should.equal(blockhex);
    });

  });

  describe('#toBufferWriter', function() {

    it('should recover a block from this known buffer', function() {
      var block = Block.fromBuffer(blockbuf);
      block.toBufferWriter().concat().toString('hex').should.equal(blockhex);
    });

    it('doesn\'t create a bufferWriter if one provided', function() {
      var writer = new BufferWriter();
      var block = Block.fromBuffer(blockbuf);
      block.toBufferWriter(writer).should.equal(writer);
    });

  });

  describe('#toObject', function() {

    it('should recover a block from genesis block buffer', function() {
      var block = Block.fromBuffer(blockOneBuf);
      block.id.should.equal(blockOneId);
      block.toObject().should.deep.equal({
        header: {
          hash: '8c2731fad796605e7ac8108d0659595f5bc32f6c57a8b0a8a65661c0f43ae570',
          version: 536870912,
          prevHash: '1ee93769ac6dde6e90b8315a43d55a99e44f1422a5dcca3267ae92f97ad8f788',
          merkleRoot: '0f79aab8217d9463cac56516554c4547cdda77b88b8bdffe858b8a6917092266',
          time: 1575872642,
          bits: 486801404,
          stakeModifier: '3484c4c5fb18ff655e85d6e99941e6c0d30e8a0dbaca449131002843c7270cf0',
          height: 666,
          mintedBlocks: 352,
          sig: '1fc5e507d9758ad317a8e8f71ace2ce7bdf8bca102bcb229b84d22d56f563d2562487be0621e235faa2b87c23b08ceb16286e99c4a1f417dab1c65fcf05ba299c7',
          minedBy: '02ae418f9ac8b8d683bf765410fbb7a314db539b84426d67d635056d9c02a9c13f',
        },
        transactions: [{
          hash: '0f79aab8217d9463cac56516554c4547cdda77b88b8bdffe858b8a6917092266',
          version: 2,
          inputs: [{
            prevTxId: '0000000000000000000000000000000000000000000000000000000000000000',
            outputIndex: 4294967295,
            sequenceNumber: 4294967295,
            script: '029a0200'
          }],
          outputs: [
            {
              satoshis: 18000000000,
              script: '76a914973b63dac26d40e0dbdcaa27457a36c44576516988ac'
            },
            {
              satoshis: 2000000000,
              script: '76a9142bbdcdb7f90e8bb1a1ae5eb7d0b2f7b1a029ece688ac'
            },
            {
              satoshis: 0,
              script: "6a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf9"
            }
          ],
          nLockTime: 0
        }]
      });
    });

    it('roundtrips correctly', function() {
      var block = Block.fromBuffer(blockOneBuf);
      var obj = block.toObject();
      var block2 = Block.fromObject(obj);
      block2.toObject().should.deep.equal(block.toObject());
    });

  });

  describe('#_getHash', function() {

    it('should return the correct hash of the genesis block', function() {
      var block = Block.fromBuffer(genesisbuf);
      var blockhash = new Buffer(Array.apply([], new Buffer(genesisidhex, 'hex')).reverse());
      block._getHash().toString('hex').should.equal(blockhash.toString('hex'));
    });
  });

  describe('#id', function() {

    it('should return the correct id of the genesis block', function() {
      var block = Block.fromBuffer(genesisbuf);
      block.id.should.equal(genesisidhex);
    });
    it('"hash" should be the same as "id"', function() {
      var block = Block.fromBuffer(genesisbuf);
      block.id.should.equal(block.hash);
    });

  });

  describe('#inspect', function() {

    it('should return the correct inspect of the genesis block', function() {
      var block = Block.fromBuffer(genesisbuf);
      block.inspect().should.equal('<Block ' + genesisidhex + '>');
    });

  });

  describe('#merkleRoot', function() {

    it('should describe as valid merkle root', function() {
      var x = Block.fromRawBlock(dataRawBlockBinary);
      var valid = x.validMerkleRoot();
      valid.should.equal(true);
    });

    it('should describe as invalid merkle root', function() {
      var x = Block.fromRawBlock(dataRawBlockBinary);
      x.transactions.push(new Transaction());
      var valid = x.validMerkleRoot();
      valid.should.equal(false);
    });

    it('should get a null hash merkle root', function() {
      var x = Block.fromRawBlock(dataRawBlockBinary);
      x.transactions = []; // empty the txs
      var mr = x.getMerkleRoot();
      mr.should.deep.equal(Block.Values.NULL_HASH);
    });

  });

});
