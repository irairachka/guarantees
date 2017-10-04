import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isNullOrUndefined} from "util";
import {GRequest, Guarantee} from "../../interfaces/request";
import {RequestState, GuaranteeState} from "../../interfaces/enum";
import {TruffleService} from "../../services/truffle.service";


@Component({
  selector: 'guarantee-bank-view',
  templateUrl: './guarantee-bank-view.component.html',
  styleUrls: ['./guarantee-bank-view.component.scss']
})
export class GuaranteeBankViewComponent implements OnInit{
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
  requestHistory: any[];
  // therequestState: RequestState ;
  // treguaranteeState:GuaranteeState;

  constructor(private truffleSRV: TruffleService) {}
  ngOnInit() {
    // console.log('this.allRequests', this.allRequests);
    // console.log('this.allGuaranties', this.allGuaranties);
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
  getRequestHistory(e) {
    this.truffleSRV.getRequestHistory(this.allRequests[e.index].GRequestID).then((res: any[]) => {
     this.requestHistory = res;
    });
  }
}
