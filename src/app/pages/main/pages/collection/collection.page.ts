import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Collection from 'src/app/models/Collection';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage {

  public collections: Collection[];

  public selectedCollection: Collection;

  constructor(
    private storageService: StorageService
  ) { }

  ionViewWillEnter() {
    this.loadCollections();
  }

  async loadCollections() {
    this.collections = await this.storageService.getCollections();
    this.selectCollection(this.collections[0]);
  }

  selectCollection(collection: Collection) {
    this.selectedCollection = collection;
  }


}
