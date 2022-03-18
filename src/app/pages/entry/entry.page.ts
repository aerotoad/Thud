import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ViewWebsiteModalComponent } from 'src/app/components/view-website-modal/view-website-modal.component';
import Entry from 'src/app/models/Entry';
import { ArticleSettings } from 'src/app/models/Settings';
import { FeedlyService } from 'src/app/services/feedly/feedly.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.page.html',
  styleUrls: ['./entry.page.scss'],
})
export class EntryPage {

  public entry: Entry;
  public content: SafeHtml;

  public articleSettings: ArticleSettings;
  
  public collectionId: string;

  public paramsSubscription: Subscription;

  public contentClass: string = 'default';

  constructor(
    private feedlyService: FeedlyService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController,
    private sanitizer: DomSanitizer,
    private modalCtrl: ModalController,
    private storageService: StorageService
  ) { }
  
  async ionViewWillEnter() {
    this.paramsSubscription = this.route.queryParams
      .subscribe(params => {
        if (params.entryId) {
          this.loadEntry(params.entryId);
        }
        if (params.collectionId) {
          this.collectionId = params.collectionId;
        }
      });

    this.articleSettings = (await this.storageService.getSettings()).articleSettings;
    this.contentClass = this.articleSettings.background;
  }

  ionViewWillLeave() {
    this.paramsSubscription.unsubscribe();
  }

  loadEntry(entryId: string) {
    this.feedlyService.getEntry(entryId)
      .then((entry) => {
        this.entry = entry[0];
        console.log(this.entry);
        this.processContent();
      })
      .catch((error) => {
        this.showToast('Content cannot be loaded', 'danger');
        this.goBack();
        console.error(error);
      });
  }

  processContent() {
    let content;
    if (this.entry.content) {
      content = this.entry.content.content;
    } else if (this.entry.summary) {
      content = this.entry.summary.content;
    }
    const contentHtml = this.sanitizer.bypassSecurityTrustHtml(content);
    this.content = contentHtml;
  }

  async openOrigin() {
    const modal = await this.modalCtrl.create({
      component: ViewWebsiteModalComponent,
      componentProps: {
        url: this.entry.alternate[0].href
      },
    });
    await modal.present();
  }

  goBack() {
    if (this.collectionId) {
      this.router.navigate(['/main/collection'], { replaceUrl: true, queryParams: { collectionId: this.collectionId } });
    } else {
      this.router.navigate(['/main/collection'], { replaceUrl: true });
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

}
