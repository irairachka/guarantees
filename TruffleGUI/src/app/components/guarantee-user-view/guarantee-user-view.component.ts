import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isNullOrUndefined} from "util";
import {GRequest, Guarantee} from "../../interfaces/request";
import {RequestState, GuaranteeState} from "../../interfaces/enum";


@Component({
  selector: 'guarantee-user-view',
  templateUrl: './guarantee-user-view.component.html',
  styleUrls: ['./guarantee-user-view.component.scss']
})
export class GuaranteeUserViewComponent implements OnInit{
  @Input() user: string; // TODO - handle enum and convert to string
  @Input() allRequests: GRequest[];
  @Input() allGuaranties: Guarantee[];
  @Output() triggerModal: EventEmitter<any> = new EventEmitter();
  @Output() updateRequest: EventEmitter<any> = new EventEmitter();
  @Output() newRequest: EventEmitter<any> = new EventEmitter();
  // userName: any = {
  //   user: 'המבקש',
  //   bank: 'הבנק',
  //   beneficiary: 'המוטב'
  // };
  index: number = 1; // accordion open index
  // therequestState: RequestState ;
  // treguaranteeState:GuaranteeState;

  ngOnInit() {
    console.log('this.allRequests', this.allRequests);
    console.log('this.allGuaranties', this.allGuaranties);
  }

  openModal(e) {
    console.log('openModal', e);
    let modalData = {
      user: this.user,
      request: e
    };
    this.triggerModal.emit(modalData);
  }
  updateRequestsender(data){
    this.updateRequest.emit(data);
  }

  updateGuaranteesender(data){
    console.log('updateGuaranteesender', data);
    this.updateRequest.emit(data);
  }

  newRequestEmitter(e) {
    this.closeAccordion();
    this.newRequest.emit(e);
  }

  closeAccordion() {
    this.index = -1;
  }
}
