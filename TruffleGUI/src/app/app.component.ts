import {Component, OnInit} from '@angular/core';

// Interfaces, mock data and utils
import {
  mockBankGuaranties, mockBankRequests,
  mockBeneficiaryGuaranties, mockCustomerGuaranties,
  mockCustomerRequests, mockexpandedRequest, mockbeneficiaries, mockcustomers
} from '../../tempData/mockData';

import {GRequest, Guarantee, Beneficiary, Customer, ExpandedRequest} from "./interfaces/request";
import {isNullOrUndefined} from "util";
import {GuaranteeState, RequestState} from "./interfaces/enum";
import {TruffleService} from "./services/truffle.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Requests and Guarantees
  customerRequests: GRequest[] = [];
  customerGuaranties: Guarantee[] = mockCustomerGuaranties || [];
  bankRequests: GRequest[] = mockBankRequests || [];
  bankGuaranties: Guarantee[] = mockBankGuaranties || [];
  beneficiaryGuaranties: Guarantee[] = mockBeneficiaryGuaranties || [];

  // User type data
  beneficiaries: Beneficiary[] =mockbeneficiaries || [];
  customers: Customer[] = mockcustomers || [];


  // Dialog data
  dialogData: any;
  openFormDialog: boolean = false; // show dialog
  modalType: string = 'user'; // dialog types

  idmoc: number = 1000  ;

  constructor(private truffleSRV: TruffleService) {}

  ngOnInit() {
    this.truffleSRV.getAllUserRequests().then((res) => {
      this.customerRequests = res;
    });
  }

  // getGuaranteesData = (guaranteeID, type: number) => {
  //   //type = user, bank or beneficiary
  //   this.customerGuaranties.forEach((Guarantee) => {
  //     if (Guarantee.GuaranteeID==guaranteeID) return Request;
  //   });
  //
  //   this.bankGuaranties.forEach((Guarantee) => {
  //     if (Guarantee.GuaranteeID==guaranteeID) return Request;
  //   });
  //
  //   this.beneficiaryGuaranties.forEach((Request) => {
  //     if (Request.GuaranteeID==guaranteeID) return Request;
  //   });
  //
  // };

  getOneCustomerData = (customerAddress): Customer => {
      for (var i in this.customers) {
        if (this.customers[i].customerID==customerAddress) {
          return this.customers[i];
        }
      }
      return this.customers[0];
    };

  populateCustomerData= (customerAddress,resultArr) => {
    return {
      customerID: customerAddress,
      Name: resultArr[0],
      Address: resultArr[1],
    };
  };

  acceptRequest = (requestId, comment , hashcode) => {
    // אישור של בנק
    // if  (hashcode) {
    for (var i in this.bankRequests) {
      if (this.bankRequests[i].GRequestID==requestId) {
        this.bankRequests[i].requestState=RequestState.accepted;

        this.customerGuaranties=[...this.customerGuaranties,{
          GuaranteeID: this.bankRequests[i].GRequestID,
          GRequestID: this.bankRequests[i].GRequestID,
          customer: this.bankRequests[i].customer,
          beneficiary: this.bankRequests[i].GRequestID,
          bank: this.bankRequests[i].GRequestID,
          customerName: this.getOneCustomerData(this.bankRequests[i].customer).Name,
          StartDate: this.bankRequests[i].StartDate,
          EndDate: this.bankRequests[i].EndDate,
          amount: this.bankRequests[i].amount,
          purpose: this.bankRequests[i].purpose,
          indexType: this.bankRequests[i].indexType,
          indexDate: this.bankRequests[i].indexDate,
          guaranteeState: GuaranteeState.Valid
        }];

        this.bankGuaranties=[...this.customerGuaranties];
        this.beneficiaryGuaranties=[...this.customerGuaranties];
        // TODO - ask dimi if I should remove from list
        this.bankRequests = this.bankRequests.filter(item=> {
          return item.GRequestID !== requestId;
        });
        this.customerRequests=[...this.bankRequests];

        break; //Stop this loop, we found it!
      }
    }


    // }
    // else
    // {
    //     throw new Error('hashcode is empty');
    // }
  };


  rejectRequest = (requestId,comment) => {
    // ביטול של בנק
    for (var i in this.bankRequests) {
      if (this.bankRequests[i].GRequestID==requestId) {
        this.bankRequests[i].requestState=RequestState.rejected;
        break; //Stop this loop, we found it!
      }
    }

    this.customerRequests=[...this.bankRequests];
    this.bankRequests=[...this.bankRequests];


  };


  withdrawalRequest = (requestId) => {
    // ביטול של יוזר
    for (var i in this.bankRequests) {
      if (this.bankRequests[i].GRequestID==requestId) {
        this.bankRequests[i].requestState=RequestState.withdrawed;
        break; //Stop this loop, we found it!
      }
    }
    this.customerRequests = [...this.bankRequests];
    this.bankRequests = [...this.bankRequests];
    console.log("withdrawalRequest");
    console.log('this.bankRequests', this.bankRequests);
  };

  terminateGuatanty = (guatantyId) => {
    // ביטול של מוטב
    for (var i in this.customerGuaranties) {
      if (this.customerGuaranties[i].GuaranteeID==guatantyId) {
        this.customerGuaranties[i].guaranteeState=GuaranteeState.Terminated;

        for (var j in this.bankRequests) {
          if (this.bankRequests[j].GRequestID==this.customerGuaranties[i].GRequestID) {
            this.bankRequests[j].requestState=RequestState.terminationRequest;
            break; //Stop this loop, we found it!
          }
        }

        // this.customerRequests=[...this.bankRequests];

        break; //Stop this loop, we found it!
      }
    }

    this.customerRequests=[...this.bankRequests];
    this.bankGuaranties=[...this.customerGuaranties];
    this.beneficiaryGuaranties=[...this.customerGuaranties];

    console.log("terminateGuatanty");
    console.log(this.bankRequests);
    console.log(this.beneficiaryGuaranties);


  };


  guaranteeUpdate = (guatantyId,comment,ammount,date) => {
    // עדכון של מוטב
    for (var i in this.customerGuaranties) {
      if (this.customerGuaranties[i].GuaranteeID==guatantyId) {
        this.customerGuaranties[i].amount=ammount;
        this.customerGuaranties[i].EndDate=date;

        for (var j in this.bankRequests) {
          if (this.bankRequests[j].GRequestID==this.customerGuaranties[i].GRequestID) {
            this.bankRequests[j].amount=ammount;
            this.bankRequests[j].EndDate=date;
            break; //Stop this loop, we found it!
          }
        }

        break; //Stop this loop, we found it!
      }

    }

    this.customerRequests=[...this.bankRequests];
    this.bankGuaranties=[...this.customerGuaranties];
    this.beneficiaryGuaranties=[...this.customerGuaranties];

    console.log("guaranteeUpdate");
    console.log(this.bankRequests);
    console.log(this.beneficiaryGuaranties);

  };

  updateRequest = (requestId,state,comment) => {
    // עדכון של בנק
    for (var i in this.bankRequests) {
      if (this.bankRequests[i].GRequestID==requestId) {
        this.bankRequests[i].requestState=state;
        break; //Stop this loop, we found it!
      }
    }

    this.customerRequests=[...this.bankRequests];
    this.bankRequests=[...this.bankRequests];

    console.log("updateRequest");
    console.log(this.customerRequests);


  };


  getGRequestData = (requestId, type: number) => {

    for (var i in this.bankRequests) {
      if (this.bankRequests[i].GRequestID==requestId) {
        return this.fillMockRequest(i)
      }
    }


  };


  fillMockRequest = (index) :ExpandedRequest => {


    return mockexpandedRequest[index];
    // if (type==0)
    // {
    //   return {
    //     shortrequest: request,
    //     log: [{
    //       date: '01/09/17',
    //       state: RequestState.created,
    //       comment: null },
    //       {
    //         date: '01/09/17',
    //         state: RequestState.accepted,
    //         comment: "הכל מאושר על ידי משפטיט"
    //       }]
    //   }
    // }
    //   else
    // {
    //     return {
    //       shortrequest: request,
    //       log: [{
    //         date: '01/09/17',
    //     state: RequestState.created,
    //     comment: null
    //   },
    //     {
    //       date: '01/09/17',
    //       state: RequestState.rejected,
    //       comment: "אין כיסוי מספיק"
    //     }]
    //   }
    // }
  };

  // createRequest( userId , bankId, benefId , purpose,
  //                   amount, StartDate, EndDate, indexType, indexDate) {
  //   // this.transformDateSolToJS(resultArr[6]);
  //   this.idmoc = this.idmoc +1;
  //   this.customerRequests = [...this.customerRequests, this.populateRequestData(
  //     [''+this.idmoc,
  //       this.customers[0].customerID,
  //       this.customers[0].customerID,
  //       this.customers[0].customerID,
  //       purpose,
  //       amount,
  //       StartDate,
  //       EndDate,
  //       indexType,
  //       indexDate,
  //       RequestState.waitingtobank
  //     ]
  //   )];
  //
  //   this.bankRequests=this.customerRequests;
  //   this.msgService.add({severity: 'success', summary:'ערבות חדשה', detail:'בקשה לערבות חדשה נשלחה בהצלחה'});
  //   if(1==1) return ;
  //   else
  //   console.log("begin");
  //   this.Regulator
  //     .deployed()
  //     .then((instance) => {
  //       return instance.createGuaranteeRequest.call(userId, bankId, benefId, purpose, amount, StartDate, EndDate, indexType, indexDate,
  //         { from: this.account, gas: 6000000});
  //     }).then((guaranteeRequestAddress) => {
  //       console.log(guaranteeRequestAddress);
  //        this.onNewRequestSuccess(guaranteeRequestAddress);
  //   }).catch((e) => {
  //     console.log(e);
  //   });
  // };

  /** Handle form modal */
  openModal(e) {
    console.log('e', e);
    this.modalType = e.user;
    if(!isNullOrUndefined(e.request)) {
      this.dialogData = e.request;
      if(this.modalType !== 'beneficiary') {
        // TODO - get real history
        this.dialogData = Object.assign({}, this.dialogData, {history: this.fillMockRequest(1)})
      }
    }
    console.log('this.dialogData', this.dialogData);
    this.openFormDialog = true;
    console.log('this.openFormDialog', this.openFormDialog);
  }

  clearData() {
    this.dialogData = null;
  }

  // handleCreateRequest = (e) => {
  //   console.log('e', e);
  //   //todo  open ids
  //     this.createRequest('0xd532D3531958448e9E179729421B92962fb81Ddc',
  //     '0xd532D3531958448e9E179729421B92962fb81Ddc', '0xd532D3531958448e9E179729421B92962fb81Ddc',
  //     e.purpose, e.amount, new Date(e.startDate).getTime()/1000, new Date(e.endDate).getTime()/1000, 0, 0);
  // };

  handleRequestUpdate = (e) => {
    console.log('e',e);
    switch (e.type) {
      case 'withdrawal':
        console.log('withdraw success', e.requestId);
        this.withdrawalRequest(e.requestId);
        break;
      case 'updateBank':
        console.log(`update success! id: ${e.requestId} comment: ${e.details}`);
        this.updateRequest(e.requestId, RequestState.handling,e.details);
        break;
      case 'accept':
        console.log(`accept success! id: ${e.requestId}`);
        this.acceptRequest(e.requestId, '', '');
        break;
      case 'reject':
        console.log(`reject success! id: ${e.requestId} comment: ${e.details}`);
        this.rejectRequest(e.requestId, e.details);
        break;
      case 'terminate':
        console.log(`terminate success! id: ${e.guaranteeId}`);
        this.terminateGuatanty(e.guaranteeId);
        break;
      case 'guaranteeUpdate':
        console.log(`update success! id: ${e.guaranteeId} amount: ${e.update.amount} date: ${e.update.date}`);
        this.guaranteeUpdate(e.guaranteeId, '', e.update.amount, e.update.date);
        break;
      default:
        break;
    }
    this.openFormDialog = false;
  };

  transformDateSolToJS = (longDate) => {
    const date = new Date(longDate * 1000);
    return date.toLocaleDateString('en-GB');
  };

  transformDateJSToSol = (longDate) => {
    const date = new Date(longDate / 1000);
    // return date.toLocaleDateString('en-GB');
  };

  // onNewRequestSuccess = (requestAddress) => {
  //   // toaster = success;
  //   // close modal
  //   this.getOneGRequests(requestAddress);
  // }
}
