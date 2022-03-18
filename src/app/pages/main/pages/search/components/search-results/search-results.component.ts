import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import SearchQuery, { SearchResult } from 'src/app/models/SearchQuery';
import { FeedlyService } from 'src/app/services/feedly/feedly.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit, OnChanges {

  @Input() searchQuery: string;
  @Input() feedIds: string[];

  @Output() updateFeedIds: EventEmitter<boolean> = new EventEmitter();

  public searchResults: SearchResult[];

  constructor(
    private feedlyService: FeedlyService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {}

  ngOnChanges() {
    if (this.searchQuery) {
      this.feedlyService.search(this.searchQuery)
        .then((data: SearchQuery) => {
          this.searchResults = data.results;
        })
        .catch((error) => {
          this.showToast('Error fetching data, try again.', 'danger');
        });
    }
  }

  doUpdateFeedIds() {
    this.updateFeedIds.emit(true);
  }
  
  async showToast(message: string, color?: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

}
