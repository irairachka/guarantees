import { Pipe, PipeTransform } from '@angular/core';
import {mapRequestState} from "../../interfaces/dataMap";
import {isNullOrUndefined} from "util";
import {RequestState} from "../../interfaces/enum";

@Pipe({
  name: 'filterByKeyValue'
})
export class FilterByKeyValuePipe implements PipeTransform {

  transform(arr: any[], key: string, value: any, inverse?: boolean, args?: any): any[] {
    if(isNullOrUndefined(arr)) {
      return;
    }
    if(inverse) {
      return arr.filter(item => {
        if(value === 'user') {
          return item[key] !== RequestState.waitingtocustomer &&
            item[key] !== RequestState.accepted;
        } else if(value === 'bank') {
          return item[key] === RequestState.handling;
        } else {
          return item[key] !== value;
        }
      });
    }
    return arr.filter(item => {
      if(value === 'user') {
        return item[key] === RequestState.waitingtocustomer;
      } else if(value === 'bank') {
        return item[key] === RequestState.waitingtobank;
      } else {
        return item[key] === value;
      }
    });
  }

}
