import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InArrayPipe } from './in-array/in-array.pipe';
import { EpochTimeagoPipe } from './epoch-timeago/epoch-timeago.pipe';
import { OrderByIndexPipe } from './order-by-index/order-by-index.pipe';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InArrayPipe,
    EpochTimeagoPipe,
    OrderByIndexPipe
  ],
  exports: [
    InArrayPipe,
    EpochTimeagoPipe,
    OrderByIndexPipe
  ]
})
export class PipesModule { }
