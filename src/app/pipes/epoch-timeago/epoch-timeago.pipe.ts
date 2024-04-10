import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

@Pipe({
    name: 'epochTimeago',
    standalone: true
})
export class EpochTimeagoPipe implements PipeTransform {

  transform(value: number): string {
    return dayjs(value).fromNow();
  }

}
