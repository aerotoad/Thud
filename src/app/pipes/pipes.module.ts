import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InArrayPipe } from './in-array/in-array.pipe';
import { EpochTimeagoPipe } from './epoch-timeago/epoch-timeago.pipe';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InArrayPipe,
    EpochTimeagoPipe
  ],
  exports: [
    InArrayPipe,
    EpochTimeagoPipe
  ]
})
export class PipesModule { }
