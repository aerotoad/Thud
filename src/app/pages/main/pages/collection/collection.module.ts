import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectionPageRoutingModule } from './collection-routing.module';

import { CollectionPage } from './collection.page';
import { StreamComponent } from './components/stream/stream.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { EntryPreviewComponent } from './components/entry-preview/entry-preview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollectionPageRoutingModule,
    PipesModule
  ],
  declarations: [
    CollectionPage,
    StreamComponent,
    EntryPreviewComponent
  ]
})
export class CollectionPageModule {}
