'use strict';

var bitcore = require('../..');
var BN = require('../../lib/crypto/bn');
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;
var BufferUtil = require('../../lib/util/buffer');

var BlockHeader = bitcore.BlockHeader;
var fs = require('fs');
var should = require('chai').should();

// https://test-insight.bitpay.com/block/000000000b99b16390660d79fcc138d2ad0c89a0d044c4201a02bdf1f61ffa11
var dataRawBlockBuffer = fs.readFileSync('test/data/blk1243-defitest.dat');
var dataRawBlockBinary = fs.readFileSync('test/data/blk1243-defitest.dat', 'binary');
var dataRawId = 'f3c21abad9ea295cc7c22c870e2950b85198c3d13cecbc02b6f01c33f22fbc6d';
var data = require('../data/blk1243-defitest');

describe('BlockHeader', function() {
  var version;
  var prevblockidbuf;
  var merklerootbuf;
  var time;
  var bits;
  var stakeModifierbuf;
  var height;
  var mintedBlocks;
  var sigbuf;
  var bh;
  var bhhex;
  var bhbuf;

  before(function () {
    version = data.version;
    prevblockidbuf = new Buffer(data.prevblockidhex, 'hex');
    merklerootbuf = new Buffer(data.merkleroothex, 'hex');
    time = data.time;
    bits = data.bits;
    stakeModifierbuf = new Buffer(data.stakeModifierhex, 'hex');
    height = data.height;
    mintedBlocks = data.mintedBlocks;
    sigbuf = new Buffer(data.sighex, 'hex');
    bh = new BlockHeader({
      version: version,
      prevHash: prevblockidbuf,
      merkleRoot: merklerootbuf,
      time: time,
      bits: bits,
      stakeModifier: stakeModifierbuf,
      height: height,
      mintedBlocks: mintedBlocks,
      sig: sigbuf,
    });
    bhhex = data.blockheaderhex;
    bhbuf = new Buffer(bhhex, 'hex');
  });

  it('should make a new blockheader', function() {
    BlockHeader(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
  });

  it('should not make an empty block', function() {
    (function() {
      BlockHeader();
    }).should.throw('Unrecognized argument for BlockHeader');
  });

  describe('#constructor', function() {

    it('should set all the variables', function() {
      var bh = new BlockHeader({
        version: version,
        prevHash: prevblockidbuf,
        merkleRoot: merklerootbuf,
        time: time,
        bits: bits,
        stakeModifier: stakeModifierbuf,
        height: height,
        mintedBlocks: mintedBlocks,
        sig: sigbuf,
      });
      should.exist(bh.version);
      should.exist(bh.prevHash);
      should.exist(bh.merkleRoot);
      should.exist(bh.time);
      should.exist(bh.bits);
      should.exist(bh.stakeModifier);
      should.exist(bh.height);
      should.exist(bh.mintedBlocks);
      should.exist(bh.sig);
    });

    it('will throw an error if the argument object hash property doesn\'t match', function() {
      (function() {
        BlockHeader({
          hash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
          version: version,
          prevHash: prevblockidbuf,
          merkleRoot: merklerootbuf,
          time: time,
          bits: bits,
          stakeModifier: stakeModifierbuf,
          height: height,
          mintedBlocks: mintedBlocks,
          sig: sigbuf,
        });
      }).should.throw('Argument object hash property does not match block hash.');
    });

    it('should have correct hash for object arg', function() {
      BlockHeader({
        version: version,
        prevHash: prevblockidbuf,
        merkleRoot: merklerootbuf,
        time: time,
        bits: bits,
        stakeModifier: stakeModifierbuf,
        height: height,
        mintedBlocks: mintedBlocks,
        sig: sigbuf,
      }).hash.should.equal('f3c21abad9ea295cc7c22c870e2950b85198c3d13cecbc02b6f01c33f22fbc6d');
    });

    it('should have correct hash for buffer arg', function() {
        BlockHeader(bhbuf).hash.should.equal('f3c21abad9ea295cc7c22c870e2950b85198c3d13cecbc02b6f01c33f22fbc6d');
    });
  });

  describe('version', function() {
    it('is interpreted as an int32le', function() {
      var hex = 'ffffffff00000000000000000000000000000000000000000000000000000000000000004141414141414141414141414141414141414141414141414141414141414141010000000200000003000000084b80ccd3055e25836c250c46b314f72e0b49f83c347110f329fa6bdb040000000000009d03000000000000411f17a570bbaab9ae44d02e2ba7bdd749bf903a3df6f7f54b15b299caaa15da7167071c1e340e12b9ca3c140e543fc19787d01a0ba7e74574c6c5dac59da926b9d6';
      var header = BlockHeader.fromBuffer(new Buffer(hex, 'hex'));
      header.version.should.equal(-1);
      header.timestamp.should.equal(1);
    });
  });


  describe('#fromObject', function() {

    it('should set all the variables', function() {
      var bh = BlockHeader.fromObject({
        hash: 'f3c21abad9ea295cc7c22c870e2950b85198c3d13cecbc02b6f01c33f22fbc6d',
        version: version,
        prevHash: BufferUtil.reverse(prevblockidbuf).toString('hex'),
        merkleRoot: BufferUtil.reverse(merklerootbuf).toString('hex'),
        time: time,
        bits: bits,
        stakeModifier: BufferUtil.reverse(stakeModifierbuf).toString('hex'),
        height: height,
        mintedBlocks: mintedBlocks,
        sig: sigbuf.toString('hex'),
      });
      should.exist(bh.version);
      should.exist(bh.prevHash);
      should.exist(bh.merkleRoot);
      should.exist(bh.time);
      should.exist(bh.bits);
      should.exist(bh.stakeModifier);
      should.exist(bh.height);
      should.exist(bh.mintedBlocks);
      should.exist(bh.sig);
    });

  });

  describe('#toJSON', function() {

    it('should set all the variables', function() {
      var json = bh.toJSON();
      should.exist(json.version);
      should.exist(json.prevHash);
      should.exist(json.merkleRoot);
      should.exist(json.time);
      should.exist(json.bits);
      should.exist(json.height);
      should.exist(json.mintedBlocks);
      should.exist(json.stakeModifier);
      should.exist(json.sig);
    });

  });

  describe('#fromJSON', function() {

    it('should parse this known json string', function() {

      var jsonString = JSON.stringify({
        version: version,
        prevHash: BufferUtil.reverse(prevblockidbuf).toString('hex'),
        merkleRoot: BufferUtil.reverse(merklerootbuf).toString('hex'),
        time: time,
        bits: bits,
        stakeModifier: BufferUtil.reverse(stakeModifierbuf).toString('hex'),
        height: height,
        mintedBlocks: mintedBlocks,
        sig: sigbuf.toString('hex'),
      });

      var json = new BlockHeader(JSON.parse(jsonString));
      should.exist(json.version);
      should.exist(json.prevHash);
      should.exist(json.merkleRoot);
      should.exist(json.time);
      should.exist(json.bits);
      should.exist(json.stakeModifier);
      should.exist(json.height);
      should.exist(json.mintedBlocks);
      should.exist(json.sig);
    });

  });

  describe('#fromString/#toString', function() {

    it('should output/input a block hex string', function() {
      var b = BlockHeader.fromString(bhhex);
      b.toString().should.equal(bhhex);
    });

  });

  describe('#fromBuffer', function() {

    it('should parse this known buffer', function() {
      BlockHeader.fromBuffer(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
    });

  });

  describe('#fromBufferReader', function() {

    it('should parse this known buffer', function() {
      BlockHeader.fromBufferReader(BufferReader(bhbuf)).toBuffer().toString('hex').should.equal(bhhex);
    });

  });

  describe('#toBuffer', function() {

    it('should output this known buffer', function() {
      BlockHeader.fromBuffer(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
    });

  });

  describe('#toBufferWriter', function() {

    it('should output this known buffer', function() {
      BlockHeader.fromBuffer(bhbuf).toBufferWriter().concat().toString('hex').should.equal(bhhex);
    });

    it('doesn\'t create a bufferWriter if one provided', function() {
      var writer = new BufferWriter();
      var blockHeader = BlockHeader.fromBuffer(bhbuf);
      blockHeader.toBufferWriter(writer).should.equal(writer);
    });

  });

  describe('#inspect', function() {

    it('should return the correct inspect of the genesis block', function() {
      var block = BlockHeader.fromRawBlock(dataRawBlockBinary);
      block.inspect().should.equal('<BlockHeader '+dataRawId+'>');
    });

  });

  describe('#fromRawBlock', function() {

    it('should instantiate from a raw block binary', function() {
      var x = BlockHeader.fromRawBlock(dataRawBlockBinary);
      x.version.should.equal(536870912);
      new BN(x.bits).toString('hex').should.equal('1c2513a7');
    });

    it('should instantiate from raw block buffer', function() {
      var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      x.version.should.equal(536870912);
      new BN(x.bits).toString('hex').should.equal('1c2513a7');
    });

  });

  describe('#validTimestamp', function() {

    var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);

    it('should validate timpstamp as true', function() {
      var valid = x.validTimestamp(x);
      valid.should.equal(true);
    });


    it('should validate timestamp as false', function() {
      x.time = Math.round(new Date().getTime() / 1000) + BlockHeader.Constants.MAX_TIME_OFFSET + 100;
      var valid = x.validTimestamp(x);
      valid.should.equal(false);
    });

  });

  // describe('#validProofOfWork', function() {
  //
  //   it('should validate proof-of-work as true', function() {
  //     var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
  //     var valid = x.validProofOfWork(x);
  //     valid.should.equal(true);
  //
  //   });
  //
  //   it('should validate proof of work as false because incorrect proof of work', function() {
  //     var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
  //     var nonce = x.nonce;
  //     x.nonce = 0;
  //     var valid = x.validProofOfWork(x);
  //     valid.should.equal(false);
  //     x.nonce = nonce;
  //   });
  //
  // });

  describe('#getDifficulty', function() {
    it('should get the correct difficulty for block 86756', function() {
      var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      x.bits.should.equal(0x1c2513a7);
      x.getDifficulty().should.equal(6.90448803);
    });

    it('should get the correct difficulty for testnet block 552065', function() {
      var x = new BlockHeader({
        bits: 0x1b00c2a8
      });
      x.getDifficulty().should.equal(86187.62562209);
    });

    it('should get the correct difficulty for livenet block 373043', function() {
      var x = new BlockHeader({
        bits: 0x18134dc1
      });
      x.getDifficulty().should.equal(56957648455.01001);
    });

    it('should get the correct difficulty for livenet block 340000', function() {
      var x = new BlockHeader({
        bits: 0x1819012f
      });
      x.getDifficulty().should.equal(43971662056.08958);
    });

    it('should use exponent notation if difficulty is larger than Javascript number', function() {
      var x = new BlockHeader({
        bits: 0x0900c2a8
      });
      x.getDifficulty().should.equal(1.9220482782645836 * 1e48);
    });
  });

  it('coverage: caches the "_id" property', function() {
      var blockHeader = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      blockHeader.id.should.equal(blockHeader.id);
  });

});
