import { Pipe, PipeTransform } from '@angular/core';
import {mapRequestState} from "../../interfaces/dataMap";
import {isNullOrUndefined} from "util";

@Pipe({
  name: 'filterByKeyValue'
})
export class FilterByKeyValuePipe implements PipeTransform {

  transform(arr: any[], key: string, value: number, args?: any): any[] {
    if(isNullOrUndefined(arr)) {
      return;
    }
    return arr.filter(item => {
      if(key === 'requestState') {
        let mappedStatus = mapRequestState[item[key]];
        return mappedStatus === value;
      } else if(key === 'guaranteeState') {
        let mappedStatus = mapRequestState[item[key]];
        return mappedStatus === value;
      } else {
        return item[key] === value;
      }
    });
  }

}
