import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Collection from 'src/app/models/Collection';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Subscription } from 'rxjs';

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

  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ionViewWillEnter() {
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


}
