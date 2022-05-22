import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Entry from 'src/app/models/Entry';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import Bookmark from 'src/app/models/Bookmark';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-entry-preview',
  templateUrl: './entry-preview.component.html',
  styleUrls: ['./entry-preview.component.scss'],
})
export class EntryPreviewComponent implements AfterViewInit, OnInit {

  @Input() entry: Entry;

  @Output() stopPreview: EventEmitter<boolean> = new EventEmitter();

  public entrySummary: string;

  public bookmarked: boolean = false;

  constructor(
    private storageService: StorageService,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    const span = document.createElement('span');
    span.innerHTML = this.entry.summary.content;
    this.entrySummary = span.innerText;
    this.bookmarked = await this.storageService.bookmarkExists(this.entry.id);
  }

  ngAfterViewInit() {
    const self = this;
    const e = new Event('touchstart', { bubbles: true });
    document.dispatchEvent(e);

    const shareButton = document.getElementById('share-button');
    const bookmarkButton = document.getElementById('bookmark-button');
    const originButton = document.getElementById('origin-button');
    const tooltip = document.getElementById('tooltip');

    let lastMove = { xPos: null, yPos: null };

    document.addEventListener('touchend', (event: TouchEvent) => {
      const xPos = lastMove.xPos;
      const yPos = lastMove.yPos;
      const over = document.elementFromPoint(xPos, yPos);
      if (over === shareButton) {
        shareButton.click();
      }
      if (over === bookmarkButton) {
        bookmarkButton.click();
      }
      if (over === originButton) {
        originButton.click();
      }
      self.stopPreview.emit(true);
    });

    let lastShown = null;
    document.addEventListener('touchmove', async (event: TouchEvent) => {
      const xPos = event.touches[0].pageX;
      const yPos = event.touches[0].pageY;
      const over = document.elementFromPoint(xPos, yPos); 
      if (over === shareButton) {
        if (lastShown !== shareButton.id) {
          await Haptics.impact({ style: ImpactStyle.Light });
          // Get position of share button
          const rect = shareButton.getBoundingClientRect();
          // Position the tooltip to the center of the share button
          tooltip.style.left = `${(rect.left + rect.width / 2)/2}px`;
          tooltip.style.display = 'block';
          tooltip.innerText = 'Share';
        }
      } else if (over === bookmarkButton) {
        if (lastShown !== bookmarkButton.id) { 
          await Haptics.impact({ style: ImpactStyle.Light });
          // Get position of bookmark button
          const rect = bookmarkButton.getBoundingClientRect();
          // Position the tooltip to the center of the bookmark button
          tooltip.style.left = `${(rect.left + rect.width / 2) * 0.8}px`;
          tooltip.style.display = 'block';
          tooltip.innerText = 'Bookmark';
        }
      } else if (over === originButton) {
        if (lastShown !== originButton.id) {
          await Haptics.impact({ style: ImpactStyle.Light });
          // Get position of origin button
          const rect = originButton.getBoundingClientRect();
          // Get position of tooltip
          const tooltipRect = tooltip.getBoundingClientRect();
          // Position the tooltip to the center of the origin button
          tooltip.style.left = `${(rect.left + rect.width / 2) * 0.60 }px`;
          tooltip.style.display = 'block';
          tooltip.innerText = 'Open in browser';
        }
      } else {
        tooltip.style.display = 'none';
      }
      lastShown = over?.id ?? null;
      lastMove = { xPos, yPos };
    });
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

  async openOrigin() {
    Browser.open({ url: this.entry.alternate[0].href });
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
