import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Entry from 'src/app/models/Entry';

@Component({
  selector: 'app-entry-preview',
  templateUrl: './entry-preview.component.html',
  styleUrls: ['./entry-preview.component.scss'],
})
export class EntryPreviewComponent implements AfterViewInit, OnInit {

  @Input() entry: Entry;

  @Output() stopPreview: EventEmitter<boolean> = new EventEmitter();

  public entrySummary: string;

  constructor() { }

  ngOnInit() {
    const span = document.createElement('span');
    span.innerHTML = this.entry.summary.content;
    this.entrySummary = span.innerText;
  }

  ngAfterViewInit() {
    const e = new Event('touchstart', { bubbles: true });
    document.dispatchEvent(e);
    const self = this;
    document.addEventListener('touchend', () => {
      console.log('touchend');
      self.stopPreview.emit(true);
    });
  }

}
