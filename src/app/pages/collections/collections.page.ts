import { Component } from '@angular/core';
import { AlertController, ModalController, IonicModule } from '@ionic/angular';
import { AddCollectionComponent } from 'src/app/components/add-collection/add-collection.component';
import { CollectionFeedsModalComponent } from 'src/app/components/collection-feeds-modal/collection-feeds-modal.component';
import Collection from 'src/app/models/Collection';
import { StorageService } from 'src/app/services/storage/storage.service';
import { OrderByIndexPipe } from '../../pipes/order-by-index/order-by-index.pipe';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
  standalone: true,
  imports: [IonicModule, OrderByIndexPipe],
})
export class CollectionsPage {

  public collections: Collection[];

  public reorder: boolean = false;

  constructor(
    private storageService: StorageService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ionViewWillEnter() {
    this.loadCollections();
  }

  async loadCollections() {
    this.collections = await this.storageService.getCollections();
  }

  async createCollection() {
    const modal = await this.modalCtrl.create({
      component: AddCollectionComponent,
      cssClass: 'add-collection-modal'
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data.data?.collection) {
          this.collections.push(data.data.collection);
        }
      });
    await modal.present();
  }

  async editCollection(collection: Collection) {
    const modal = await this.modalCtrl.create({
      component: AddCollectionComponent,
      cssClass: 'add-collection-modal',
      componentProps: {
        collection
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data.data?.collection) {
          this.collections = this.collections.map((collection: Collection) => {
            if (collection.id === data.data.collection.id) {
              return data.data.collection;
            }
            return collection;
          });
        }
      });
    await modal.present();
  }

  async confirmDeleteCollection(collection: Collection) {
    const alert = await this.alertCtrl.create({
      header: 'Delete collection',
      message: `Are you sure you want to delete the collection "${collection.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          cssClass: 'alert-danger-button',
          handler: () => {
            this.deleteCollection(collection);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteCollection(collection: Collection) {
    // Cleanup collection feed cache
    const feedIds = collection.feedList.map(feedId => feedId.feedId);
    feedIds.forEach(async (feedId) => {
      await this.storageService.deleteCacheByFeedId(feedId);
    });

    // Remove collection from storage
    this.collections = this.collections.filter((currentCollection: Collection) => {
      if (currentCollection.id !== collection.id) return currentCollection;
    });
    await this.storageService.deleteCollection(collection);

    // Fix collection indexes
    this.collections.forEach((collection: Collection, index: number) => {
      collection.index = index;
    });
    this.storageService.setCollections(this.collections);
  }

  async openCollectionFeeds(collection: Collection) {
    const modal = await this.modalCtrl.create({
      component: CollectionFeedsModalComponent,
      componentProps: {
        collection
      }
    });
    await modal.present();
  }

  startReorder() {
    this.reorder = true;
  }

  endReorder() {
    this.reorder = false;
    this.collections = this.collections.map((collection: Collection, index: number) => {
      collection.index = index;
      return collection;
    });
    this.storageService.setCollections(this.collections);
  }

  drop(event) {
    const itemMove = this.collections.splice(event.detail.from, 1)[0];
    this.collections.splice(event.detail.to, 0, itemMove);
    event.target.complete();
  }


}
