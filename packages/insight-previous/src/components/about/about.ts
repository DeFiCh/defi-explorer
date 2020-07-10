import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiProvider } from '../../providers/api/api'
import { DefaultProvider } from '../../providers/default/default';
import { RedirProvider } from '../../providers/redir/redir';

@Component({
  selector: 'about',
  templateUrl: 'about.html'
})
export class AboutComponent implements OnInit {
  public quickStats = { rewards: {}, supply: {}, blockHeight: '', chain: '' };
  public errorMessage;
  public loading = true;
  constructor(
    private defaultProvider: DefaultProvider,
    private redirProvider: RedirProvider,
    private apiProvider: ApiProvider,
  ) {}
  public ngOnInit(): void {
    this.apiProvider.getStats().subscribe(
      response => {
        this.quickStats = this.processResponse(response);
        this.loading = false;
      },
      err => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    );
  }

  private processResponse(resp: any): any {
    const {
      rewards,
      tokens: { supply },
      blockHeight,
      chain
    } = resp;

    return { rewards, supply, blockHeight, chain };
  }

  public goToRichList() {
    const chain = this.defaultProvider.getDefault('%CHAIN%');
    const network = this.defaultProvider.getDefault('%NETWORK%');
    this.redirProvider.redir('rich-list', { chain, network });
  }
}
