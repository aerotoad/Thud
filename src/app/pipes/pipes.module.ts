import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InArrayPipe } from './in-array/in-array.pipe';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InArrayPipe
  ],
  exports: [
    InArrayPipe
  ]
})
export class PipesModule { }
