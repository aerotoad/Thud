import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Bookmark from 'src/app/models/Bookmark';
import { StorageService } from 'src/app/services/storage/storage.service';
import { EntryComponent } from './components/entry/entry.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
  standalone: true,
  imports: [IonicModule, EntryComponent],
})
export class BookmarksPage {

  public storageService = inject(StorageService);
  public router = inject(Router);

  public bookmarks: Bookmark[];
  
  ionViewWillEnter() {
    this.loadBookmarks();
  }

  async loadBookmarks() {
    const bookmarks = await this.storageService.getBookmarks();
    this.bookmarks = bookmarks.reverse();
  }

  openEntry(entryId: string) {
    this.router.navigate(['/entry'], { queryParams: { entryId: entryId, fromBookmarks: true } });
  }
}
