import { RefereeInterface } from './referee.interface';
import { Player } from './../../model/player';
import { WinningSetGeneratorService } from './../winning-set-generator/winning-set-generator.service';
import { Injectable, OnInit } from '@angular/core';
import { BoardComponent } from '../../components/board/board.component';


@Injectable({
  providedIn: 'root'
})
export class RefereeService implements RefereeInterface {

  private allWinningConditions : any[][] = [];
  private board: BoardComponent;

  constructor(private winningSetGenerator: WinningSetGeneratorService) { }

  manage(board: BoardComponent) {
    this.board = board;
  }

  generateWinningConditionList(width: number, height: number): any[][] {
    this.allWinningConditions = [];
    this.allWinningConditions = this.winningSetGenerator.getWinningConditionList(width, height);
    return this.allWinningConditions;
  }

  updateWinningConditions(position: number, player: string) {
		for (let winSet of this.allWinningConditions) {
			for (let i = 0; i < winSet.length; i++) {
				if (winSet[i] == position) {
					winSet[i] = player;
				}
			}
		}
  }

  getAllWinningConditions(): any[][] {
    return this.allWinningConditions;
  }

  isDraw(): boolean {
		return (this.board.isEmpty() &&
			!this.isWinner(Player.X) &&
			!this.isWinner(Player.O))
  }

  isWinner(player: string): boolean {
    let win = false;
		for (let winSet of this.allWinningConditions) {
			let count = 0;
			if (!win) {
				for (let i = 0; i < winSet.length; i++) {
					if (winSet[i] == player) count++;
					if (count == winSet.length) win = true;
				}
			}
			else {
				break;
			}
		}
		return win ? true : false
  }
}
