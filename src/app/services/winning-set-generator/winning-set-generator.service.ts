import { Injectable } from '@angular/core';
import { BoardShape, BoardDimension } from './../../model/board.state'

@Injectable({
  providedIn: 'root'
})
export class WinningSetGeneratorService {

  private endBlock: number = 0;
  private boardShape: string = BoardShape.SHAPE_SQUARE;
  private width: number = BoardDimension.DEFAULT_WIDTH;
  private height: number = BoardDimension.DEFAULT_HEIGHT;
  private winningColumnList: number[][] = [];
  private winningRowList: number[][] = [];
  private winningDiagonalDownlList: number[][] = [];
  private winningDiagonalUpList: number[][] = []
  private allWinningConditions: any[][] = []

  getWinningConditionList(width: number, height: number): any[][] {
    this.initializeBoardConfiguration(width, height);
    this.combineAllWinningConditions()
    return this.allWinningConditions;
  }

  private initializeBoardConfiguration(width: number, height: number) {
    this.width = width
    this.height = height
    if (width == height) {
      this.boardShape = BoardShape.SHAPE_SQUARE
    } else if (width < height) {
      this.boardShape = BoardShape.SHAPE_PORTRAIT
    } else {
      this.boardShape = BoardShape.SHAPE_LANDSCAPE
    }

    this.generateWinningRowList(width, height);
    this.generateWinningColumnList(width, height);
    this.generateDiagonalDownList(width, height);
    this.generateDiagonalUpList(width, height);
  }

  private combineAllWinningConditions() {
    this.allWinningConditions = this.winningRowList
      .concat(this.winningColumnList)
      .concat(this.winningDiagonalDownlList)
      .concat(this.winningDiagonalUpList);
  }

  generateWinningRowList(width: number, height: number) {
    this.winningRowList = [];
    let winningRow: number[] = [];

    if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
      let shiftNeed: number = (width - height) + 1;
      for (let shift = 0; shift < shiftNeed; shift++) {
        this.endBlock = Number(shift) + Number(height) - 1;
        for (let r = 0; r < height; r++) {
          winningRow = [];
          for (let c = shift; c <= this.endBlock; c++) {
            let v = c + (r * width);
            winningRow.push(v)
          }
          this.winningRowList.push(winningRow);
        }
      }
    }

    if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
      for (let r = 0; r < height; r++) {
        winningRow = [];
        for (let c = 0; c < width; c++) {
          let v = (r * width) + c;
          winningRow.push(v);
        }
        this.winningRowList.push(winningRow);
      }
    }

    if (this.boardShape == BoardShape.SHAPE_SQUARE) {
      for (let r = 0; r < height; r++) {
        winningRow = [];
        for (let c = 0; c < width; c++) {
          let v = (r * width) + c;
          winningRow.push(v);
        }
        this.winningRowList.push(winningRow);
      }
    }
  }

  generateWinningColumnList(width: number, height: number) {
    this.winningColumnList = []
    if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
      for (let c = 0; c < width; c++) {
        let winningColumn: number[] = []
        for (let r = 0; r < height; r++) {
          let v = (r * width) + c;
          winningColumn.push(v);
        }
        this.winningColumnList.push(winningColumn);
      }
    }

    if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
      let shiftNeed: number = (height - width) + 1;
      for (let shift = 0; shift < shiftNeed; shift++) {
        this.endBlock = Number(shift) + Number(width) - 1;

        for (let c = 0; c < width; c++) {
          let winningColumn: number[] = [];
          for (let r = shift; r <= this.endBlock; r++) {
            let v = (r * width) + c;
            winningColumn.push(v);
          }
          this.winningColumnList.push(winningColumn);
        }
      }
    }

    if (this.boardShape == BoardShape.SHAPE_SQUARE) {
      for (let c = 0; c < width; c++) {
        let winningColumn: number[] = [];
        for (let r = 0; r < height; r++) {
          let v = r * width + c;
          winningColumn.push(v);
        }
        this.winningColumnList.push(winningColumn);
      }
    }
  }

  generateDiagonalDownList(width: number, height: number) {
    this.winningDiagonalDownlList = [];
    let winningDiagonalDown: number[] = []
    if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
      let h = (height > 1) ? height - 1 : 0
      for (let c = 0; c < width - h; c++) {
        winningDiagonalDown = [];
        for (let r = 0; r < height; r++) {
          let v = r * (Number(width) + 1) + c;
          winningDiagonalDown.push(v);
        }
        this.winningDiagonalDownlList.push(winningDiagonalDown);
      }
    }

    if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
      let h = (height > 1) ? width - 1 : 0
      for (let r = 0; r < height - h; r++) {
        winningDiagonalDown = [];
        for (let c = 0; c < width; c++) {
          let v = (r * Number(width)) + c * (Number(width) + 1);
          winningDiagonalDown.push(v);
        }
        this.winningDiagonalDownlList.push(winningDiagonalDown);
      }
    }

    if (this.boardShape == BoardShape.SHAPE_SQUARE) {
      for (let r = 0; r < 1; r++) {
        winningDiagonalDown = []
        for (let c = 0; c < width; c++) {
          let v = (r * Number(width)) + c * (Number(width) + 1)
          winningDiagonalDown.push(v);
        }
        this.winningDiagonalDownlList.push(winningDiagonalDown);
      }
    }
  }

  generateDiagonalUpList(width: number, height: number) {
    this.winningDiagonalUpList = []
    let winningDiagonalUp: number[] = []
    if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
      for (let c = height - 1; c < width; c++) {
        winningDiagonalUp = [];
        for (let r = 0; r < height; r++) {
          let v = r * (width - 1) + c
          winningDiagonalUp.push(v);
        }
        this.winningDiagonalUpList.push(winningDiagonalUp);
      }
    }

    if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
      let h = (height > 1) ? width - 1 : 0
      for (let r = 0; r < height - h; r++) {
        winningDiagonalUp = [];
        for (let c = 0; c < width; c++) {
          let v = (r * width) + (width - 1) + c * (width - 1);
          winningDiagonalUp.push(v);
        }
        this.winningDiagonalUpList.push(winningDiagonalUp)
      }
    }

    if (this.boardShape == BoardShape.SHAPE_SQUARE) {
      for (let c = width - 1; c < width; c++) {
        winningDiagonalUp = [];
        for (let r = 0; r < height; r++) {
          let v = r * (width - 1) + c;
          winningDiagonalUp.push(v);
        }
        this.winningDiagonalUpList.push(winningDiagonalUp);
      }
    }
  }
}
