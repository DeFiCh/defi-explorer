import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiProvider } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { BlocksProvider } from '../blocks/blocks';
import { ApiCoin, TxsProvider } from '../transactions/transactions';

export interface ApiAddr {
  confirmed: number;
  unconfirmed: number;
  balance: number;
}

export interface ApiRichList {
  address: string;
  txCount?: number;
  balance: string;
  firstTxTime?: Date;
  lastTxTime?: Date;
}

@Injectable()
export class AddressProvider {
  constructor(
    public httpClient: HttpClient,
    public currency: CurrencyProvider,
    public blocks: BlocksProvider,
    public txsProvider: TxsProvider,
    private api: ApiProvider
  ) {}

  public getAddressBalance(addrStr?: string): Observable<ApiAddr> {
    return this.httpClient.get<ApiAddr>(
      this.api.getUrl() + `/address/${addrStr}/balance`
    );
  }

  public getAddressActivity(addrStr?: string): Observable<ApiCoin[]> {
    return this.httpClient.get<ApiCoin[]>(
      this.api.getUrl() + `/address/${addrStr}/txs?limit=1000`
    );
  }

  public getRichAddress(
    pageNum: number,
    pageSize: number
  ): Observable<ApiRichList[]> {
    return this.httpClient.get<ApiRichList[]>(
      this.api.getUrl() +
        `/address/stats/rich-list?pageno=${pageNum}&pagesize=${pageSize}`
    );
  }
}
