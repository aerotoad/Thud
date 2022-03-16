import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddFeedModalComponent } from './add-feed-modal/add-feed-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    AddFeedModalComponent
  ],
})
export class ComponentsModule { }
