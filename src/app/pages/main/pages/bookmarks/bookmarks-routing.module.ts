import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookmarksPage } from './bookmarks.page';

const routes: Routes = [
  {
    path: '',
    component: BookmarksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookmarksPageRoutingModule {}
