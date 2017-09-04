import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'request-item',
  templateUrl: './request-item.component.html',
  styleUrls: ['./request-item.component.scss']
})
export class RequestItemComponent {
  @Input() request: any;
  @Output() emitRequest: EventEmitter<any> = new EventEmitter();

  openRequest() {
    this.emitRequest.emit(this.request);
  }
}
