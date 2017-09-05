import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isNullOrUndefined} from "util";
import {GRequest} from "../../interfaces/request";

@Component({
  selector: 'app-guarantee-view',
  templateUrl: './guarantee-view.component.html',
  styleUrls: ['./guarantee-view.component.scss']
})
export class GuaranteeViewComponent implements OnInit {
  @Input() user: string; // TODO - handle enum and convert to string
  @Input() allRequests: GRequest[];
  @Output() triggerModal: EventEmitter<any> = new EventEmitter();

  // temp value
  numForTreatment: number = 2; // get from length of arr

  allGuarantees: any[];
  constructor() { }

  ngOnInit() {
    // this.allRequests = [
    //   {
    //     id: 15211,
    //     status: 'for-treatment',
    //     beneficiary: 'עיריית ת"א',
    //     purpose: 'מכרז עבוודת החינוך',
    //     amount: 50000,
    //     startDate: '1.1.2017',
    //     endDate: '31.12.2017'
    //   },
    //   {
    //     id: 15441,
    //     status: 'for-treatment',
    //     beneficiary: 'עיריית ת"א',
    //     purpose: 'מכרז עבוודת החינוך',
    //     amount: 50000,
    //     startDate: '1.1.2017',
    //     endDate: '31.12.2017'
    //   },
    //   {
    //     id: 54431,
    //     status: 'pending',
    //     beneficiary: 'עיריית ת"א',
    //     purpose: 'מכרז עבוודת החינוך',
    //     amount: 50000,
    //     startDate: '1.1.2017',
    //     endDate: '31.12.2017'
    //   },
    //   {
    //     id: 54731,
    //     status: 'pending',
    //     beneficiary: 'עיריית ת"א',
    //     purpose: 'מכרז עבוודת החינוך',
    //     amount: 50000,
    //     startDate: '1.1.2017',
    //     endDate: '31.12.2017'
    //   },
    //   {
    //     id: 51431,
    //     status: 'pending',
    //     beneficiary: 'עיריית ת"א',
    //     purpose: 'מכרז עבוודת החינוך',
    //     amount: 50000,
    //     startDate: '1.1.2017',
    //     endDate: '31.12.2017'
    //   }
    // ];
    this.allGuarantees = [
      {
        id: 15211,
        status: 0,
        beneficiary: 'עיריית ת"א',
        purpose: 'מכרז עבוודת החינוך',
        amount: 50000,
        startDate: '1.1.2017',
        endDate: '31.12.2017'
      },
      {
        id: 15441,
        status: 1,
        beneficiary: 'עיריית ת"א',
        purpose: 'מכרז עבוודת החינוך',
        amount: 50000,
        startDate: '1.1.2017',
        endDate: '31.12.2017'
      }
    ]
  }

  openModal(e) {
    let modalData = {
      user: this.user,
      request: e
    };
    this.triggerModal.emit(modalData);
  }
}
