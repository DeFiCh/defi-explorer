import { Component, Input, OnInit } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';
import { BlocksProvider } from '../../providers/blocks/blocks';
import { CurrencyProvider } from '../../providers/currency/currency';
import { DefaultProvider } from '../../providers/default/default';
import { RedirProvider } from '../../providers/redir/redir';
import {
  ApiCoin,
  TxsProvider
} from '../../providers/transactions/transactions';

/**
 * Generated class for the TransactionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'transaction',
  templateUrl: 'transaction.html'
})
export class TransactionComponent implements OnInit {
  public expanded = false;
  @Input()
  public tx: any = {};
  @Input()
  public showCoins = false;
  public confirmations: number;
  public network;

  private COIN = 100000000;

  constructor(
    public currencyProvider: CurrencyProvider,
    public defaultProvider: DefaultProvider,
    public apiProvider: ApiProvider,
    public txProvider: TxsProvider,
    public redirProvider: RedirProvider,
    public blocksProvider: BlocksProvider
  ) {
    this.network = defaultProvider.getDefault('%NETWORK%');
  }

  public ngOnInit(): void {
    this.showCoins ? this.getCoins() : this.getConfirmations();
  }

  public getCoins(): void {
    this.txProvider.getCoins(this.tx.txid).subscribe(data => {
      this.tx.vin = data.inputs;
      this.tx.vout = data.outputs;
      this.tx.fee = this.txProvider.getFee(this.tx);
      this.tx.valueOut = data.outputs.reduce((a, b) => a + b.value, 0);
      this.getConfirmations();
    });
  }

  public getAddress(v: ApiCoin): string {
    if (v.address === 'false') {
      return 'Unparsed address';
    }

    return v.address;
  }

  public isCustomOut(v: ApiCoin): boolean {
    if (v.customTxOut) {
      return true
    }

    return false;
  }

  public isCreateToken(v: ApiCoin): boolean {
    if (v.customTxOut.type === 'T') {
      return true;
    }
    return false;
  }

  public getSymbolCustomOut(v: ApiCoin): string {
    if (v.customTxOut.type === 'T') {
      return v.customTxOut.symbol;
    }
    return '';
  }

  public getLimitCustomOut(v: ApiCoin): string {
    if (v.customTxOut.type === 'T') {
      return v.customTxOut.limit;
    }
    return '';
  }

  public getFlagsCustomOut(v: ApiCoin): string {
    if (v.customTxOut.type === 'T') {
      return v.customTxOut.flags;
    }
    return '';
  }

  public getDecimalCustomOut(v: ApiCoin): string {
    if (v.customTxOut.type === 'T') {
      return v.customTxOut.decimal;
    }
    return '';
  }

  public getNameCustomOut(v: ApiCoin): string {
    if (v.customTxOut.type === 'T') {
      return v.customTxOut.name;
    }
    return '';
  }



  public getTypeCustomOut(v: ApiCoin): string {
    if (v.customTxOut.type === 'T') {
      return 'Create Token';
    }

    if (v.customTxOut.type === 'M') {
      return 'Mint Token';
    }

    if (v.customTxOut.type === 'D') {
      return 'Destroy Token';
    }

    if (v.customTxOut.type === 'C') {
      return 'Create Masternode';
    }

    if (v.customTxOut.type === 'R') {
      return 'Resign Masternode';
    }

    return 'None';
  }


  public getConfirmations() {
    this.txProvider
      .getConfirmations(this.tx.blockheight)
      .subscribe(confirmations => {
        this.confirmations = confirmations;
      });
  }

  public goToTx(txId: string, vout?: number, fromVout?: boolean): void {
    this.redirProvider.redir('transaction', {
      txId,
      chain: this.apiProvider.networkSettings.value.selectedNetwork.chain,
      network: this.apiProvider.networkSettings.value.selectedNetwork.network,
      vout,
      fromVout
    });
  }

  public goToAddress(addrStr: string): void {
    this.redirProvider.redir('address', {
      addrStr,
      chain: this.apiProvider.networkSettings.value.selectedNetwork.chain,
      network: this.apiProvider.networkSettings.value.selectedNetwork.network
    });
  }

  public toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  public aggregateItems(elements: any[]): any[] {
    const items = elements.filter(ele => !(ele.scriptSig && !ele.address))
    if (!items) {
      return [];
    }

    const l: number = items.length;

    const ret: any[] = [];
    const tmp: any = {};
    let u = 0;

    for (let i = 0; i < l; i++) {
      let notAddr = false;
      // non standard input
      if (items[i].scriptSig && !items[i].address) {
        items[i].address = 'Unparsed address [' + u++ + ']';
        items[i].notAddr = true;
        notAddr = true;
      }

      // non standard output
      if (items[i].scriptPubKey && !items[i].scriptPubKey.addresses) {
        items[i].scriptPubKey.addresses = ['Unparsed address [' + u++ + ']'];
        items[i].notAddr = true;
        notAddr = true;
      }

      // multiple addr at output
      if (items[i].scriptPubKey && items[i].scriptPubKey.addresses.length > 1) {
        items[i].address = items[i].scriptPubKey.addresses.join(',');
        ret.push(items[i]);
        continue;
      }

      const address: string =
        items[i].address ||
        (items[i].scriptPubKey && items[i].scriptPubKey.addresses[0]);

      if (!tmp[address]) {
        tmp[address] = {};
        tmp[address].valueSat = 0;
        tmp[address].count = 0;
        tmp[address].value = 0;
        tmp[address].address = address;
        tmp[address].items = [];
      }
      tmp[address].isSpent = items[i].spentTxId;

      tmp[address].doubleSpentTxID =
        tmp[address].doubleSpentTxID || items[i].doubleSpentTxID;
      tmp[address].doubleSpentIndex =
        tmp[address].doubleSpentIndex || items[i].doubleSpentIndex;
      tmp[address].dbError = tmp[address].dbError || items[i].dbError;
      tmp[address].valueSat += Math.round(items[i].value * this.COIN);
      tmp[address].value += items[i].value;
      tmp[address].items.push(items[i]);
      tmp[address].notAddr = notAddr;

      if (items[i].unconfirmedInput) {
        tmp[address].unconfirmedInput = true;
      }

      tmp[address].count++;
    }

    for (const v of Object.keys(tmp)) {
      const obj: any = tmp[v];
      obj.value = obj.value || parseInt(obj.valueSat, 10) / this.COIN;
      ret.push(obj);
    }

    return ret;
  }

  public aggregateVout(items: any[]): any[] {
    return items.filter((ele) => ele.address !== 'false')
  }
}
