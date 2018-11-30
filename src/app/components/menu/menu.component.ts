import { WebsocketService } from './../../services/websocket/websocket.service';
import { Player } from './../../model/player';
import { AiVsAi } from './../../services/game-mode/ai-vs-ai/ai-vs-ai.imp';
import { HumanVsAi } from './../../services/game-mode/human-vs-ai/human-vs-ai.imp';
import { GameModeService } from './../../services/game-mode/game-mode.service';
import { GameMode } from './../../model/game-mode';
import { BoardManagerService } from './../../services/board-manager/board-manager.service';
import { BoardDimension } from './../../model/board.state';
import { BoardConfiguratorService } from './../../services/board-configurator/board-configurator.service';
import { BoardComponent } from './../board/board.component';
import { TimerComponent } from './../timer/timer.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BoardAccessHandlerService } from '../../services/board-access-handler/board-access-handler.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [BoardConfiguratorService]
})
export class MenuComponent implements OnInit {

  @ViewChild(BoardComponent) board: BoardComponent;
  @ViewChild(TimerComponent) timer: TimerComponent;

  boardWidth: number = BoardDimension.DEFAULT_WIDTH;
  boardHeight: number = BoardDimension.DEFAULT_HEIGHT;

  private ipAddress: string = 'localhost:5000';
  networkLog: string = '';
  private gameModeSelected = GameMode.HUMAN_VS_AI;
  private startingPlayer: string = Player.FIRST;

  constructor(private boardManager: BoardManagerService,
    private boardConfigurator: BoardConfiguratorService,
    private boardAccessHandler: BoardAccessHandlerService,
    private socketService: WebsocketService) {
    }

  ngOnInit() {
    this.initializeDefaultGameMenu();
    this.socketService.menuRef(this);
    this.initializeSocketSubscription()
  }

  private initializeDefaultGameMenu() {
    this.boardManager.manage(this.board);
    this.boardManager.referenceTimer(this.timer);
    this.boardAccessHandler.manage(this.board);
    this.boardConfigurator.manage(this.board);
  }

  private onNotifySelectedCellPosition(position: number) {
    this.boardManager.userSelectPosition(position)
	}

  private onChangeBoardWidth(width: number) {
      this.boardConfigurator.changeBoardWidth(width);
      this.boardManager.generateWinningConditions();
  }

  private onChangeBoardHeight(height: number) {
      this.boardConfigurator.changeBoardHeight(height);
      this.boardManager.generateWinningConditions();
  }

  private startGame() {
    this.boardAccessHandler.enable();
    this.boardManager.startWithPlayer(this.startingPlayer);
    this.boardManager.startTimer();
  }

  private newGame() {
    this.boardManager.generateWinningConditions();
    this.boardManager.resetGame();
    this.boardAccessHandler.reset();
    this.boardAccessHandler.disable();
  }

  private selectedHVA() {
    this.boardManager.setGameMode(new HumanVsAi(), this.startingPlayer);
  }

  private selectedAVA() {
    this.boardManager.setGameMode(new AiVsAi(), this.startingPlayer);
  }

  private goFirst() {
    this.startingPlayer = Player.FIRST;
  }

  private goSecond() {
    this.startingPlayer = Player.SECOND;
  }

  private initializeSocketSubscription() {
    this.socketService.onInitialization()
    .subscribe((initData) => {
      console.log(`[init return]: ${JSON.stringify(initData)}`)
      var data = initData["data"];
      var status = initData["status"];

      if (status == "ok")
        this.networkLog += `[init]: connect to server successfully.\n`
      else
        this.networkLog += `[init]: unable to connect server.\n`
    })

  this.socketService.onSetup()
    .subscribe((setupData) => {
      console.log(`[setup return]: ${JSON.stringify(setupData)}`)
      var data = setupData["data"];
      var status = setupData["status"];
      if (status == "ok")
        this.networkLog += `[setup]: setup sent successfully.\n`
      else
        this.networkLog += `[setup]: setup fail.\n`
    })

  this.socketService.onClaim()
    .subscribe((claimData) => {
      console.log(`[claim return]: ${JSON.stringify(claimData)}`)
      var data = claimData["data"];
      var status = claimData["status"];
      if (status == "ok")
        this.networkLog += `[claim]: claim sent successfully.\n`
      else
        this.networkLog += `[claim]: claim sent fail.\n`
    })
  }

  private connect() {
    this.socketService.sendInitialization()
  }

  sendSetup() {
    this.socketService.sendSetup(this.boardWidth, this.boardHeight, this.startingPlayer)
  }

  sendClaim() {
    this.socketService.sendClaim(6,6);
  }

  private isWithinLimit(length: number) {
    return (length < 11 && length > 2) ? true : false;
  }

  private clearNetworkLog() {
    this.networkLog = '';
  }
}
