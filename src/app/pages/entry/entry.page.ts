import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ArticleSettingsModalComponent } from 'src/app/components/article-settings-modal/article-settings-modal.component';
import Entry from 'src/app/models/Entry';
import { ArticleSettings } from 'src/app/models/Settings';
import { FeedlyService } from 'src/app/services/feedly/feedly.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';

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

    this.loadSettings();
  }

  async loadSettings() {
    this.articleSettings = (await this.storageService.getSettings()).articleSettings;
  }

  async markAsRead() {
    await this.storageService.addReadEntry(this.entry.id);
  }

  ionViewWillLeave() {
    this.paramsSubscription.unsubscribe();
  }

  loadEntry(entryId: string) {
    this.feedlyService.getEntry(entryId)
      .then((entry) => {
        this.entry = entry[0];
        this.processContent();
        this.markAsRead();
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

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const images = doc.getElementsByTagName('img');
    const firstImg = images[0];
    if (firstImg?.src === this.entry.visual?.url) {
      firstImg.remove();
    }
    for(let i = 0; i<images.length; i++) {
      const img = images[i];
      img.style.marginTop = '10px';
      img.style.marginBottom = '10px';
    }

    const contentHtml = this.sanitizer.bypassSecurityTrustHtml(doc.documentElement.innerHTML);
    this.content = contentHtml;
  }

  async openOrigin() {
    Browser.open({ url: this.entry.alternate[0].href });
  }

  async openArticleSettings() {
    const modal = await this.modalCtrl.create({
      component: ArticleSettingsModalComponent,
      breakpoints: [0, 0.5, 0.7, 1],
      initialBreakpoint: 0.7,
    });
    modal.onDidDismiss().then(() => {
      this.loadSettings();
    });
    await modal.present();
  }
 
  async shareEntry() {
    await Share.share({
      text: `[Via Thud.] ${this.entry.title}`,
      url: this.entry.alternate[0].href,
      dialogTitle: 'Share with buddies',
    });
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
