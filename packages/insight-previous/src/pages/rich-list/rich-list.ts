import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ViewChild
} from '@angular/core';
import { Events, IonicPage, Nav, NavParams } from 'ionic-angular';
import { RichListingsComponent } from '../../components/rich-listings/rich-listings';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { PriceProvider } from '../../providers/price/price';

const thresholdRichListElement = 1000;

@IonicPage({
  name: 'rich-list',
  segment: ':chain/:network/rich-list'
})
@Component({
  selector: 'page-rich-list',
  templateUrl: 'rich-list.html'
})
export class RichListPage implements AfterViewInit, AfterViewChecked {
  @ViewChild('latestRichList')
  public latestRichList: RichListingsComponent;
  public chain: string;
  private chainNetwork: ChainNetwork;
  public network: string;
  public pageNum = 1;
  public pageSize = 200;
  public enableInfiniteScroller = false;
  constructor(
    public nav: Nav,
    public navParams: NavParams,
    private apiProvider: ApiProvider,
    private priceProvider: PriceProvider,
    public events: Events,
    public currencyProvider: CurrencyProvider
  ) {
    const chain: string =
      navParams.get('chain') || this.apiProvider.getConfig().chain;
    const network: string =
      navParams.get('network') || this.apiProvider.getConfig().network;

    this.chainNetwork = {
      chain,
      network
    };
    this.apiProvider.changeNetwork(this.chainNetwork);
    this.currencyProvider.setCurrency();
    this.priceProvider.setCurrency();
  }

  public ngAfterViewInit() {
    const { onInitBase } = this.latestRichList;
    onInitBase.call(this.latestRichList);
  }

  public ngAfterViewChecked() {
    const { addressLists } = this.latestRichList;
    this.enableInfiniteScroller = addressLists.length > 0;
  }

  public openPage(page: string): void {
    this.nav.push(page, {
      chain: this.chain,
      network: this.network
    });
  }

  doInfinite(infiniteScroll) {
    const { loadMore, addressLists, total } = this.latestRichList;
    this.pageNum = Math.floor(addressLists.length / this.pageSize) + 1;
    const threshold = Math.min(total, thresholdRichListElement);
    if (addressLists.length < threshold) {
      loadMore.call(this.latestRichList, this.pageNum, this.pageSize);
      infiniteScroll.complete();
    } else {
      infiniteScroll.enable(false);
      this.enableInfiniteScroller = false;
    }
  }
}
