import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultProvider } from '../../providers/default/default';
import { RedirProvider } from '../../providers/redir/redir';

const defistatsResponse = {
  id: 'DFI',
  rewards: {
    foundationPercent: 10,
    total: 200,
    foundation: 20,
    minter: 180
  },
  tokens: {
    max: 1200000000,
    supply: {
      total: 609360200,
      circulation: 319104180,
      foundation: 288120000,
      community: 2136020
    },
    initDist: {
      total: 588000000,
      totalPercent: 49,
      foundation: 288120000,
      foundationPercent: 49,
      circulation: 299880000,
      circulationPercent: 51
    }
  },
  chain: 'main',
  blockHeight: 106801,
  bestBlockHash:
    'cc2751f1f9a27a5a72b8f0b59a6dc63aebb92446627b48dc6d54c063da4bb0e5',
  difficulty: '466809430.2729005',
  medianTime: 1593165772,
  timeStamp: 1593165907601
};

@Component({
  selector: 'about',
  templateUrl: 'about.html'
})
export class AboutComponent implements OnInit {
  public quickStats = { rewards: {}, supply: {}, blockHeight: '', chain: '' };
  public errorMessage;
  public loading = true;
  constructor(
    private httpClient: HttpClient,
    private defaultProvider: DefaultProvider,
    private redirProvider: RedirProvider
  ) {}
  public ngOnInit(): void {
    this.loadQuickUpdate().subscribe(
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

  private loadQuickUpdate(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })
    };

    // return this.httpClient.get<any>(
    //   this.defaultProvider.getDefault('%DEFI_CHAIN_STATS%'),
    //   httpOptions
    // );
    return new Observable(observer => {
      observer.next(defistatsResponse);
    });
  }

  public goToRichList() {
    const chain = this.defaultProvider.getDefault('%CHAIN%');
    const network = this.defaultProvider.getDefault('%NETWORK%');
    this.redirProvider.redir('rich-list', { chain, network });
  }
}
