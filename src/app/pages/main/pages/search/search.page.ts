import { Component } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {

  public searchQuery$: Subject<string> = new ReplaySubject();
  public query: string;

  constructor() { }

  ionViewWillEnter() {
    this.searchQuery$.pipe(
      debounceTime(400), // discard emitted values that take less than the specified time between output
      distinctUntilChanged() // only emit when value has changed
    ).subscribe(term => {
      this.query = term;
    });
  }

  debounceSearch() {

  }

}
