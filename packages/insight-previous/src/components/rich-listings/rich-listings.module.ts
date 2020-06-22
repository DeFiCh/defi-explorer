import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicModule } from 'ionic-angular';
import { ErrorComponentModule } from '../error/error.module';
import { LoaderComponentModule } from '../loader/loader.module';
import { RichListingsComponent } from './rich-listings';

@NgModule({
  declarations: [RichListingsComponent],
  imports: [
    IonicModule,
    MomentModule,
    LoaderComponentModule,
    ErrorComponentModule
  ],
  exports: [RichListingsComponent]
})
export class RichListingsComponentModule {}
