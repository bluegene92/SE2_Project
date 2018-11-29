import { Player } from './../../model/player';
import { InitializationRequest } from './request';
import { Injectable, OnInit} from '@angular/core';
import { Observable, Observer, observable } from 'rxjs';
import { Message } from './../../model/message.model';
import * as sockIo from 'socket.io-client';
import { MenuComponent } from '../../components/menu/menu.component';

const SERVER_URL = 'http://localhost:5123'
  // const SERVER_URL = 'https://enigmatic-journey-54106.herokuapp.com/'


@Injectable()
export class WebsocketService implements OnInit {
  // socketToInternalServer = sockIo("")
  private socketToExternalServer
  private menu: MenuComponent
  constructor() { }

  ngOnInit(): void {
    console.log('starting websocket service')
  }

  menuRef(menu: MenuComponent) {
    this.menu = menu
  }

  // send(message: Message): void {
  //   // this.socketToInternalServer.emit('message', message)
  // }

  // sendString(m: string) {
  //   this.socketToInternalServer.emit('message', m);
  // }

  onConnection(): Observable<string> {
    return new Observable<string>(
      observer => {
        this.socketToExternalServer.on("connection_confirm",
          (data: string) => observer.next(data))
      }
    )
  }

  onIntialization(): Observable<Response> {
    return new Observable<Response>(
      observer => {
        this.socketToExternalServer.on('request',
          (data: Response) => observer.next(data))
      }
    )
  }

  // onMessage(): Observable<string> {
  //   return new Observable<string>(
  //     observer => {
  //       this.socketToInternalServer.on('message',
  //         (data: string) => observer.next(data))
  //     });
  // }

  // onEvent(event: string): Observable<string> {
  //   return new Observable<string>(
  //     observer => {
  //       this.socketToInternalServer.on(event, ()=> observer.next())
  //     }
  //   )
  // }

  sendInitializationRequest() {
    this.socketToExternalServer.emit('request', JSON.stringify({
      action: 'init'
    }));
  }

  sendSetup(width: number, height: number, startingPlayer: string) {
    // var player = (startingPlayer == Player.FIRST) ? 1 : 2
    // this.socketToExternalServer.emit(JSON.stringify({
    //   action: 'data',
    //   board: {
    //     colcount: width,
    //     rowcount: height
    //   },
    //   firstplayer: player
    // }));

   
    var a = {
      action: "1"
    }
    console.log('sending....' + JSON.stringify(a))
    this.socketToExternalServer.write(JSON.stringify(a))
    this.socketToExternalServer.send(
     "GET / HTTP/1.1\r\nHost: example.com\r\n\r\nAccept: *\r\nzustimmung"
    );

    // this.socketToExternalServer.sendString(`{"action": "1"}`)
  }

  connectToExternalServer(ipAddress: string) {
    console.log(`connect to ${ipAddress}`)

    var headers = {
      extraHeaders: {

      }
    }
    this.socketToExternalServer = sockIo(ipAddress)
    this.sendInitializationRequest()
    this.initializeAllSubscription();
  }



  initializeAllSubscription() {
    this.onConnection()
      .subscribe(()=> {
        console.log('connected to heroku server');
      })

    this.onIntialization()
      .subscribe((res: Response)=>{
          var status = String(res.status)
          if (status == "okay") {
            this.menu.networkLog += `[Connection]: successful\n`
            console.log('good')
          }

          if (status == "error") {
            this.menu.networkLog += `[Connection]: fail\n`
            console.log('bad')
          }
          console.log(JSON.stringify(res))
      })
  }

  // onEvent(event: string): Observable<string> {
  //   return new Observable<string>(
  //     observer => {
  //       this.socketToExternalServer.on(event, ()=> observer.next())
  //     }
  //   )
  // }

}
