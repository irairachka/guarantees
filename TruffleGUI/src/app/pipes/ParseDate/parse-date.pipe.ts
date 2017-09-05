import { Pipe, PipeTransform } from '@angular/core';
import {isNullOrUndefined} from "util";

@Pipe({
  name: 'parseDate'
})
export class ParseDatePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if(isNullOrUndefined(value)) return;
    return value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4);
  }

}
