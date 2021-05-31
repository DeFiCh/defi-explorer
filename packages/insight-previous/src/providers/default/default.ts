import { Injectable } from '@angular/core';

@Injectable()
export class DefaultProvider {
  private defaults: {
    '%CHAIN%': string;
    '%API_PREFIX%': string;
    '%NETWORK%': string;
    '%NUM_BLOCKS%': string;
    '%NUM_TRX_BLOCKS%': string;
    '%QUICK_STATS_API%': string;
  } = {
    //@ts-ignore
    '%CHAIN%': process.env.CHAIN || 'BTC',
    //@ts-ignore
    '%API_PREFIX%': process.env.API_PREFIX || '/api',
    //@ts-ignore
    '%NETWORK%': process.env.NETWORK || 'mainnet',
    //@ts-ignore
    '%NUM_BLOCKS%': process.env.NUM_BLOCKS || '20',
    //@ts-ignore
    '%NUM_TRX_BLOCKS%': process.env.NUM_TRX_BLOCKS || '10',
    //@ts-ignore
    '%QUICK_STATS_API%': process.env.QUICK_STATS_API || 'https://api.defichain.io/v1/stats',
  };

  constructor() {}

  public getDefault(str: string): string {
    return this.defaults[str] !== undefined ? this.defaults[str] : str;
  }

  public setDefault(str: string, value: any): void {
    this.defaults[str] = value;
  }
}
