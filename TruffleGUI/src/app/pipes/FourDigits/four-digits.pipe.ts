import { Pipe, PipeTransform } from '@angular/core';
import {isNullOrUndefined} from "util";

@Pipe({
  name: 'fourDigits'
})
export class FourDigitsPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if(isNullOrUndefined(value)) return;
    return value.substr(value.length - 4);
  }

}
