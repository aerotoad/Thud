import { Component, Input, OnInit } from '@angular/core';
import Bookmark from 'src/app/models/Bookmark';

@Component({
  selector: 'app-entry-card',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent {

  @Input() bookmark: Bookmark;

  constructor() { }

  ngOnInit() {
    console.log(this.bookmark);
  }

}
