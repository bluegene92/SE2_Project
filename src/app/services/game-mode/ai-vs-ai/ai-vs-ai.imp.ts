import { Player } from './../../../model/player';
import { GameModeInterface } from './../game-mode.interface';
import { BoardComponent } from './../../../components/board/board.component';
import { AlphabetaService } from './../../ai/alphabeta/alphabeta.service';
import { RefereeService } from './../../referee/referee.service';

export class AiVsAi implements GameModeInterface {
  private board: BoardComponent;
  private referee: RefereeService;
  private alphabeta: AlphabetaService;

  winner: string = '';
  statusBar: string = '';

  constructor() {}


  start(startingPlayer: string) {
    if (this.isUserGoFirst(startingPlayer)) {

    }
  }

  isUserGoFirst(player: string): boolean {
    return (player == Player.FIRST) ? true : false;
  }


  setUp(board: BoardComponent,
    referee: RefereeService,
    alphabeta: AlphabetaService) {
      this.board = board;
      this.referee = referee;
      this.alphabeta = alphabeta;
  }
}
