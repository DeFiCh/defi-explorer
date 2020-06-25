import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultProvider } from '../../providers/default/default';

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
    private defaultProvider: DefaultProvider
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

    return this.httpClient.get<any>(
      this.defaultProvider.getDefault('%DEFI_CHAIN_STATS%'),
      httpOptions
    );
  }
}
