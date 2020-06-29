import { Component, Input, OnInit } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { Logger } from '../../providers/logger/logger';
import { RedirProvider } from '../../providers/redir/redir';
import { WebsocketProvider } from '../../providers/websocket/websocketProvider';

@Component({
  selector: 'latest-transactions',
  templateUrl: 'latest-transactions.html'
})
export class LatestTransactionsComponent implements OnInit {
  @Input()
  public refreshSeconds = 10;
  public loading = true;
  public transactions = [];
  public errorMessage;

  constructor(
    private apiProvider: ApiProvider,
    public currency: CurrencyProvider,
    public redirProvider: RedirProvider,
    private logger: Logger,
    private websocketProvider: WebsocketProvider
  ) { }

  public ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.websocketProvider.messages.subscribe(
      (data: any) => {
        this.transactions = JSON.parse(data._body);
        this.loading = false;
      },
      err => {
        this.logger.error(err);
        this.errorMessage = err.message;
        this.loading = false;
      }
    );
  }

  public goToTx(txId: string): void {
    this.redirProvider.redir('transaction', {
      txId,
      chain: this.apiProvider.networkSettings.value.selectedNetwork.chain,
      network: this.apiProvider.networkSettings.value.selectedNetwork.network
    });
  }
}
