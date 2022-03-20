import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Collection, { CollectionFeed } from 'src/app/models/Collection';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Subscription } from 'rxjs';
import Settings from 'src/app/models/Settings';
import * as moment from 'moment';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage {

  public collections: Collection[];

  public selectedCollection: Collection;

  public readEntries: string[];

  public paramsSubscription: Subscription;

  public settings: Settings;

  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

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


  async doRefresh(event) {
    const lastReloads = this.settings.collectionLastReloads;
    // Get the last reload time of the selected collection
    const lastReload = lastReloads.find(lastReload => lastReload.collectionId === this.selectedCollection.id);
    // If the collection has never been reloaded, set the last reload time to now
    if (!lastReload) {

      lastReloads.push({ collectionId: this.selectedCollection.id, lastReload: moment().unix() });
      // Delete cache of the feeds
      await this.deleteCollectionFeedsCache(this.selectedCollection.feedList);
      // Reload the collection
      this.loadCollections(this.selectedCollection.id);
      this.storageService.setSettings(this.settings);
      event.target.complete();

    } else {

      // If last reload happened more than 5 minutes ago, reload the collection
      if (moment().diff(moment.unix(lastReload.lastReload), 'minutes') > 5) {
        // Delete cache of the feeds
      await this.deleteCollectionFeedsCache(this.selectedCollection.feedList);

        // Update the last reload time
        lastReload.lastReload = moment().unix();
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

}
