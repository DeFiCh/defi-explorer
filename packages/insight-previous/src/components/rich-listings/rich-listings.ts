import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddressProvider, ApiRichList } from '../../providers/address/address';
import { ApiProvider } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { DefaultProvider } from '../../providers/default/default';
import { Logger } from '../../providers/logger/logger';
import { RedirProvider } from '../../providers/redir/redir';

@Component({
  selector: 'rich-listings',
  templateUrl: 'rich-listings.html'
})
export class RichListingsComponent implements OnInit, OnDestroy {
  @Input()
  public showTimeAs: string;
  public loading = true;
  public addressLists: ApiRichList[] = [];
  public subscriber: Subscription;
  public errorMessage: string;
  public prevPageNum: number;
  public isMounted = false;

  public reloadInterval: any;

  constructor(
    public currencyProvider: CurrencyProvider,
    public defaults: DefaultProvider,
    public redirProvider: RedirProvider,
    public addressProvider: AddressProvider,
    public apiProvider: ApiProvider,
    public ngZone: NgZone,
    public logger: Logger
  ) {}

  public ngOnInit(): void {
    this.onInitBase();
  }

  // public onInitBase(pageNum: number, pageSize: number): void {
  //   this.loadAddressLists(pageNum, pageSize);
  //   const seconds = 15;
  //   this.ngZone.runOutsideAngular(() => {
  //     this.reloadInterval = setInterval(() => {
  //       this.ngZone.run(() => {
  //         this.loadAddressLists.call(this, pageNum, pageSize);
  //       });
  //     }, 1000 * seconds);
  //   });
  // }

  public onInitBase(pageSize: number = 200): void {
    this.loadAddressLists(pageSize);
    const seconds = 15;
    this.ngZone.runOutsideAngular(() => {
      this.reloadInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.loadAddressLists.call(this, pageSize);
        });
      }, 1000 * seconds);
    });
  }

  // public loadAddressLists(pageNum: number, pageSize: number): void {
  //   this.subscriber = this.addressProvider
  //     .getRichAddress(pageNum, pageSize)
  //     .subscribe(
  //       response => {
  //         let temp = this.addressLists;
  //         if (this.prevPageNum === pageNum) {
  //           temp = temp.slice(0, temp.length - 200);
  //         }
  //         if (Array.isArray(response) && response.length) {
  //           this.addressLists = temp.concat(response);
  //         }
  //         this.loading = false;
  //         this.errorMessage = null;
  //         this.prevPageNum = pageNum;
  //       },
  //       err => {
  //         this.subscriber.unsubscribe();
  //         clearInterval(this.reloadInterval);
  //         this.logger.error(err.message);
  //         this.errorMessage = err.message;
  //         this.loading = false;
  //       }
  //     );
  // }
  public loadAddressLists(pageSize: number): void {
    this.subscriber = this.addressProvider.getRichAddress(pageSize).subscribe(
      response => {
        this.addressLists = response;
        this.loading = false;
        if (!this.isMounted) {
          this.isMounted = true;
        }
        this.errorMessage = null;
      },
      err => {
        this.subscriber.unsubscribe();
        clearInterval(this.reloadInterval);
        this.logger.error(err.message);
        this.errorMessage = err.message;
        this.loading = false;
      }
    );
  }
  // public reloadData(pageNum: number, pageSize: number) {
  //   this.subscriber.unsubscribe();
  //   this.addressLists = [];
  //   this.onInitBase(pageNum, pageSize);
  // }
  public reloadData(pageSize: number) {
    this.subscriber.unsubscribe();
    this.addressLists = [];
    this.onInitBase(pageSize);
  }
  // public loadMore(pageNum: number, pageSize: number) {
  //   this.subscriber.unsubscribe();
  //   clearInterval(this.reloadInterval);
  //   this.onInitBase(pageNum, pageSize);
  // }
  public loadMore(pageSize: number) {
    this.subscriber.unsubscribe();
    clearInterval(this.reloadInterval);
    this.onInitBase(pageSize);
  }

  public ngOnDestroy(): void {
    clearInterval(this.reloadInterval);
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
