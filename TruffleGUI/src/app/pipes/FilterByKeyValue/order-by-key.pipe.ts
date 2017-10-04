import { Pipe, PipeTransform } from '@angular/core';
import {isNullOrUndefined} from "util";

@Pipe({
  name: 'orderByKey'
})
export class OrderByKeyPipe implements PipeTransform {
  // transform(arr: any[], key: string, values: any, inverse?: boolean, args?: any): any[] {


  transform(arr: any[], key: string): any[] {
    if (isNullOrUndefined(arr)) {
      return;
    }

    let newVal = arr.sort((a: any, b: any) => {

      let date1 = new Date(a[key]).getTime();
      let date2 = new Date(b[key]).getTime();

      if (date1 > date2) {
        return 1;
      } else if (date1 < date2) {
        return -1;
      } else {
        return 0;
      }
    });
    // console.log(newVal);
    return newVal;
  }





}
