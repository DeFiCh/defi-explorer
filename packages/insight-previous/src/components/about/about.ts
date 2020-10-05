import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { DefaultProvider } from '../../providers/default/default';
import { RedirProvider } from '../../providers/redir/redir';
import { setIntervalSynchronous } from '../../utils/utility';

@Component({
  selector: 'about',
  templateUrl: 'about.html',
})
export class AboutComponent implements OnInit, OnDestroy {
  public quickStats = { rewards: {}, supply: {}, blockHeight: '', chain: '' };
  public errorMessage;
  public loading = true;
  public reloadInterval;
  constructor(
    private defaultProvider: DefaultProvider,
    private redirProvider: RedirProvider,
    private apiProvider: ApiProvider,
    private ngZone: NgZone,
    public currencyProvider: CurrencyProvider
  ) {}

  public ngOnInit(): void {
    this.loadQuickStats();
    const seconds = 60;
    this.ngZone.runOutsideAngular(() => {
      this.reloadInterval = setIntervalSynchronous(() => {
        this.ngZone.run(() => {
          this.loadQuickStats.call(this);
        });
      }, 1000 * seconds);
    });
  }

  public ngOnDestroy(): void {
    if (this.reloadInterval) this.reloadInterval();
  }

  private loadQuickStats() {
    this.apiProvider.getStats().subscribe(
      (response) => {
        this.quickStats = this.processResponse(response);
        this.errorMessage = '';
        this.loading = false;
      },
      (err) => {
        this.errorMessage = err.error || err.message;
        this.loading = false;
      }
    );
  }

  private processResponse(resp: any): any {
    const {
      rewards,
      tokens: { supply },
      blockHeight,
      chain,
      listCommunities,
    } = resp;
    let updatedListCommunities = {};
    if (typeof listCommunities === 'string') {
      updatedListCommunities = {
        AnchorReward: listCommunities,
        IncentiveFunding: listCommunities,
      }
    }

    return { rewards, supply, blockHeight, chain, listCommunities: updatedListCommunities };
  }

  public goToRichList() {
    const chain = this.defaultProvider.getDefault('%CHAIN%');
    const network = this.defaultProvider.getDefault('%NETWORK%');
    this.redirProvider.redir('rich-list', { chain, network });
  }
}
