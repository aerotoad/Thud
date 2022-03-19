import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
    private feedlyService: FeedlyService,
    private storageService: StorageService
  ) { }

  close() {
    this.modalCtrl.dismiss(); 
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

}
