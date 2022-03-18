import { Pipe, PipeTransform } from '@angular/core';
import { CollectionFeed } from 'src/app/models/Collection';

@Pipe({
  name: 'orderByIndex'
})
export class OrderByIndexPipe implements PipeTransform {

  transform(feedList: CollectionFeed[]): CollectionFeed[] {
    if (feedList) {
      return feedList.sort((a, b) => a.index - b.index);
    } else {
      return [];
    }
  }

}
