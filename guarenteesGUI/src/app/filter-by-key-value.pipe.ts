import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByKeyValue'
})
export class FilterByKeyValuePipe implements PipeTransform {

  transform(arr: any[], key: string, value: string, args?: any): any[] {
    return arr.filter(item => {
      return item[key] === value;
    });
  }

}
