import { Pipe, PipeTransform } from '@angular/core';
import Collection, { CollectionFeed } from 'src/app/models/Collection';

@Pipe({
  name: 'orderByIndex'
})
export class OrderByIndexPipe implements PipeTransform {

  transform(array: CollectionFeed[] | Collection[]): Array<any> {
    if (array) {
      return array.sort((a, b) => a.index - b.index);
    } else {
      return [];
    }
  }

}
