import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FeedlyService } from 'src/app/services/feedly/feedly.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit, OnChanges {

  @Input() searchQuery: string;

  constructor(
    private feedlyService: FeedlyService
  ) { }

  ngOnInit() {}

  ngOnChanges() {
    if (this.searchQuery) {
      this.feedlyService.search(this.searchQuery);
    }
  }

}
