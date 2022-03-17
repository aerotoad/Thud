import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'epochTimeago'
})
export class EpochTimeagoPipe implements PipeTransform {

  transform(value: number): string {
    return moment(value).fromNow();
  }

}
