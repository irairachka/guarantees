import {Component, EventEmitter, Input, OnInit, Output, Injectable, Inject} from '@angular/core';
import {GRequest, Guarantee} from "../../interfaces/request";
import {EtheriumService} from "../../services/real-etherium.service";

@Component({
  selector: 'app-guarantee-view',
  templateUrl: './guarantee-view.component.html',
  styleUrls: ['./guarantee-view.component.scss']
})
@Injectable()
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
  index: number = 0; // accordion open index
  // therequestState: RequestState ;
  // treguaranteeState:GuaranteeState;

  constructor(@Inject(EtheriumService) private truffleSRV: EtheriumService) {}

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
    this.closeAccordion();
  }

  updateGuaranteesender(data){
    console.log('updateGuaranteesender', data);
    this.updateRequest.emit(data);
    this.closeAccordion();
  }

  newRequestEmitter(e) {
    this.closeAccordion();
    this.newRequest.emit(e);
  }

  setIndex(e) {
    this.index = e.index;
  }

  closeAccordion() {
    this.index = -1;
  }

  getGuaranteeHistory(guar: Guarantee) {
    this.truffleSRV.getGuarantyHistory(guar.GuaranteeID).then((res: any[]) => {
      this.guaranteeHistory = res;
    });
  }
}
