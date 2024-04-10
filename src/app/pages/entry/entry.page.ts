import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController, IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ArticleSettingsModalComponent } from 'src/app/components/article-settings-modal/article-settings-modal.component';
import Entry from 'src/app/models/Entry';
import { ArticleSettings } from 'src/app/models/Settings';
import { FeedlyService } from 'src/app/services/feedly/feedly.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import Bookmark from 'src/app/models/Bookmark';
import { EpochTimeagoPipe } from '../../pipes/epoch-timeago/epoch-timeago.pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.page.html',
  styleUrls: ['./entry.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgClass,
    EpochTimeagoPipe,
  ],
})
export class EntryPage {

  public feedlyService = inject(FeedlyService);
  public route = inject(ActivatedRoute);
  public router = inject(Router);
  public toastCtrl = inject(ToastController);
  public sanitizer = inject(DomSanitizer);
  public modalCtrl = inject(ModalController);
  public storageService = inject(StorageService);

  public entry: Entry;
  public content: SafeHtml;

  public articleSettings: ArticleSettings;
  
  public collectionId: string;
  public fromBookmarks: boolean;

  public bookmarked: boolean = false;

  public paramsSubscription: Subscription;
  
  async ionViewWillEnter() {
    this.paramsSubscription = this.route.queryParams
      .subscribe(params => {
        if (params.entryId) {
          this.loadEntry(params.entryId);
        }
        if (params.collectionId) {
          this.collectionId = params.collectionId;
        }
        if (params.fromBookmarks) {
          this.fromBookmarks = true;
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

  async getBookmark() {
    this.bookmarked = await this.storageService.bookmarkExists(this.entry.id);
  }

  ionViewWillLeave() {
    this.paramsSubscription.unsubscribe();
  }

  loadEntry(entryId: string) {
    this.feedlyService.getEntry(entryId)
      .then((entry) => {
        this.entry = entry[0];
        this.processContent();
        this.getBookmark();
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
    } else {
      // If no content is available, open the article in the browser
      this.handleBrowserByDefault();
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const images = doc.getElementsByTagName('img');
    const firstImg = images[0];
    if (firstImg && firstImg?.src === this.entry.visual?.url) {
      firstImg?.remove();
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
    if (!this.articleSettings.useSystemBrowser) {
      Browser.open({ url: this.entry.alternate[0].href });
    } else {
      // Open in system browser
      window.open(this.entry.alternate[0].href, '_system');
    }
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

  async bookmarkEntry() {
    if (!this.bookmarked) {
      const bookmark: Bookmark = {
        entryId: this.entry.id,
        title: this.entry.title,
        visualUrl: this.entry.visual.url,
        published: this.entry.published
      }
      await this.storageService.addBookmark(bookmark);
      this.bookmarked = true;
      this.showToast('Bookmark added', null, 'top');
    } else {
      await this.storageService.deleteBookmarkByEntryId(this.entry.id);
      this.bookmarked = false;
      this.showToast('Bookmark removed', null, 'top');
    }
  }

  handleBrowserByDefault() {
    Browser.open({ url: this.entry.alternate[0].href });
    Browser.addListener('browserFinished', () => {
      Browser.removeAllListeners();
      this.goBack();
    });
  }

  goBack() {
    if (this.collectionId) {
      this.router.navigate(['/main/collection'], { replaceUrl: true, queryParams: { collectionId: this.collectionId } });
    } else if (this.fromBookmarks) {
      this.router.navigate(['/main/bookmarks'], { replaceUrl: true });
    } else {
      this.router.navigate(['/main/collection'], { replaceUrl: true });
    }
  }

  async showToast(message: string, color?: string, position?: 'top' | 'bottom') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: position ?? 'bottom'
    });
    toast.present();
  }

}
