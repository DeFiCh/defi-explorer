import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { DefaultProvider } from '../default/default'

@Injectable()
export class WebsocketSetup {

  private socket;

  constructor(public defaultProvider:DefaultProvider) { }

  connect(): Subject<MessageEvent> {
    this.socket = io(this.defaultProvider.getDefault('%API_PREFIX%'));

    const observable = new Observable(observer => {
        this.socket.on('connect', () => {
            this.socket.emit('room', '/BTC/regtest/inv');
        })
        this.socket.on('tx', (data) => {
          console.log("Received tx from Websocket Server")
          observer.next(data);
        })
        return () => {
          this.socket.disconnect();
        }
    });

    const observer = {
        next: (data: any) => {
            this.socket.emit('message', JSON.stringify(data));
        },
    };

    return Subject.create(observer, observable);
  }
}