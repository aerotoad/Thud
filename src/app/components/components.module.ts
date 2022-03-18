import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddFeedModalComponent } from './add-feed-modal/add-feed-modal.component';
import { AddCollectionComponent } from './add-collection/add-collection.component';
import { ViewWebsiteModalComponent } from './view-website-modal/view-website-modal.component';
import { ArticleSettingsModalComponent } from './article-settings-modal/article-settings-modal.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    AddFeedModalComponent,
    AddCollectionComponent,
    ViewWebsiteModalComponent,
    ArticleSettingsModalComponent
  ],
})
export class ComponentsModule { }
