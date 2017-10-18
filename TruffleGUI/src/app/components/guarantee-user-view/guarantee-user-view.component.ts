import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GRequest, Guarantee} from "../../interfaces/request";
import {EtheriumService} from "../../services/real-etherium.service";


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
  req1:GRequest[]
  requestHistory: any[];
  index: number = 1; // accordion open index
  // therequestState: RequestState ;
  // treguaranteeState:GuaranteeState;

  constructor(private truffleSRV: EtheriumService){ }

  ngOnInit() {
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

  getRequestHistory(e) {
    console.log("getRequestHistory event",e,this.allRequests);
    this.truffleSRV.getRequestHistory(this.allRequests[e.index].GRequestID).then((res: any[]) => {
      this.requestHistory = res;
    });
  }
}
