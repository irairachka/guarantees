import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isNullOrUndefined} from "util";
import {GRequest, Guarantee} from "../../interfaces/request";

@Component({
  selector: 'app-guarantee-view',
  templateUrl: './guarantee-view.component.html',
  styleUrls: ['./guarantee-view.component.scss']
})
export class GuaranteeViewComponent implements OnInit{
  @Input() user: string; // TODO - handle enum and convert to string
  @Input() allRequests: GRequest[];
  @Input() allGuaranties: Guarantee[];
  @Output() triggerModal: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    console.log('this.allRequests', this.allRequests);
  }

  openModal(e) {
    let modalData = {
      user: this.user,
      request: e
    };
    this.triggerModal.emit(modalData);
  }
}
