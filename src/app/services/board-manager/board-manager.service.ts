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
import { WebsocketService } from './../../services/websocket/websocket.service';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { GameMode } from 'src/app/model/game-mode';

@Injectable({
  providedIn: 'root'
})
export class BoardManagerService implements OnInit {

  private board: BoardComponent;
  private menu: MenuComponent;
  statusBar: string = '';
  private winner: string = '';
  private gameMode: string = '';
  private startingPlayer: string = '';
  private currentPlayerTurn: string = Player.X;
  private timer: TimerComponent;
  private timeSubscription: Subscription

  constructor(private referee: RefereeService,
    private alphabeta: AlphabetaService, 
    private socketService: WebsocketService) {}

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

    if (this.gameMode == GameMode.AI_VS_AI) {
      if (startingPlayer == Player.FIRST) {
        let bestMovePosition = this.alphabeta
          .runAlgorithm(this.board, Player.O, this.referee.getAllWinningConditions());
        this.selectCellAndUpdateWinningConditions(bestMovePosition, Player.O)
        var coordArr = this.board.cellsCoordinates[bestMovePosition].split(',')
        let row = coordArr[0];
        let col = coordArr[1];
        console.log(`row: ${row}, col: ${col}`)
        this.socketService.sendClaim(row, col);
      }
    }
  }

  userSelectPosition(position: number) {
    if (this.gameMode == GameMode.HUMAN_VS_AI) {
      this.board.selectCell(position, Player.X);
      this.selectCellAndUpdateWinningConditions(position, Player.X);
      this.aiMakeMove();
    }
  }

  opponentSelectPosition(position: number) {
    if (this.gameMode == GameMode.AI_VS_AI) {
      this.board.selectCell(position, Player.X);
      this.selectCellAndUpdateWinningConditions(position, Player.X);
      // this.aiMakeMove();
    }
  }

	aiMakeMove(): any {
    setTimeout(()=> {
      let bestMovePosition = this.alphabeta
        .runAlgorithm(this.board, Player.O, this.referee.getAllWinningConditions());
      this.selectCellAndUpdateWinningConditions(bestMovePosition, Player.O)
    }, 0);
  }


	selectCellAndUpdateWinningConditions(position: number, player: string) {
    this.board.selectCell(position, player);
		this.referee.updateWinningConditions(position, player);

		if (this.referee.isWinner(player)) {
			this.winner = player;
      this.statusBar = `${this.winner} Win!!!`;
      this.board.disable()
		}

		if (this.referee.isDraw()) {
			this.winner = Result.DRAW;
      this.statusBar = `${Result.DRAW}`;
      this.board.disable()
    }
    console.log(this.statusBar);
  }

  resetGame() {
    // this.timer.reset();
    this.statusBar = '';
  }

  playerGoAfter(player: string) {
    this.currentPlayerTurn = (player == Player.X) ? Player.O : Player.X;
    console.log(this.currentPlayerTurn);
  }
}
