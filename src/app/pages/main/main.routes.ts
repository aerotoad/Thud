import { Routes } from "@angular/router";
import { MainPage } from "./main.page";

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: '',
        redirectTo: 'collection',
        pathMatch: 'full'
      },
      {
        path: 'collection',
        loadComponent: () => import('./pages/collection/collection.page').then( m => m.CollectionPage)
      },
      {
        path: 'search',
        loadComponent: () => import('./pages/search/search.page').then( m => m.SearchPage)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
      },
      {
        path: 'bookmarks',
        loadComponent: () => import('./pages/bookmarks/bookmarks.page').then( m => m.BookmarksPage)
      },
    ]
  },
];