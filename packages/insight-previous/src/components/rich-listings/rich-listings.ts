import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddressProvider, ApiRichList } from '../../providers/address/address';
import { ApiProvider } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { DefaultProvider } from '../../providers/default/default';
import { Logger } from '../../providers/logger/logger';
import { RedirProvider } from '../../providers/redir/redir';
import { setIntervalSynchronous } from '../../utils/utility';

@Component({
  selector: 'rich-listings',
  templateUrl: 'rich-listings.html'
})
export class RichListingsComponent implements OnDestroy {
  @Input()
  public showTimeAs: string;
  public loading = true;
  public addressLists: ApiRichList[] = [];
  public subscriber: Subscription[] = [];
  public errorMessage: string;
  public isMounted = false;
  public total: number;

  public reloadInterval: any[] = [];

  constructor(
    public currencyProvider: CurrencyProvider,
    public defaults: DefaultProvider,
    public redirProvider: RedirProvider,
    public addressProvider: AddressProvider,
    public apiProvider: ApiProvider,
    public ngZone: NgZone,
    public logger: Logger
  ) {}

  public onInitBase(pageNum: number = 1, pageSize: number = 200): void {
    this.loadAddressLists(pageNum, pageSize);
    const seconds = 15;
    this.ngZone.runOutsideAngular(() => {
      if (!this.reloadInterval[pageNum]) {
        this.reloadInterval[pageNum] = setIntervalSynchronous(() => {
          this.ngZone.run(() => {
            this.loadAddressLists.call(this, pageNum, pageSize);
          });
        }, 5000 * seconds);
      }
    });
  }

  public loadAddressLists(pageNum: number, pageSize: number): void {
    const toIndex = (pageNum - 1) * pageSize;

    const appendData = response => {
      const { data, total } = response;
      if (Array.isArray(data) && data.length) {
        this.addressLists = this.addressLists.concat(data);
      }
      this.loading = false;
      this.total = total;
    };

    const pollingData = response => {
      const { data, total } = response;
      const temp = [].concat(this.addressLists);
      for (let index = toIndex; index < data.length; index++) {
        temp[index] = data[index % pageSize];
      }

      this.addressLists = temp;
      this.loading = false;
      this.total = total;
    };

    let responseFunc = pollingData;

    if (!this.subscriber[pageNum]) {
      responseFunc = appendData;
    }

    this.subscriber[pageNum] = this.addressProvider
      .getRichAddress(pageNum, pageSize)
      .subscribe(responseFunc, err => {
        this.subscriber[pageNum].unsubscribe();
        this.reloadInterval[pageNum]();
        this.logger.error(err.message);
        this.loading = false;
      });
  }

  public unsubscribeAll() {
    this.subscriber.map(item => !!item && item.unsubscribe());
    this.reloadInterval.map(item => !!item && item());
    this.addressLists = [];
  }

  public reloadData() {
    this.unsubscribeAll();
    this.onInitBase();
  }

  public loadMore(pageNum: number, pageSize: number) {
    this.onInitBase(pageNum, pageSize);
  }

  public ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  public goToAddress(addrStr: string): void {
    this.redirProvider.redir('address', {
      addrStr,
      chain: this.apiProvider.networkSettings.value.selectedNetwork.chain,
      network: this.apiProvider.networkSettings.value.selectedNetwork.network
    });
  }

  public getDate(dateStr: string) {
    return new Date(dateStr).getTime();
  }
}
