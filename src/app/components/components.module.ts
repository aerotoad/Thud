import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddFeedModalComponent } from './add-feed-modal/add-feed-modal.component';
import { AddCollectionComponent } from './add-collection/add-collection.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    AddFeedModalComponent,
    AddCollectionComponent
  ],
})
export class ComponentsModule { }
