import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddCollectionComponent } from 'src/app/components/add-collection/add-collection.component';
import Collection from 'src/app/models/Collection';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage {

  public collections: Collection[] = [];

  constructor(
    private storageService: StorageService,
    private modalCtrl: ModalController
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
        if (data.data.collection) {
          this.collections.push(data.data.collection);
        }
      });
    await modal.present();
  }

}
