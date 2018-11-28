import { BoardComponent } from './../../components/board/board.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoardConfiguratorService {

  private board: BoardComponent;

  constructor() { }

  manage(board: BoardComponent) {
    this.board = board;
  }

  changeBoardWidth(width: number) {
    if (this.isWithinLimit(width)) {
      this.board.changeBoardWidth(width);
    }
  }

  changeBoardHeight(height: number) {
    if (this.isWithinLimit(height)) {
      this.board.changeBoardHeight(height);
    }
  }

  private isWithinLimit(length: number) {
    return (length < 11 && length > 2) ? true : false;
  }
}
