import { Pipe, PipeTransform } from '@angular/core';
import {mapRequestState} from "../../interfaces/dataMap";
import {isNullOrUndefined} from "util";
import {RequestState,GuaranteeState} from "../../interfaces/enum";

@Pipe({
  name: 'filterByKeyValue'
})
export class FilterByKeyValuePipe implements PipeTransform {
  // transform(arr: any[], key: string, values: any, inverse?: boolean, args?: any): any[] {

  transform(arr: any[], key: string, values: any ,print:boolean): any[] {
    if (isNullOrUndefined(arr)) {
      return;
    }
    // debugger;
    return arr.filter(item => {
      if (Array.isArray(values))
      {
        // if (print )
        //   console.log(values,item[key],(values.indexOf(item[key]) >= 0));
      return (values.indexOf(item[key]) >= 0);
      }
      else
        return item[key] === values;
    });
  }


}
