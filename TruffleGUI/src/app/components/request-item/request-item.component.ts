import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GRequest} from "../../interfaces/request";

@Component({
  selector: 'request-item',
  templateUrl: './request-item.component.html',
  styleUrls: ['./request-item.component.scss']
})
export class RequestItemComponent {
  @Input() request: any;
  @Input() usestate: boolean=true;
  @Output() emitRequest: EventEmitter<any> = new EventEmitter();

  openRequest() {
    console.log('this.request', this.request);
    this.emitRequest.emit(this.request);
  }

}
