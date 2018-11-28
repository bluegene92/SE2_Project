import { BoardAccessInterface } from './board-access.interface';
import { BoardComponent } from './../../components/board/board.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoardAccessHandlerService implements BoardAccessInterface {

  private board: BoardComponent;

  constructor() { }

  manage(board: BoardComponent) {
    this.board = board;
  }

  enable() {
    this.board.enable();
  }

  disable() {
    this.board.disable();
  }

  reset() {
    this.board.resetBoard();
  }
}
