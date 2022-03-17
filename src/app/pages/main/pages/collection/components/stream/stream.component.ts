import { Component, Input, OnInit } from '@angular/core';
import Collection from 'src/app/models/Collection';
import FeedCache from 'src/app/models/FeedCache';
import { FeedlyService } from 'src/app/services/feedly/feedly.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import Stream from 'src/app/models/Stream';
import * as moment from 'moment';
import { EpochTimeagoPipe } from 'src/app/pipes/epoch-timeago/epoch-timeago.pipe';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {

  @Input() feedId: string;
  
  public stream: Stream;

  public error: boolean = false;

  constructor(
    private feedlyService: FeedlyService,
    private storageService: StorageService
  ) { }

  ngOnInit() {}

  ngOnChanges() {
    this.error = false;
    if (this.feedId) {
      this.loadStream(this.feedId);
    } else {
      this.error = true;
    }
  }

  loadStream(feedId: string) {
    // Check if there is a cache for this feed
    this.storageService.getCacheByFeedId(feedId)
      .then((cache: FeedCache) => {
        if (cache) {
          // Check if cache is no older than 1 hour
          if (moment().diff(moment.unix(cache.fetchedAt), 'hours') < 1) {
            this.stream = cache.content;
          } else {
            // Cache is older than 1 hour, fetch new content
            this.fetchStream(feedId);
          }
        } else {
          // No cache, fetch new content
          this.fetchStream(feedId);
        }
      });
  }

  fetchStream(feedId: string): void {
    this.feedlyService.getFeedStream(feedId)
      .then(async (stream: Stream) => {
        // Save cache
        await this.storageService.setCacheByFeedId(feedId, stream);
        // Set stream
        this.stream = stream;
      })
      .catch((error) => {
        this.stream = null;
        this.error = true;
        console.error(error);
      });
  }

}
