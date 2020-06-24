import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MoreComponent } from './more';

@NgModule({
  declarations: [MoreComponent],
  imports: [IonicModule],
  exports: [MoreComponent],
  entryComponents: [MoreComponent]
})
export class MoreComponentModule {}
