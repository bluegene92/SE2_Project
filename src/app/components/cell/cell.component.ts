import { Player } from './../../model/player';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Input() state: string = '';

  constructor() { }


  ngOnInit() {}
}
