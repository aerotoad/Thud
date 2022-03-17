import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddFeedModalComponent } from './add-feed-modal/add-feed-modal.component';
import { AddCollectionComponent } from './add-collection/add-collection.component';
import { ViewWebsiteModalComponent } from './view-website-modal/view-website-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    AddFeedModalComponent,
    AddCollectionComponent,
    ViewWebsiteModalComponent
  ],
})
export class ComponentsModule { }
