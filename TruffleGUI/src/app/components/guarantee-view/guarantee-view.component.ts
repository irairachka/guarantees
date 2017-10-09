import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GRequest, Guarantee} from "../../interfaces/request";
import {EtheriumService} from "../../services/mock-etherium.service";


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
  @Output() updateRequest: EventEmitter<any> = new EventEmitter();
  @Output() newRequest: EventEmitter<any> = new EventEmitter();
  // userName: any = {
  //   user: 'המבקש',
  //   bank: 'הבנק',
  //   beneficiary: 'המוטב'
  // };
  guaranteeHistory: any[];
  index: number = 1; // accordion open index
  // therequestState: RequestState ;
  // treguaranteeState:GuaranteeState;

  constructor(private truffleSRV: EtheriumService) {}

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

  getGuaranteeHistory(e) {
    this.truffleSRV.getGuarantyHistory(this.allRequests[e.index].GRequestID).then((res: any[]) => {
      this.guaranteeHistory = res;
    });
  }
}
