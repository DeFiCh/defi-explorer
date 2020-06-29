import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BlocksPage, HomePage, PagesModule } from '../pages';
import { AddressProvider } from '../providers/address/address';
import { ApiProvider } from '../providers/api/api';
import { BlocksProvider } from '../providers/blocks/blocks';
import { CurrencyProvider } from '../providers/currency/currency';
import { DefaultProvider } from '../providers/default/default';
import { Logger } from '../providers/logger/logger';
import { PriceProvider } from '../providers/price/price';
import { RedirProvider } from '../providers/redir/redir';
import { SearchProvider } from '../providers/search/search';
import { TxsProvider } from '../providers/transactions/transactions';
import { WebsocketSetup } from '../providers/websocket/websocket';
import { WebsocketProvider } from '../providers/websocket/websocketProvider';
import { InsightApp } from './app.component';

@NgModule({
  declarations: [InsightApp],
  imports: [
    BrowserModule,
    HttpClientModule,
    PagesModule,
    IonicModule.forRoot(InsightApp, {
      mode: 'md',
      animate: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [InsightApp, HomePage, BlocksPage],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider,
    CurrencyProvider,
    BlocksProvider,
    TxsProvider,
    DefaultProvider,
    PriceProvider,
    SearchProvider,
    RedirProvider,
    Logger,
    AddressProvider,
    Title,
    WebsocketProvider,
    WebsocketSetup,
  ]
})
export class AppModule {
  constructor(titleService: Title, defaults: DefaultProvider,) {
    this.prefixCommonNetworkNameTitle(titleService, defaults);
  }

  prefixCommonNetworkNameTitle(titleService: Title, defaults: DefaultProvider) {
    const network = defaults.getDefault("%NETWORK%").toLowerCase();
    let prefix = "";
    if (network === "mainnet") { prefix = "Mainnet - " }
    else if (network === "testnet") { prefix = "Testnet - " };
    if (prefix.length) {
      titleService.setTitle(prefix + titleService.getTitle());
    }
  }
}