import { Pipe, PipeTransform } from '@angular/core';
import {mapRequestState} from "../../interfaces/dataMap";

@Pipe({
  name: 'filterByKeyValue'
})
export class FilterByKeyValuePipe implements PipeTransform {

  transform(arr: any[], key: string, value: number, args?: any): any[] {
    return arr.filter(item => {
      if(key === 'RequestState') {
        let mappedStatus = mapRequestState[item[key]];
        return mappedStatus === value;
      } else if(key === 'GuaranteeState') {
        let mappedStatus = mapRequestState[item[key]];
        return mappedStatus === value;
      } else {
        return item[key] === value;
      }
    });
  }

}
