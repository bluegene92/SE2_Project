import { WebsocketService } from './../websocket/websocket.service';
import { Subscription } from 'rxjs/Subscription';
import { TimerComponent } from './../../components/timer/timer.component';
import { GameModeInterface } from './../game-mode/game-mode.interface';
import { GameModeService } from './../../services/game-mode/game-mode.service';
import { Result } from './../../model/result';
import { AlphabetaService } from './../ai/alphabeta/alphabeta.service';
import { Player } from './../../model/player';
import { RefereeService } from './../referee/referee.service';
import { Injectable, OnInit } from '@angular/core';
import { BoardComponent } from '../../components/board/board.component';
import { HumanVsAi } from '../game-mode/human-vs-ai/human-vs-ai.imp';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { GameMode } from 'src/app/model/game-mode';

@Injectable({
  providedIn: 'root'
})
export class BoardManagerService implements OnInit {

  private board: BoardComponent;
  private socketService: WebsocketService;
  private menu: MenuComponent;
  statusBar: string = '';
  private winner: string = '';
  private gameMode: string = '';
  private startingPlayer: string = '';
  private currentPlayerTurn: string = Player.X;
  private timer: TimerComponent;
  private timeSubscription: Subscription

  constructor(private referee: RefereeService,
    private alphabeta: AlphabetaService) {}

  ngOnInit() {}

  manage(board: BoardComponent) {
     this.board = board;
     this.referee.manage(board);
     this.generateWinningConditions();
  }

  referenceTimer(timer: TimerComponent) {
    this.timer = timer;
    this.timer.referenceBoardManager(this);
  }

  referenceMenu(menu: MenuComponent) {
    this.menu = menu;
  }

  referenceSocket(socket: WebsocketService) {
    this.socketService = socket;
  }

  startTimer() {
    this.timer.start();
  }

  generateWinningConditions() {
    this.referee.generateWinningConditionList(this.board.width, this.board.height);
  }

  setGameMode(gameMode: string, startingPlayer: string) {
    this.gameMode = gameMode;
    this.startingPlayer = startingPlayer;
    console.log(`[BoardManager]: gameMode: ${gameMode}, startingPlayer: ${startingPlayer}`)
  }

  startWithPlayer(startingPlayer: string) {
    if (this.gameMode == GameMode.HUMAN_VS_AI) {
      if (startingPlayer == Player.SECOND)
        this.aiMakeMove();
    }
  }

  avaStartWithPlayer(startingPlayer: string) {
    if (this.gameMode == GameMode.AI_VS_AI) {
      if (startingPlayer == Player.SECOND)
        console.log(`ai vs ai, we go first`);
        this.aiMakeMove();
    }
  }

  userSelectPosition(position: number) {
    if (this.gameMode == GameMode.HUMAN_VS_AI) {
      this.board.selectCell(position, Player.X);
      this.selectCellAndUpdateWinningConditions(position, Player.X);
      this.timer.restartCountDown();
      this.aiMakeMove();
    }
  }

  opponentSelectPosition(row: number, col: number) {
    this.timer.restartCountDown();
    if (this.gameMode == GameMode.AI_VS_AI) {
      let position = this.board.markCellPositionValue(col, row);
      if (this.board.isCellTaken(position)) {
        this.statusBar = `Position already taken. Try again`
      } else {
        this.statusBar = ``;
        this.board.selectCell(position, Player.X);
        this.selectCellAndUpdateWinningConditions(position, Player.X);
        this.aiMakeMove();
      }
    }
  }

	aiMakeMove(): any {
    this.timer.restartCountDown();
    setTimeout(()=> {
      let bestMovePosition = this.alphabeta
        .runAlgorithm(this.board, Player.O, this.referee.getAllWinningConditions());
      this.selectCellAndUpdateWinningConditions(bestMovePosition, Player.O)
      if (this.gameMode == GameMode.AI_VS_AI) {
        let coord = this.board.cellsCoordinates[bestMovePosition]
        let coordArr = coord.split(",");
        let row = coordArr[0];
        let col = coordArr[1];
        this.socketService.sendClaim(row, col);
      }
    }, 0);

  }


	selectCellAndUpdateWinningConditions(position: number, player: string) {
    this.board.selectCell(position, player);
		this.referee.updateWinningConditions(position, player);

		if (this.referee.isWinner(player)) {
			this.winner = player;
      this.statusBar = `${this.winner} Win!!!`;
      this.board.disable()
      this.timer.reset();
		}

		if (this.referee.isDraw()) {
			this.winner = Result.DRAW;
      this.statusBar = `${Result.DRAW}`;
      this.board.disable()
      this.timer.reset();
    }
    console.log(this.statusBar);
  }

  resetGame() {
    this.statusBar = '';
  }

  playerGoAfter(player: string) {
    this.currentPlayerTurn = (player == Player.X) ? Player.O : Player.X;
    console.log(this.currentPlayerTurn);
  }

  identifyWinner() {
    let xTally = 0;
    let oTally = 0;
    this.statusBar = 'Out of time: '

    for (let c of this.board.cells) {
      if (c == Player.X)
        xTally++;

      if (c == Player.O)
        oTally++;
    }

    if (xTally > oTally)
      this.statusBar += 'X WIN!';
    else if (oTally > xTally)
      this.statusBar += 'O WIN!';
    else {
      if (this.startingPlayer == Player.FIRST)
        this.statusBar += 'O WIN!';
      else
        this.statusBar += 'X WIN!';
    }
  }
}
