import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Bookmark from 'src/app/models/Bookmark';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage {

  public bookmarks: Bookmark[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

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
