import { Player } from './../../../model/player';
import { BoardComponent } from './../../../components/board/board.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlphabetaService {

    private bestPosition: number = 0;
    private allWinningConditions: any[][] = []
    private ROOT = 0;

    constructor() {}

    ngOnInit() {}

    runAlgorithm(board: BoardComponent, player: string, allWinningConditions: any[][]) {
      this.allWinningConditions = allWinningConditions
      this.findBestMove(board, player, 0)
      return this.bestPosition;
    }

    findBestMove(board: BoardComponent, player: string, depth: number) {
      this.alphaBetaPruning(board, player, depth, Number.MIN_VALUE, Number.MAX_VALUE);
    }

    alphaBetaPruning(board: BoardComponent,
            player: string,
            depth: number,
            alpha: number,
            beta: number) {
      let availableCells = board.getAvailableCells();

      if (this.isWinner(Player.X)) { return 10; }
      else if (this.isWinner(Player.O)) { return -10; }
      else if (board.isEmpty()) {	return 0; }


      if (board.width == board.height) {
        if (board.width >= 8)
          if (depth == 3)
            return 0

        if (board.width > 3)
          if (depth == 6)
            return 0
      }

      if (board.width > 6 || board.height > 6)
        if (depth == 4)
          return 0

      if (board.width > 5 || board.height > 5)
        if (depth == 5)
          return 0

      if (board.width > 4 || board.height > 4)
        if (depth == 6)
          return 0






      if (player == Player.X) {
        for (let i = 0; i < availableCells.length; i++) {
          let availablePosition = availableCells[i];
          board.selectCell(Number(availablePosition), Player.X)

          // holds the list of indexes for undo later
          let undoList: number[][] = []

          for (let i = 0; i < this.allWinningConditions.length; i++) {
            let winSet = this.allWinningConditions[i]
            for (let j = 0; j < winSet.length; j++) {
              if (winSet[j] == Number(availablePosition)) {
                winSet[j] = Player.X;
                let coord = [i, j];
                undoList.push(coord);
              }
            }
          }

          let score: any = this.alphaBetaPruning(board, Player.O, depth + 1, alpha, beta);

          board.undoCell(Number(availablePosition), availablePosition);

          this.undoWinningConditions(undoList, availablePosition);

          if (score > alpha) {
            alpha = score
            if (depth == this.ROOT)
              this.bestPosition = Number(availablePosition)
          }

          if (beta <= alpha) {
            return alpha;
          }

        }
        return alpha


      } else {  // Player.O

        for (let i = 0; i < availableCells.length; i++) {
          let availablePosition = availableCells[i];
          board.selectCell(Number(availablePosition), Player.O)

          // holds the list of indexes for undo later
          let undoList: number[][] = []

          for (let i = 0; i < this.allWinningConditions.length; i++) {
            let winSet = this.allWinningConditions[i]
            for (let j = 0; j < winSet.length; j++) {
              if (winSet[j] == Number(availablePosition)) {
                winSet[j] = Player.O
                let coord = [i, j]
                undoList.push(coord)
              }
            }
          }

          let score: any = this.alphaBetaPruning(board, Player.X, depth + 1, alpha, beta)


          board.undoCell(Number(availablePosition), availablePosition)

          this.undoWinningConditions(undoList, availablePosition)

          if (score < beta) {
            beta = score
            if (depth == this.ROOT)
              this.bestPosition = Number(availablePosition)
          }

          if (beta <= alpha) {
            return beta;
          }
        } // end for
        return beta
      }
    }

    private undoWinningConditions(undoList: number[][], availablePosition: string) {
      for (let i = 0; i < undoList.length; i++) {
        let u = undoList[i]
        let yC = u[0]
        let xC = u[1]
        this.allWinningConditions[yC][xC] = availablePosition
      }
    }

    isWinner(player: string): boolean {
      let win = false
      for (let winSet of this.allWinningConditions) {
        let playerCount = 0;
        if (!win) {
          for (let i = 0; i < winSet.length; i++) {
            if (winSet[i] == player)
              playerCount++
            if (playerCount == winSet.length)
              win = true
          }
        } else {
          break;
        }
      }
      return win
    }
  }
