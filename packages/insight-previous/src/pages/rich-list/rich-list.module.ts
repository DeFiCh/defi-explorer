import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErrorComponentModule } from '../../components/error/error.module';
import { FooterComponentModule } from '../../components/footer/footer.module';
import { HeadNavComponentModule } from '../../components/head-nav/head-nav.module';
import { LoaderComponentModule } from '../../components/loader/loader.module';
import { RichListingsComponentModule } from '../../components/rich-listings/rich-listings.module';
import { RichListPage } from './rich-list';

@NgModule({
  declarations: [RichListPage],
  imports: [
    IonicPageModule.forChild(RichListPage),
    RichListingsComponentModule,
    FooterComponentModule,
    HeadNavComponentModule,
    LoaderComponentModule,
    ErrorComponentModule
  ],
  exports: [RichListPage]
})
export class RichListModule {}
