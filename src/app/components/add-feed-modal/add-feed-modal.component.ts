import { Component, Input } from '@angular/core';
import { ModalController, ToastController, IonicModule } from '@ionic/angular';
import Collection, { CollectionFeed } from 'src/app/models/Collection';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AddCollectionComponent } from '../add-collection/add-collection.component';

@Component({
    selector: 'app-add-feed-modal',
    templateUrl: './add-feed-modal.component.html',
    styleUrls: ['./add-feed-modal.component.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class AddFeedModalComponent {

  @Input() feedObject: CollectionFeed;

  public collections: Collection[];
  
  constructor(
    private storageService: StorageService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }

  ionViewWillEnter() {
    this.loadCollections();
  }

  async loadCollections() {
    this.collections = await this.storageService.getCollections();
  }

  async addFeedToCollection(collection: Collection) {
    // Check if feed is already in collection
    if (!collection.feedList.some(feed => feed.feedId === this.feedObject.feedId)) {
      this.feedObject.index = collection.feedList.length;
      collection.feedList.push(this.feedObject);
    }

    // Save collection
    await this.storageService.updateCollection(collection);
    // Show toast
    this.showToast('Feed added to collection');
    // Close modal and return collection
    this.modalCtrl.dismiss({
      collection: collection
    });
  }

  async createCollection() {
    const modal = await this.modalCtrl.create({
      component: AddCollectionComponent,
      cssClass: 'add-collection-modal'
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log(data);
        if (data.data.collection) {
          this.collections.push(data.data.collection);
        }
      });
    await modal.present();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        }
      ]
    });
    await toast.present();
  }

}
