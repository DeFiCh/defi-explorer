import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Logger } from '../../providers/logger/logger';
import { RedirProvider } from '../../providers/redir/redir';

@Component({
  selector: 'more',
  templateUrl: 'more.html'
})
export class MoreComponent {
  public availableOptions;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public logger: Logger,
    public redirProvider: RedirProvider
  ) {}

  public ionViewDidLoad() {
    this.availableOptions = [
      {
        label: 'Rich List',
        path: 'rich-list'
      }
    ];
  }

  public changePage(option): void {
    this.redirProvider.redir(option.path, this.navParams.data.config);
    this.viewCtrl.dismiss();
  }
}
