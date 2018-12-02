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
  gameModeSelected = GameMode.HUMAN_VS_AI;
  isGameStarted = false;
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
    this.boardManager.referenceMenu(this);
    this.boardManager.referenceSocket(this.socketService);
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
    if (!this.isGameStarted) {
      this.isGameStarted = true;
      this.boardAccessHandler.enable();
      this.boardManager.setGameMode(this.gameModeSelected, this.startingPlayer);
      this.boardManager.startWithPlayer(this.startingPlayer);
    }
  }

  private newGame() {
    if (this.isGameStarted) {
      this.isGameStarted = false;
      this.boardManager.generateWinningConditions();
      this.boardManager.resetGame();
      this.boardAccessHandler.reset();
      this.boardAccessHandler.disable();
      this.boardManager.setGameMode(this.gameModeSelected, this.startingPlayer);
    }
  }

  private selectedHVA() {
    this.newGame();
    this.gameModeSelected = GameMode.HUMAN_VS_AI;
  }

  private selectedAVA() {
    this.newGame();
    this.gameModeSelected = GameMode.AI_VS_AI;
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
      var board = data["board"];
      var firstPlayer = data["firstplayer"];
      console.log(firstPlayer);
      if (status == "ok") {
        this.networkLog += `[setup]: setup sent successfully.`;
        this.networkLog += ` row = ${board.rowcount} `;
        this.networkLog += ` col = ${board.colcount}\n`;
        if (firstPlayer == 1) {
          this.networkLog += `[go first]: Opponent\n`;
          this.startGame();
        }

        if (firstPlayer == 2) {
          this.networkLog += `[go first]: Us\n`;
          this.startGame();
          this.boardManager.aiMakeMove();
        }
      }
      else
        this.networkLog += `[setup]: setup fail.\n`
    })

  this.socketService.onClaim()
    .subscribe((claimData) => {
      console.log(`[claim return]: ${JSON.stringify(claimData)}`)
      var data = claimData["data"];
      var status = claimData["status"];
      var row = data["row"];
      var col = data["col"];

      if (status == "ok") {
        this.networkLog += `[claim]: Sent successfully.`
        this.networkLog += ` Selected row = ${row}, col = ${col}\n`;
      }
      else {
        this.networkLog += `[claim]: Sent fail.\n`
      }
    })

  this.socketService.onClaimPosition()
      .subscribe((claimPositionData) => {
        console.log(`[claim position return]: ${JSON.stringify(claimPositionData)}`)
        var row = claimPositionData["row"];
        var col = claimPositionData["col"];
        this.networkLog += `[Opponent claim]: row = ${row}, col = ${col}\n`;

        if (row < 0 || col < 0 || row > this.boardHeight-1 || col > this.boardWidth-1) {
          this.networkLog += `[Error]: Invalid board position\n`
          this.boardManager.statusBar = `Invalid position at row = ${row}, col = ${col}. Try again`;
          // this.boardAccessHandler.disable();
        } else {
          this.boardManager.statusBar = ``;
          this.boardManager.opponentSelectPosition(row, col);
        }
      })
  }


  private connect() {
    this.socketService.sendInitialization()
  }

  sendSetup() {
    this.socketService.sendSetup(this.boardWidth, this.boardHeight, this.startingPlayer)
  }

  sendClaim() {
    this.socketService.sendClaim(2,2);
  }

  private isWithinLimit(length: number) {
    return (length < 11 && length > 2) ? true : false;
  }

  private clearNetworkLog() {
    this.networkLog = '';
  }
}
