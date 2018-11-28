import { RefereeService } from './../referee/referee.service';
import { AlphabetaService } from './../ai/alphabeta/alphabeta.service';
import { BoardComponent } from './../../components/board/board.component';

export interface GameModeInterface {
  start(startingPlayer: string): void;

  setUp(board: BoardComponent,referee: RefereeService,alphabeta: AlphabetaService): void;
}
