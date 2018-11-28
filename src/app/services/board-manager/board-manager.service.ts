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


@Injectable({
  providedIn: 'root'
})
export class BoardManagerService implements OnInit {

  private board: BoardComponent;
  private statusBar: string = '';
  private winner: string = '';
  private gameMode: GameModeInterface;
  private startingPlayer: string = '';
  private currentPlayerTurn: string = Player.X;
  private timer: TimerComponent;
  private timeSubscription: Subscription

  constructor(private referee: RefereeService,
    private alphabeta: AlphabetaService) {}

  ngOnInit() {
    this.gameMode = new HumanVsAi();
  }

  manage(board: BoardComponent) {
     this.board = board;
     this.referee.manage(board);
     this.generateWinningConditions();
  }

  referenceTimer(timer: TimerComponent) {
    this.timer = timer;
    this.timer.referenceBoardManager(this);
  }

  startTimer() {
    this.timer.start();
  }

  resetTimer() {
    this.timer.reset();
  }

  generateWinningConditions() {
    this.referee.generateWinningConditionList(this.board.width, this.board.height);
  }

  setGameMode(gameMode: GameModeInterface, startingPlayer: string) {
    this.gameMode = gameMode;
    this.startingPlayer = startingPlayer;
  }

  startWithPlayer(startingPlayer: string) {
    if (startingPlayer == Player.SECOND) {
      this.aiMakeMove();
    }
  }

  userSelectPosition(position: number) {
    this.board.selectCell(position, Player.X);
    this.selectCellAndUpdateWinningConditions(position, Player.X);
    this.timer.reset();
    this.playerGoAfter(Player.X);
    this.aiMakeMove();
  }

	aiMakeMove() {
    this.timer.start();
    setTimeout(()=> {
      let bestMovePosition = this.alphabeta
        .runAlgorithm(this.board, Player.O, this.referee.getAllWinningConditions());
      this.selectCellAndUpdateWinningConditions(bestMovePosition, Player.O)
      this.playerGoAfter(Player.O);
      this.timer.reset();
    }, 0);
  }


	selectCellAndUpdateWinningConditions(position: number, player: string) {
    this.board.selectCell(position, player);
		this.referee.updateWinningConditions(position, player);

		if (this.referee.isWinner(player)) {
			this.winner = player;
      this.statusBar = `${this.winner} Win!!!`;
      this.timer.reset();
      this.board.disable()
		}

		if (this.referee.isDraw()) {
			this.winner = Result.DRAW;
      this.statusBar = `${Result.DRAW}`;
      this.timer.reset();
      this.board.disable()
    }

    console.log(this.statusBar);
  }

  identifyWinner() {
    if (this.currentPlayerTurn == Player.X)
      this.statusBar = `Out of Time: O Win!!!`
    else
      this.statusBar = `Out of Time: X win!!!`
  }

  resetGame() {
    this.resetTimer();
    this.statusBar = '';
  }

  playerGoAfter(player: string) {
    this.currentPlayerTurn = (player == Player.X) ? Player.O : Player.X;
    console.log(this.currentPlayerTurn);
  }

}
