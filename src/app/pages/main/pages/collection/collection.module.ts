import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectionPageRoutingModule } from './collection-routing.module';

import { CollectionPage } from './collection.page';
import { StreamComponent } from './components/stream/stream.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollectionPageRoutingModule
  ],
  declarations: [
    CollectionPage,
    StreamComponent
  ]
})
export class CollectionPageModule {}
