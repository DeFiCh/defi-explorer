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

  private reloadInterval: any;

  constructor(
    public currencyProvider: CurrencyProvider,
    public defaults: DefaultProvider,
    public redirProvider: RedirProvider,
    private addressProvider: AddressProvider,
    private apiProvider: ApiProvider,
    private ngZone: NgZone,
    private logger: Logger
  ) {}

  public ngOnInit(): void {
    this.loadAddressLists();
    const seconds = 15;
    this.ngZone.runOutsideAngular(() => {
      this.reloadInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.loadAddressLists.call(this);
        });
      }, 1000 * seconds);
    });
  }

  private loadAddressLists(): void {
    this.subscriber = this.addressProvider.getRichAddress().subscribe(
      response => {
        this.addressLists = response;
        this.loading = false;
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

  public reloadData() {
    this.subscriber.unsubscribe();
    this.addressLists = [];
    this.ngOnInit();
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
}
