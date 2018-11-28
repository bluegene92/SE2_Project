import { CellComponent } from './../cell/cell.component';
import { BoardDimension } from './../../models/board';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Player } from './../../models/player';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  @ViewChild(CellComponent) cell: CellComponent

  width: number = BoardDimension.DEFAULT_WIDTH;
  height: number = BoardDimension.DEFAULT_HEIGHT;

	widthArray:			number[] = [];
  heightArray:		number[] = [];

  private isEnabled: boolean = false;

  @Output() notifyCellSelectedPosition: EventEmitter<number>
    = new EventEmitter<number>();

  private cells = Array(this.width * this.height).fill(null);
  private cellsCoordinates = Array(this.width * this.height).fill(null);

  constructor() { }

  ngOnInit() {
    this.initializeBoard();
  }

  private initializeBoard() {
    this.clearBoard();
    this.fillBoardPosition();
  }

  private clearBoard() {
    this.cells = [];
    this.widthArray = [];
    this.heightArray = [];
  }

  private fillBoardPosition() {
    for (let i = 0; i < this.height; i++) {
      this.heightArray[i] = i;
			for (let j = 0; j < this.width; j++) {
        this.widthArray[j] = j;
				let v = this.markCellPositionValue(j, i);
				// this.cellsCoordinates[v] = `${i},${j}`;
        this.cells[v] = v.toString();
			}
		}
  }

  private markCellPositionValue(xCoord: number, yCoord: number): number {
		return (yCoord * this.width) + xCoord;
  }

  private handleCellSelection(position: number) {
    if (this.isEnabled && !this.isCellTaken(position)) {
      this.notifyCellSelectedPosition.emit(position);
    }
  }

  isCellTaken(position: number) {
    return (this.cells[position] == Player.X ||
        this.cells[position] == Player.O) ? true : false;
  }

  changeBoardWidth(width: number) {
    this.width = width;
    this.initializeBoard();
  }

  changeBoardHeight(height: number) {
    this.height = height;
    this.initializeBoard();
  }

  resetBoard() {
    this.initializeBoard();
  }

	selectCell(position: number, player: string) {
		this.cells[position] = player;
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  getAvailableCells(): string[] {
		let availableCells: string[] = [];
		for (let cell of this.cells) {
			if (!isNaN(Number(cell))) {
				availableCells.push(cell);
			}
		}
		return availableCells;
  }

  isEmpty(): boolean {
		let availableCells = this.getAvailableCells()
		return (availableCells.length == 0) ? true : false;
  }

  undoCell(position: number, value: string) {
		this.cells[position] = value;
	}

}
