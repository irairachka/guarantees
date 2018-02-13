import {Component, EventEmitter, Input, OnInit, Output, Injectable, Inject} from '@angular/core';
import {GRequest, Guarantee, Beneficiary, Customer} from "../../interfaces/request";
import {EtheriumService} from "../../services/real-etherium.service";


@Component({
  selector: 'guarantee-user-view',
  templateUrl: './guarantee-user-view.component.html',
  styleUrls: ['./guarantee-user-view.component.scss']
})
@Injectable()
export class GuaranteeUserViewComponent implements OnInit{
  @Input() user: string; // TODO - handle enum and convert to string
  @Input() allRequests: GRequest[];
  @Input() allGuaranties: Guarantee[];
  @Input() beneficiaries: Beneficiary[] = [];
  @Input() customerDetails: Customer;
  @Output() triggerModal: EventEmitter<any> = new EventEmitter();
  @Output() updateRequest: EventEmitter<any> = new EventEmitter();
  @Output() newRequest: EventEmitter<any> = new EventEmitter();
  req1:GRequest[]
  requestHistory: any[];
  guaranteeHistory: any[];
  index: number = 1; // accordion open index
  // therequestState: RequestState ;
  // treguaranteeState:GuaranteeState;

  constructor(@Inject(EtheriumService) private truffleSRV: EtheriumService){ }

  ngOnInit() {
    // console.log("user view comp ngOnInit",this.customerDetails);
    // console.log('this.allRequests', this.allRequests);
    // console.log('this.allGuaranties', this.allGuaranties);
  }

  openModal(e) {
    console.log("openModal event",e);
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
    this.updateRequest.emit(data);
  }

  newRequestEmitter(e) {
    this.closeAccordion();
    this.newRequest.emit(e);
  }

  closeAccordion() {
    this.index = -1;
  }

  getRequestHistory(req: GRequest) {
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
