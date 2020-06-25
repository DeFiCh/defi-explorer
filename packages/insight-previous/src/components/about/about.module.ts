import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LoaderComponentModule } from '../../components/loader/loader.module';
import { ErrorComponentModule } from '../error/error.module';
import { AboutComponent } from './about';

@NgModule({
  declarations: [AboutComponent],
  imports: [IonicModule, ErrorComponentModule, LoaderComponentModule],
  exports: [AboutComponent],
  entryComponents: [AboutComponent]
})
export class AboutComponentModule {}
