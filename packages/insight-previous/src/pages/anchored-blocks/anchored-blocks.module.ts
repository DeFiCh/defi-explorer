import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FooterComponentModule } from '../../components/footer/footer.module';
import { HeadNavComponentModule } from '../../components/head-nav/head-nav.module';
import { LatestBlocksComponentModule } from '../../components/latest-blocks/latest-blocks.module';
import { LoaderComponentModule } from '../../components/loader/loader.module';
import { AnchoredBlocksPage } from './anchored-blocks';

@NgModule({
  declarations: [AnchoredBlocksPage],
  imports: [
    IonicPageModule.forChild(AnchoredBlocksPage),
    FooterComponentModule,
    HeadNavComponentModule,
    LatestBlocksComponentModule,
    LoaderComponentModule
  ],
  exports: [AnchoredBlocksPage]
})
export class AnchoredBlocksPageModule {}
