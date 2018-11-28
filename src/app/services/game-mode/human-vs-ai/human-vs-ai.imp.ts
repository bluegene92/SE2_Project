import { Result } from './../../../model/result';
import { BoardComponent } from './../../../components/board/board.component';
import { AlphabetaService } from './../../ai/alphabeta/alphabeta.service';
import { RefereeService } from './../../referee/referee.service';
import { Player } from './../../../model/player';
import { GameModeInterface } from './../game-mode.interface';
import { Injectable } from '@angular/core';

export class HumanVsAi implements GameModeInterface {

  private board: BoardComponent;
  private referee: RefereeService;
  private alphabeta: AlphabetaService;

  winner: string = '';
  statusBar: string = '';

  constructor() {}

  setUp(board: BoardComponent,
    referee: RefereeService,
    alphabeta: AlphabetaService) {
      this.board = board;
      this.referee = referee;
      this.alphabeta = alphabeta;
  }

  start(startingPlayer: string) {
    if (this.isUserGoFirst(startingPlayer)) {

    }
  }

  isUserGoFirst(player: string): boolean {
    return (player == Player.FIRST) ? true : false;
  }


  userSelectPosition(position: number) {
    this.board.selectCell(position, Player.X);
    this.selectCellAndUpdateWinningConditions(position, Player.X)
    this.aiMakeMove();
  }

	aiMakeMove() {
		let bestMovePosition = this.alphabeta
			.runAlgorithm(this.board, Player.O, this.referee.getAllWinningConditions());
		this.selectCellAndUpdateWinningConditions(bestMovePosition, Player.O)
  }


	selectCellAndUpdateWinningConditions(position: number, player: string) {
    this.board.selectCell(position, player);

		this.referee.updateWinningConditions(position, player);

		if (this.referee.isWinner(player)) {
			this.winner = player;
      this.statusBar = `${this.winner} win!!!`;
		}

		if (this.referee.isDraw()) {
			this.winner = Result.DRAW;
			this.statusBar = `Game end in a ${Result.DRAW}`;
    }
  }
}
