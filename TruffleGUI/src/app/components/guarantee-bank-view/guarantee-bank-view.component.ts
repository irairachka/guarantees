import {Component, EventEmitter, Input, OnInit, Output, Injectable, Inject} from '@angular/core';
import {GRequest, Guarantee} from "../../interfaces/request";
import {EtheriumService} from "../../services/real-etherium.service";


@Component({
  selector: 'guarantee-bank-view',
  templateUrl: './guarantee-bank-view.component.html',
  styleUrls: ['./guarantee-bank-view.component.scss']
})
@Injectable()
export class GuaranteeBankViewComponent {
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
  index: number = 0;
  requestHistory: any[];
  guaranteeHistory: any[];
  // therequestState: RequestState ;
  // treguaranteeState:GuaranteeState;

  constructor(@Inject(EtheriumService) private truffleSRV: EtheriumService) {}

  openModal(e) {
    console.log('openModal', e);
    let modalData = {
      user: this.user,
      request: e
    };
    this.triggerModal.emit(modalData);
  }
  updateRequestsender(data){
    this.closeAccordion();
    this.updateRequest.emit(data);
  }

  updateGuaranteesender(data){
    console.log('updateGuaranteesender', data);
    this.updateRequest.emit(data);
  }

  setIndex(index) {
    this.index = index;
  }

  closeAccordion() {
    this.index = -1;
  }

  getRequestHistory(req: GRequest) {
    // this.setIndex(e.index);
    this.truffleSRV.getRequestHistory(req.GRequestID).then((res: any[]) => {
     this.requestHistory = res;
    });
  }

  getGuaranteeHistory(guar: Guarantee) {
    this.truffleSRV.getGuarantyHistory(guar.GuaranteeID).then((res: any[]) => {
      this.guaranteeHistory = res;
    });
  }
}
