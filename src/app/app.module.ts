import { WinningSetGeneratorService } from './services/winning-set-generator/winning-set-generator.service';
import { RefereeService } from './services/referee/referee.service';
import { GameModeService } from './services/game-mode/game-mode.service';
import { AlphabetaService } from './services/ai/alphabeta/alphabeta.service';
import { BoardManagerService } from './services/board-manager/board-manager.service';
import { BoardAccessHandlerService } from './services/board-access-handler/board-access-handler.service';
import { BoardConfiguratorService } from './services/board-configurator/board-configurator.service';
import { WebsocketService } from './services/websocket/websocket.service';
import { TimerComponent } from './components/timer/timer.component';
import { GameManagerComponent } from './components/game-manager/game-manager.component';
import { MenuComponent } from './components/menu/menu.component';
import { GameStatusComponent } from './components/game-status/game-status.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CellComponent } from './components/cell/cell.component';
import { BoardComponent } from './components/board/board.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    GameStatusComponent,
    MenuComponent,
    GameManagerComponent,
    TimerComponent,
    CellComponent,
    BoardComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    WebsocketService,
    TimerComponent,
    BoardComponent,
    BoardConfiguratorService,
    BoardManagerService,
    BoardAccessHandlerService,
    AlphabetaService,
    GameModeService,
    RefereeService,
    WinningSetGeneratorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
