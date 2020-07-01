import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebsocketSetup } from './websocket';

@Injectable()
export class WebsocketProvider {
  public messages: Subject<any>;

  constructor(private wsService: WebsocketSetup) {
    this.messages = wsService.connect().map(
      (response: any): any => {
        return response;
      }
    ) as Subject<any>;
  }

  sendMsg(msg) {
    this.messages.next(msg);
  }
}
