import { Component, Injectable, ViewChild } from '@angular/core';
import { Events, IonicPage, Nav, NavParams } from 'ionic-angular';
import { RichListingsComponent } from '../../components/rich-listings/rich-listings';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { PriceProvider } from '../../providers/price/price';

@Injectable()
@IonicPage({
  name: 'rich-list',
  segment: ':chain/:network/rich-list'
})
@Component({
  selector: 'page-rich-list',
  templateUrl: 'rich-list.html'
})
export class RichListPage {
  @ViewChild('latestRichList')
  public latestRichList: RichListingsComponent;
  public chain: string;
  private chainNetwork: ChainNetwork;
  public network: string;
  public pageNum = 1;
  public pageSize = 200;
  public count = 1;
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

  public openPage(page: string): void {
    this.nav.push(page, {
      chain: this.chain,
      network: this.network
    });
  }

  doInfinite(infiniteScroll) {
    const { loadMore, addressLists, errorMessage } = this.latestRichList;
    this.pageSize += 200;
    if (addressLists.length < 1000) {
      loadMore.call(this.latestRichList, this.pageSize);
      infiniteScroll.complete();
    } else {
      infiniteScroll.enable(false);
    }
  }
}
