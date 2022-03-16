import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    SwiperModule
  ],
  declarations: [
    SearchPage,
    SearchResultsComponent,
    DiscoverComponent
  ]
})
export class SearchPageModule {}
