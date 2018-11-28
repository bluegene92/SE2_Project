import { GameModeInterface } from './game-mode.interface';
import { Injectable } from '@angular/core';
import { RefereeService } from '../referee/referee.service';

@Injectable({
  providedIn: 'root'
})
export class GameModeService {

  private gameMode: GameModeInterface;
  private referee: RefereeService;

  constructor() { }

  setMode(gameMode: GameModeInterface) {
    this.gameMode = gameMode;
  }

  setReferee(referee: RefereeService) {
    this.referee = referee
  }

  play() {
  }

}
