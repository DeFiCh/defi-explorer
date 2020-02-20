const bitcoreLib = require('bitcore-lib-dfi');
const { Transaction, PrivateKey } = bitcoreLib;
const UnspentOutput = Transaction.UnspentOutput;

import config from '../../src/config';
import { Storage } from '../../src/services/storage';
import { BlockStorage } from '../../src/models/block';
import { DefichainBlockType } from '../../src/types/namespaces/Defichain/Block';
import { resetDatabase } from '../helpers/index.js';
import * as crypto from 'crypto';

function randomHash() {
  return crypto.randomBytes(32).toString('hex');
}
function* generateBlocks(blockCount: number, blockSizeMb: number) {
  let prevBlock: DefichainBlockType | undefined = undefined;
  for (let i = 0; i < blockCount; i++) {
    let tempBlock = generateBlock(blockSizeMb, prevBlock);
    yield tempBlock;
    prevBlock = tempBlock;
  }
}

function preGenerateBlocks(blockCount: number, blockSizeMb: number) {
  const blocks = new Array<DefichainBlockType>();
  for (let block of generateBlocks(blockCount, blockSizeMb)) {
    blocks.push(block);
  }
  return blocks;
}

function generateBlock(blockSizeMb: number, previousBlock?: DefichainBlockType): DefichainBlockType {
  const txAmount = 100000;
  const prevHash = previousBlock ? previousBlock.hash : '';
  let block: DefichainBlockType = {
    hash: randomHash(),
    transactions: [],
    toBuffer: () => {
      return { length: 264 } as Buffer;
    },
    header: {
      toObject: () => ({
          hash: randomHash(),
          version: 536870912,
          prevHash: prevHash,
          merkleRoot: randomHash(),
          time: 1526756523,
          bits: parseInt('207fffff', 16),
          height: 1355,
          mintedBlocks: 1354,
          stakeModifier: randomHash(),
          sig: randomHash(),
      }),
    },
  };
  let transactions = new Array<any>();
  if (previousBlock) {
    for (let transaction of previousBlock.transactions) {
      // each transaction should have one input and one output
      const utxos = transaction.outputs.map(output => {
        return new UnspentOutput({
          txid: transaction.hash,
          vout: 0,
          address: output.script.toAddress('mainnet'),
          scriptPubKey: output.script.toBuffer().toString('hex'),
          amount: Number(txAmount)
        });
      });
      let newTx = new Transaction().from(utxos);
      for (let _ of newTx.inputs) {
        newTx.to(newAddress(), txAmount);
      }
      transactions.push(newTx);
    }
    block.transactions = transactions;
  } else {
    let txPerMb = 2500;
    let blockSize = txPerMb * blockSizeMb;
    for (let i = 0; i < blockSize; i++) {
      let newTx = new Transaction().to(newAddress(), txAmount);
      block.transactions.push(newTx);
    }
  }
  return block;
}

let addresses = new Array<string>();
for (let i = 0; i < 100; i++) {
  var privateKey = new PrivateKey();
  var publicKey = privateKey.toPublicKey();
  var address = publicKey.toAddress().toString();
  addresses.push(address);
}

function newAddress() {
  let index = Math.floor(Math.random() * 100);
  return addresses[index];
}

function startBenchmarkDatabase() {
  const storageArgs = {
    dbHost: config.dbHost,
    dbName: 'bitcore-benchmark'
  };

  return Storage.start(storageArgs);
}

async function benchmark(blockCount: number, blockSizeMb: number) {
  await resetDatabase();
  console.log('Generating blocks');
  const blocks = preGenerateBlocks(blockCount, blockSizeMb);
  const startTime = new Date();
  console.log('Adding blocks');
  for (let block of blocks) {
    process.stdout.write('.');
    await BlockStorage.addBlock({ block, chain: 'BENCH', network: 'MARK', initialSyncComplete: false });
  }
  process.stdout.write('\n');
  const endTime = new Date();
  const time = endTime.getTime() - startTime.getTime();
  const seconds = time / 1000;
  console.log(`Benchmark for ${blockCount} (${blockSizeMb} MB) blocks completed after ${seconds} s`);
  console.log(`${(blockSizeMb * blockCount) / seconds} MB/s`);
  console.log(`${seconds / blockCount} Seconds/Block`);
}

startBenchmarkDatabase()
  .then(() => benchmark(80, 1))
  .then(() => benchmark(5, 32))
  .then(() => process.exit());
