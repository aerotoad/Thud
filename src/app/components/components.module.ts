import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddFeedModalComponent } from './add-feed-modal/add-feed-modal.component';
import { AddCollectionComponent } from './add-collection/add-collection.component';
import { ArticleSettingsModalComponent } from './article-settings-modal/article-settings-modal.component';
import { IonicModule } from '@ionic/angular';
import { CollectionFeedsModalComponent } from './collection-feeds-modal/collection-feeds-modal.component';
import { PipesModule } from '../pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule
  ],
  declarations: [
    AddFeedModalComponent,
    AddCollectionComponent,
    ArticleSettingsModalComponent,
    CollectionFeedsModalComponent
  ],
})
export class ComponentsModule { }
