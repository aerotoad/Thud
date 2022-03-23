import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import Collection, { CollectionFeed } from 'src/app/models/Collection';
import { FeedlyService } from 'src/app/services/feedly/feedly.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-collection-feeds-modal',
  templateUrl: './collection-feeds-modal.component.html',
  styleUrls: ['./collection-feeds-modal.component.scss'],
})
export class CollectionFeedsModalComponent {

  @Input() collection: Collection;

  public reorder: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  close() {
    this.modalCtrl.dismiss(); 
  }

  async confirmDeleteFeed(feed: CollectionFeed) {
    const alert = await this.alertCtrl.create({
      header: 'Delete feed',
      message: `Are you sure you want to delete the feed "${feed.title}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          cssClass: 'alert-danger-button',
          handler: () => {
            this.deleteFeed(feed);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteFeed(feed: CollectionFeed) {
    // Cleanup feed cache
    await this.storageService.deleteCacheByFeedId(feed.feedId);

    // Remove feed from collection
    this.collection.feedList = this.collection.feedList.filter((currentFeed: CollectionFeed) => {
      if (currentFeed.feedId !== feed.feedId) return currentFeed;
    });

    // Fix feeds indexes
    this.collection.feedList = this.collection.feedList.map((currentFeed: CollectionFeed, index: number) => {
      currentFeed.index = index;
      return currentFeed;
    });

    // Update collection
    this.storageService.updateCollection(this.collection);
  }

  startReorder() {
    this.reorder = true;
  }

  endReorder() {
    this.reorder = false;
    this.collection.feedList = this.collection.feedList.map((feed: CollectionFeed, currentIndex: number) => {
      feed.index = currentIndex;
      return feed;
    });
    this.storageService.updateCollection(this.collection);
  }

  drop(event) {
    const itemMove = this.collection.feedList.splice(event.detail.from, 1)[0];
    this.collection.feedList.splice(event.detail.to, 0, itemMove);
    event.target.complete();
  }

  openSearch() {
    this.router.navigate(['/main/search'], { replaceUrl: true });
    this.modalCtrl.dismiss();
  }

}
