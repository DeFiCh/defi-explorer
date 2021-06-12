import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';
import { DefaultProvider } from '../../providers/default/default';
import { RedirProvider } from '../../providers/redir/redir';
import { setIntervalSynchronous, roundingDown } from '../../utils/utility';

@Component({
  selector: 'about',
  templateUrl: 'about.html'
})
export class AboutComponent implements OnInit, OnDestroy {
  public quickStats = { burnInfo: {}, rewards: {}, supply: {}, blockHeight: '', chain: '' };
  public errorMessage;
  public loading = true;
  public network;
  public reloadInterval;
  constructor(
    private defaultProvider: DefaultProvider,
    private redirProvider: RedirProvider,
    private apiProvider: ApiProvider,
    private ngZone: NgZone
  ) {
    this.network = defaultProvider.getDefault('%NETWORK%');
  }

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
    if (this.reloadInterval) {
      this.reloadInterval();
    }
  }

  private loadQuickStats() {
    this.apiProvider.getStats().subscribe(
      response => {
        this.quickStats = this.processResponse(response);
        this.errorMessage = '';
        this.loading = false;
      },
      err => {
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
      burnInfo,
      listCommunities
    } = resp;

    const updatedListCommunities = {
      AnchorReward: 0,
      IncentiveFunding: 0
    };

    if (typeof listCommunities !== 'string') {
      updatedListCommunities['AnchorReward'] = listCommunities.AnchorReward;
      updatedListCommunities['IncentiveFunding'] =
        listCommunities.IncentiveFunding;
    }

    return {
      rewards,
      supply,
      blockHeight,
      chain,
      burnInfo,
      listCommunities: updatedListCommunities
    };
  }

  public goToRichList() {
    const chain = this.defaultProvider.getDefault('%CHAIN%');
    const network = this.defaultProvider.getDefault('%NETWORK%');
    this.redirProvider.redir('rich-list', { chain, network });
  }

  public roundingValue(value: string | number) {
    return roundingDown(value);
  }
}
