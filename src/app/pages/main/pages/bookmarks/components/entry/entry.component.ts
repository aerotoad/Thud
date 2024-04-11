import { Component, Input, OnInit } from '@angular/core';
import Bookmark from 'src/app/models/Bookmark';
import { EpochTimeagoPipe } from '../../../../../../pipes/epoch-timeago/epoch-timeago.pipe';

@Component({
  selector: 'app-entry-card',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  standalone: true,
  imports: [EpochTimeagoPipe],
})
export class EntryComponent {

  @Input() bookmark: Bookmark;

  constructor() { }

  ngOnInit() {}

}
