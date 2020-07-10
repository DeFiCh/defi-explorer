import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LoaderComponentModule } from '../../components/loader/loader.module';
import { ErrorComponentModule } from '../error/error.module';
import { LatestTransactionsComponent } from './latest-transactions';

@NgModule({
  declarations: [LatestTransactionsComponent],
  imports: [IonicModule, LoaderComponentModule, ErrorComponentModule],
  exports: [LatestTransactionsComponent]
})
export class LatestTransactionsComponentModule {}
