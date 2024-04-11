import { ChangeDetectorRef, Component, inject, viewChild, viewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Collection, { CollectionFeed } from 'src/app/models/Collection';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Subscription } from 'rxjs';
import Settings from 'src/app/models/Settings';
import * as dayjs from 'dayjs';
import Entry from 'src/app/models/Entry';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { OrderByIndexPipe } from '../../../../pipes/order-by-index/order-by-index.pipe';
import { EntryPreviewComponent } from './components/entry-preview/entry-preview.component';
import { StreamComponent } from './components/stream/stream.component';
import { IonContent, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    StreamComponent,
    EntryPreviewComponent,
    OrderByIndexPipe
  ],
})
export class CollectionPage {

  public storageService = inject(StorageService);
  public router = inject(Router);
  public route = inject(ActivatedRoute);
  public changeDetector = inject(ChangeDetectorRef);

  public collections: Collection[];

  public selectedCollection: Collection;

  public readEntries: string[];

  public paramsSubscription: Subscription;

  public settings: Settings;

  public entryToPreview: Entry;
  public entryToPreviewIconUrl: string;
  
  public ionContent = viewChild(IonContent);
  public streamComponents = viewChildren(StreamComponent);

  async ionViewWillEnter() {
    // Load settings
    this.settings = await this.storageService.getSettings();

    // Load feeds based on query params
    this.paramsSubscription = this.route.queryParams
      .subscribe(params => {
        if (params.collectionId) {
          if (params.collectionId !== this.selectedCollection?.id) {
            this.loadCollections(params.collectionId);
            this.loadReadEntries();
          } else {
            this.loadReadEntries();
          }
        } else {
          this.loadCollections();
          this.loadReadEntries();
        }
      });
  }

  async ionViewDidEnter() {
    if (this.selectedCollection) {
      // Get the scroll y position
      const scrollElement = await this.ionContent().getScrollElement();
      
      // Get the scroll object
      const scrollObject = localStorage.getItem(`scroll_position:${this.selectedCollection.id}`);
      if (scrollObject) {
        const scroll = JSON.parse(scrollObject);
        // Restore the scroll y position
        scrollElement.scrollTop = scroll.top;
        // Restore the scroll position of each stream
        this.streamComponents().forEach(streamComponent => {
          const streamScroll = scroll.streams.find(stream => stream.id === streamComponent.feedId());
          if (streamScroll) {
            streamComponent.cdkVirtualScrollViewport().elementRef.nativeElement.scrollLeft = streamScroll.position;
          }
        });
      }
    }
  }

  async ionViewWillLeave() {
    if (this.selectedCollection) {
      // Get the scroll y position
      const scrollElement = await this.ionContent().getScrollElement();

      const scrollObject = {
        top: scrollElement.scrollTop,
        streams: []
      };

      // Save the scroll position of each stream
      this.streamComponents().forEach(streamComponent => {
        scrollObject.streams.push({
          id: streamComponent.feedId(),
          position: streamComponent.cdkVirtualScrollViewport().elementRef.nativeElement.scrollLeft
        });
      });

      // Save the scroll y position
      localStorage.setItem(`scroll_position:${this.selectedCollection.id}`, JSON.stringify(scrollObject));
    }
  }

  public resetStreamScrollPosition(streamId: string) {
    const scrollCache = localStorage.getItem(`scroll_position:${this.selectedCollection.id}`);
    if (scrollCache) {
      const scrollObject = JSON.parse(scrollCache);
      const streamScroll = scrollObject.streams.find(stream => stream.id === streamId);

      if (streamScroll) {
        streamScroll.position = 0;
        localStorage.setItem(`scroll_position:${this.selectedCollection.id}`, JSON.stringify(scrollObject));
      }
    }
  }

  ionViewDidLeave() {
    this.paramsSubscription.unsubscribe();
  }

  async loadReadEntries() {
    this.readEntries = await this.storageService.getReadEntries();
  }

  async loadCollections(selectedCollectionId?: string) {
    this.collections = await this.storageService.getCollections();
    if (!selectedCollectionId) {
      this.selectedCollection = this.collections[0];
    } else {
      const collection = this.collections.find(collection => collection.id === selectedCollectionId);
      if (collection) {
        this.selectedCollection = collection;
      } else {
        this.selectedCollection = this.collections[0];
      }
    }
  }

  navigateToCollection(collection: Collection) {
    this.router.navigate(['/main/collection'], { replaceUrl: true, queryParams: { collectionId: collection.id } });
  }

  async openEntryPreview(entry: Entry, iconUrl: string) {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.entryToPreview = entry;
    this.entryToPreviewIconUrl = iconUrl;
  }

  closeEntryPreview(event: boolean) {
    this.entryToPreview = null;
    this.entryToPreviewIconUrl = null;
    this.changeDetector.detectChanges();
  }

  async doRefresh(event) {
    const lastReloads = this.settings.collectionLastReloads;
    // Get the last reload time of the selected collection
    const lastReload = lastReloads.find(lastReload => lastReload.collectionId === this.selectedCollection.id);
    // If the collection has never been reloaded, set the last reload time to now
    if (!lastReload) {
      // Delete the scroll position cache
      localStorage.removeItem(`scroll_position:${this.selectedCollection.id}`);

      lastReloads.push({ collectionId: this.selectedCollection.id, lastReload: dayjs().unix() });
      // Delete cache of the feeds
      await this.deleteCollectionFeedsCache(this.selectedCollection.feedList);
      // Reload the collection
      this.loadCollections(this.selectedCollection.id);
      this.storageService.setSettings(this.settings);
      event.target.complete();

    } else {
      // If last reload happened more than 5 minutes ago, reload the collection
      if (dayjs().diff(dayjs.unix(lastReload.lastReload), 'minutes') > 5) {
        // Delete the scroll position cache
        localStorage.removeItem(`scroll_position:${this.selectedCollection.id}`);

        // Delete cache of the feeds
        await this.deleteCollectionFeedsCache(this.selectedCollection.feedList);

        // Update the last reload time
        lastReload.lastReload = dayjs().unix();
        // Reload the collection
        this.loadCollections(this.selectedCollection.id);
        this.storageService.setSettings(this.settings);
        event.target.complete();
        
      } else {
        event.target.complete();
      }
    }
  }

  deleteCollectionFeedsCache(collectionFeeeds: CollectionFeed[]) {
    return new Promise((resolve) => {
      // Resolve only when all feeds have been deleted
      const deleteFeeds = collectionFeeeds.map(async (feed: CollectionFeed) => {
        await this.storageService.deleteCacheByFeedId(feed.feedId);
      });
      Promise.all(deleteFeeds).then(() => { 
        resolve(true);
      });
    });
  }

  openSearch() {
    this.router.navigate(['/main/search'], { replaceUrl: true });
  }

}
