import { Player } from './../../model/player';
import { InitializationRequest } from './request';
import { Injectable, OnInit} from '@angular/core';
import { Observable, Observer, observable } from 'rxjs';
import { Message } from './../../model/message.model';
import * as io from 'socket.io-client';
import { MenuComponent } from '../../components/menu/menu.component';
import { Response } from './response';


// const SERVER_URL = 'http://localhost:5123'
  // const SERVER_URL = 'https://enigmatic-journey-54106.herokuapp.com/'
const INTERNAL_SERVER_URL = 'http://localhost:5000'

@Injectable()
export class WebsocketService implements OnInit {
  private socketToInternalServer = io(INTERNAL_SERVER_URL)
  private menu: MenuComponent

  constructor() { }

  ngOnInit(): void {}

  menuRef(menu: MenuComponent) {
    this.menu = menu
  }

  onMessage(): Observable<string> {
    return new Observable<string>(
      observer => {
        this.socketToInternalServer.on('message',
          (data: string) => observer.next(data))
      });
  }

  onInitialization(): Observable<string> {
    return new Observable<string>(
      observer => {
        this.socketToInternalServer.on('init_return',
          (data: string) => observer.next(data))
      }
    )
  }

  onSetup(): Observable<string> {
    return new Observable<string>(
      observer => {
        this.socketToInternalServer.on('setup_return',
          (data: string) => observer.next(data))
      }
    )
  }

  onClaim(): Observable<string> {
    return new Observable<string>(
      observer => {
        this.socketToInternalServer.on('claim_return',
          (data: string) => observer.next(data))
      }
    )
  }

  onClaimPosition(): Observable<string> {
    return new Observable<string>(
      observer => {
        this.socketToInternalServer.on('claim_pos_return',
          (data: string) => observer.next(data))
      }
    )
  }

  onEvent(event: string): Observable<string> {
    return new Observable<string>(
      observer => {
        this.socketToInternalServer.on(event, ()=> observer.next())
      }
    )
  }

  sendInitialization() {
    var initData = {
      action: 'init'
    }
    this.socketToInternalServer.send(initData);
  }

  sendSetup(width: number, height: number, startingPlayer: string) {
    var player = (startingPlayer == Player.FIRST) ? 1 : 2
    var setupData = {
      action: 'setup',
      board: {
        colcount: width,
        rowcount: height
      },
      firstplayer: player
    }
    this.socketToInternalServer.emit('setup', setupData);
  }

  sendClaim(row: number, col: number) {
    var claimData = {
      action: 'claim',
      row: row,
      col: col
    }
    this.socketToInternalServer.emit('claim', claimData);
  }
}
