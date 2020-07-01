import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { DefaultProvider } from '../default/default';

@Injectable()
export class WebsocketSetup {
  private socket;
  private chain;
  private network;
  private wsUrl;

  constructor(public defaultProvider: DefaultProvider) {}

  connect(): Subject<MessageEvent> {
    this.wsUrl = (this.defaultProvider.getDefault(
      '%API_PREFIX%'
    ) as string).replace('/api', '');
    this.chain = this.defaultProvider.getDefault('%CHAIN%');
    this.network = this.defaultProvider.getDefault('%NETWORK%');
    this.socket = io(this.wsUrl, { transports: ['websocket'] });

    const observable = new Observable(observer => {
      this.socket.on('connect', () => {
        this.socket.emit('room', `/${this.chain}/${this.network}/inv`);
      });

      this.socket.on('tx', data => {
        observer.next({ type: 'tx', data });
      });

      this.socket.on('block', data => {
        observer.next({ type: 'block', data });
      });

      this.socket.on('coin', data => {
        observer.next({ type: 'coin', data });
      });

      return () => {
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: any) => {}
    };

    return Subject.create(observer, observable);
  }

  disconnect() {
    return this.socket.disconnect();
  }
}
