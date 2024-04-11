import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController, IonicModule } from '@ionic/angular';
import Collection from 'src/app/models/Collection';
import { StorageService } from 'src/app/services/storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-add-collection',
    templateUrl: './add-collection.component.html',
    styleUrls: ['./add-collection.component.scss'],
    standalone: true,
    imports: [IonicModule, FormsModule],
})
export class AddCollectionComponent implements OnInit {

  @Input() collection: Collection;

  public collectionName: string;
  public collectionDescription: string;

  constructor(
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.collection) {
      this.collectionName = this.collection.name;
      this.collectionDescription = this.collection.description;
    }
  }

  async createCollection() {
    if (this.collectionName) {
      const loading = await this.loadingCtrl.create({
        message: 'Creating collection...',
      });
      await loading.present();
      
      // Get all collections to get the index
      const collections = await this.storageService.getCollections();

      // Create collection
      const collection: Collection = {
        id: uuidv4(),
        name: this.collectionName,
        description: this.collectionDescription,
        feedList: [],
        index: collections.length,
      };
      await this.storageService.addCollection(collection);
      await loading.dismiss();
      // Close modal and return collection
      this.modalCtrl.dismiss({
        collection: collection,
      });
    } else {
      this.showToast('Collection name cannot be empty');
    }
  }

  async saveCollection() {
    if (this.collectionName) {
      const loading = await this.loadingCtrl.create({
        message: 'Saving collection...',
      });
      await loading.present();
      // Update collection
      this.collection.name = this.collectionName;
      this.collection.description = this.collectionDescription;
      await this.storageService.updateCollection(this.collection);
      await loading.dismiss();
      // Close modal and return collection
      this.modalCtrl.dismiss({
        collection: this.collection,
      });
    } else {
      this.showToast('Collection name cannot be empty');
    }
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
