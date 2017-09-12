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
  @Output() updateRequest: EventEmitter<any> = new EventEmitter();
  @Output() newRequest: EventEmitter<any> = new EventEmitter();
  userName: any = {
    user: 'המבקש',
    bank: 'הבנק',
    beneficiary: 'המוטב'
  };
  index: number = 0; // accordion open index

  ngOnInit() {
    console.log('this.allRequests', this.allRequests);
    console.log('this.allGuaranties', this.allGuaranties);
  }

  openModal(e) {
    let modalData = {
      user: this.user,
      request: e
    };
    this.triggerModal.emit(modalData);
  }
  updateRequestsender(data){
    this.updateRequest.emit(data);
  }
  newRequestEmitter(e) {
    this.closeAccordion();
    this.newRequest.emit(e);
  }

  closeAccordion() {
    console.log('index', this.index)
    this.index = 1;
  }
}
