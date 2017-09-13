import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'guarantee-item',
  templateUrl: './guarantee-item.component.html',
  styleUrls: ['./guarantee-item.component.scss']
})
export class GuaranteeItemComponent {
  @Input() guarantee: any;
  @Output() emitGuarantee: EventEmitter<any> = new EventEmitter();
  @Output() updateRequest: EventEmitter<any> = new EventEmitter();

  // openRequest() {
   //   console.log('this.guarantee', this.guarantee);
   //   this.emitGuarantee.emit(this.guarantee);
   // }

}
