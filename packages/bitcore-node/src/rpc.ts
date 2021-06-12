import request = require('request');
import { LoggifyClass } from './decorators/Loggify';
type CallbackType = (err: any, data?: any) => any;

@LoggifyClass
export class RPC {
  constructor(private username: string, private password: string, private host: string, private port: number) {}

  public callMethod(method: string, params: any, callback: CallbackType) {
    request(
      {
        method: 'POST',
        url: `http://${this.username}:${this.password}@${this.host}:${this.port}`,
        body: {
          jsonrpc: '1.0',
          id: Date.now(),
          method: method,
          params: params,
        },
        json: true,
      },
      (err, res) => {
        if (err) {
          return callback(err);
        } else if (res) {
          if (res.body) {
            if (res.body.error) {
              return callback(res.body.error);
            } else if (res.body.result !== undefined) {
              return callback(null, res.body && res.body.result);
            } else {
              return callback({ msg: 'No error or body found', body: res.body });
            }
          }
        } else {
          return callback('No response or error returned by rpc call');
        }
      }
    );
  }

  async asyncCall<T = any>(method: string, params: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      this.callMethod(method, params, (err, data) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log(err.message);
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  getChainTip(callback: CallbackType) {
    this.callMethod('getchaintips', [], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result[0]);
    });
  }

  getBestBlockHash(callback: CallbackType) {
    this.callMethod('getbestblockhash', [], callback);
  }

  getBlockHeight(callback: CallbackType) {
    this.callMethod('getblockcount', [], callback);
  }

  getBlock(hash: string, verbose: boolean, callback: CallbackType) {
    this.callMethod('getblock', [hash, verbose], callback);
  }

  getBlockHash(height: number, callback: CallbackType) {
    this.callMethod('getblockhash', [height], callback);
  }

  getBlockByHeight(height: number, callback: CallbackType) {
    this.getBlockHash(height, (err, hash) => {
      if (err) {
        return callback(err);
      }
      this.getBlock(hash, false, callback);
    });
  }

  getTransaction(txid: string, callback: CallbackType) {
    this.callMethod('getrawtransaction', [txid, true], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  }

  sendTransaction(rawTx: string, callback: CallbackType) {
    this.callMethod('sendrawtransaction', [rawTx], callback);
  }

  decodeScript(hex: string, callback: CallbackType) {
    this.callMethod('decodescript', [hex], callback);
  }

  getWalletAddresses(account: string, callback: CallbackType) {
    this.callMethod('getaddressesbyaccount', [account], callback);
  }

  async getEstimateSmartFee(target: number) {
    return this.asyncCall('estimatesmartfee', [target]);
  }

  async getEstimateFee(target: number) {
    return this.asyncCall('estimatefee', [target]);
  }

  async getCustomTxApplied(txid: string, blockHeight: number) {
    return this.asyncCall('isappliedcustomtx', [txid, blockHeight]);
  }

  async getToken(token: number): Promise<any> {
    return this.asyncCall('gettoken', [token]);
  }
  
  async getRawTx(txId: string): Promise<string> {
    return this.asyncCall<string>('getrawtransaction', [txId]);
  }

  async decodeRawTx(hex: string): Promise<JSON> {
    return this.asyncCall<JSON>('decoderawtransaction', [hex]);
  }

  async getAnchoredBlock(
    minBtcHeight?: number,
    maxBtcHeight?: number,
    minConfs?: number,
    maxConfs?: number
  ): Promise<any> {
    return this.asyncCall('listanchors', []);
  }
}
@LoggifyClass
export class AsyncRPC {
  private rpc: RPC;

  constructor(username: string, password: string, host: string, port: number) {
    this.rpc = new RPC(username, password, host, port);
  }

  async call<T = any>(method: string, params: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.rpc.callMethod(method, params, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  async block(hash: string): Promise<RPCBlock<string>> {
    return (await this.call('getblock', [hash, 1])) as RPCBlock<string>;
  }

  async verbose_block(hash: string): Promise<RPCBlock<RPCTransaction>> {
    return (await this.call('getblock', [hash, 2])) as RPCBlock<RPCTransaction>;
  }

  async generate(n: number): Promise<string[]> {
    return (await this.call('generate', [n])) as string[];
  }

  async getnewaddress(account: string): Promise<string> {
    return (await this.call('getnewaddress', [account])) as string;
  }

  async transaction(txid: string, block?: string): Promise<RPCTransaction> {
    const args = [txid, true];
    if (block) {
      args.push(block);
    }
    return (await this.call('getrawtransaction', args)) as RPCTransaction;
  }

  async sendtoaddress(address: string, value: string | number) {
    return this.call<string>('sendtoaddress', [address, value]);
  }
}

export type RPCBlock<T> = {
  hash: string;
  confirmations: number;
  size: number;
  strippedsize: number;
  weight: number;
  height: number;
  version: number;
  versionHex: string;
  merkleroot: string;
  tx: T[];
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  previousblockhash: string;
  nextblockhash: string;
};

export type RPCTransaction = {
  in_active_chain: boolean;
  hex: string;
  txid: string;
  hash: string;
  strippedsize: number;
  size: number;
  vsize: number;
  version: number;
  locktime: number;
  vin: {
    txid: string;
    vout: number;
    scriptSig: {
      asm: string;
      hex: string;
    };
    sequence: number;
    txinwitness: string[];
  }[];
  vout: {
    value: number;
    n: number;
    scriptPubKey: {
      asm: string;
      hex: string;
      reqSigs: number;
      type: string;
      addresses: string[];
    };
  }[];
  blockhash: string;
  confirmations: number;
  time: number;
  blocktime: number;
};
