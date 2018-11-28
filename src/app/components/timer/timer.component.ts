import { BoardManagerService } from './../../services/board-manager/board-manager.service';
import { Player } from './../../model/player';
import { RefereeService } from './../../services/referee/referee.service';
import { Observable } from 'rxjs/observable';
import { Subscription } from 'rxjs/Subscription'
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { timer } from 'rxjs/observable/timer';
import { interval } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  private timerObservable: Observable<number>;
  private timerSubscription: Subscription;
  private counter: number;
  private thresholdTime: number = 20;
  private timeRemaining: number = this.thresholdTime;
  private boardManager: BoardManagerService;

  constructor(private referee: RefereeService) { }
  ngOnInit() {}

  start() {
    this.timerObservable = timer(0, 1000);
    this.timerSubscription = this.timerObservable
      .subscribe(currentTick => {
        this.updateTick(currentTick);
    });
  }

  referenceBoardManager(boardManager: BoardManagerService) {
    this.boardManager = boardManager;
  }

  stop() {
    this.timerSubscription.unsubscribe();
  }

  reset() {
    this.timerSubscription.unsubscribe();
    this.timeRemaining = this.thresholdTime;
  }

  private updateTick(tick: number) {
    this.counter = tick;
    this.countDown();
  }

  private countDown() {
    this.timeRemaining = this.thresholdTime - this.counter;
    if (this.isOutOfTime()) {
      this.reset();
      this.boardManager.identifyWinner()
    }
  }

  private isOutOfTime(): boolean {
    return (this.timeRemaining <= 0) ? true : false;
  }

  private timerIsRunning() {
    return (this.timerSubscription != null) ? true : false;
  }

  getTimeRemaining(): number {
    return this.timeRemaining;
  }

  ngOnDestroy() {
    if (this.timerIsRunning())
    this.timerSubscription.unsubscribe();
  }

}
