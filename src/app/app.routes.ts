import { Routes } from '@angular/router';
import { IntroGuard } from './guards/intro/intro.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.routes').then( m => m.MAIN_ROUTES),
    canActivate: [IntroGuard]
  },
  {
    path: 'entry',
    loadComponent: () => import('./pages/entry/entry.page').then( m => m.EntryPage)
  },
  {
    path: 'collections',
    loadComponent: () => import('./pages/collections/collections.page').then( m => m.CollectionsPage)
  },
  {
    path: 'intro',
    loadComponent: () => import('./pages/intro/intro.page').then( m => m.IntroPage)
  },

];