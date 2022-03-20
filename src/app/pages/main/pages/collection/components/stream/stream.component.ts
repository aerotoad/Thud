import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import FeedCache from 'src/app/models/FeedCache';
import { FeedlyService } from 'src/app/services/feedly/feedly.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import Stream from 'src/app/models/Stream';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {

  @Input() feedId: string;
  @Input() collectionId: string;
  @Input() readEntries: string[];
  @Input() iconUrl: string;
  @Input() cacheTimeout: number;
  
  public stream: Stream;

  public error: boolean = false;

  constructor(
    private feedlyService: FeedlyService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.feedId) {
      this.error = false;
      if (this.feedId) {
        this.loadStream(this.feedId);
      } else {
        this.error = true;
      }
    }
  }

  loadStream(feedId: string) {
    // Check if there is a cache for this feed
    this.storageService.getCacheByFeedId(feedId)
      .then(async (cache: FeedCache) => {
        if (cache) {
          // Check if cache is no older than cacheTimeout
          if (moment().diff(moment.unix(cache.fetchedAt), 'seconds') < this.cacheTimeout) {
            this.stream = cache.content;
          } else {
            // Cache is older than cacheTimeout, fetch new content
            await this.fetchStream(feedId);
          }
        } else {
          // No cache, fetch new content
          this.fetchStream(feedId);
        }
      });
  }

  fetchStream(feedId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.feedlyService.getFeedStream(feedId)
      .then(async (stream: Stream) => {
        // Save cache
        await this.storageService.setCacheByFeedId(feedId, stream);
        // Set stream
        this.stream = stream;
        resolve(true);
      })
      .catch((error) => {
        this.stream = null;
        this.error = true;
        console.error(error);
        reject(false);
      });
    });
  }

  openEntry(entryId: string) {
    this.router.navigate(['/entry'], { queryParams: { entryId: entryId, collectionId: this.collectionId } });
  }

}
