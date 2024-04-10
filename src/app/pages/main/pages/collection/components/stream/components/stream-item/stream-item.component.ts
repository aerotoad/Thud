import { NgIf } from "@angular/common";
import { Component, effect, inject, input, signal } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import Entry from "src/app/models/Entry";
import { EpochTimeagoPipe } from "src/app/pipes/epoch-timeago/epoch-timeago.pipe";
import { InArrayPipe } from "src/app/pipes/in-array/in-array.pipe";

@Component({
  selector: 'app-stream-item',
  templateUrl: './stream-item.component.html',
  standalone: true,
  imports: [
    IonicModule, 
    EpochTimeagoPipe,
    InArrayPipe,
    NgIf
  ]
})
export class StreamItemComponent {
  
  public entry = input.required<Entry>();
  public readEntries = input.required<string[]>();
  public entryTitle = signal<string>('');

  constructor() {
    effect(() => {
      // The text of the title can contain html entities like (&amp; or &quote; etc) so we need to decode them to display the correct title
      const title = document.createElement('textarea');
      title.innerHTML = this.entry().title;
      this.entryTitle.set(title.value);
    }, {
      allowSignalWrites: true
    });
  }
}