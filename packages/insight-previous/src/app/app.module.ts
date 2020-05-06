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
  ]
})
export class AppModule {
  constructor(titleService: Title, defaults: DefaultProvider,) {
    this.setTitle(titleService, defaults);
  }

  setTitle(titleService: Title, defaults: DefaultProvider) {
    let env = defaults.getDefault("%NETWORK%");
    let prefix = "";
    if (env === "mainnet")
      prefix = "Mainnet - ";
    else if (env === "testnet")
      prefix = "Testnet - ";
    let title = prefix + "DeFi Blockchain Explorer";
    titleService.setTitle(title);
  }
}