import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'inArray',
    standalone: true
})
export class InArrayPipe implements PipeTransform {

  transform(value: string, array: string[]): boolean {
    if (array) {
      if (array.indexOf(value) > -1) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

}
