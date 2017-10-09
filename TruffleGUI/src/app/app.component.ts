import {Component, OnInit} from '@angular/core';

// Interfaces, mock data and utils
import {
  mockexpandedRequest, mockbeneficiaries, mockcustomers
} from '../../tempData/mockData';

import {GRequest, Guarantee, Beneficiary, Customer, ExpandedRequest} from "./interfaces/request";
import {isNullOrUndefined} from "util";
import {GuaranteeState, RequestState} from "./interfaces/enum";
import {EtheriumService} from "./services/mock-etherium.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Requests and Guarantees
  customerRequests: GRequest[] = [];
  customerGuaranties: Guarantee[] = [];
  bankRequests: GRequest[] = [];
  bankGuaranties: Guarantee[] = [];
  beneficiaryGuaranties: Guarantee[] = [];

  // User type data
  beneficiaries: Beneficiary[] =mockbeneficiaries || [];
  customers: Customer[] = mockcustomers || [];


  // Dialog data
  dialogData: any;
  openFormDialog: boolean = false; // show dialog
  modalType: string = 'user'; // dialog types

  constructor(private truffleSRV: EtheriumService) {}

  ngOnInit() {
    this.truffleSRV.getAllUserRequests().then((res: GRequest[]) => {
      this.customerRequests = res;
    });
    this.truffleSRV.getAllCustomerGuaranties().then((res: Guarantee[]) => {
      this.customerGuaranties = res;
    });
    this.truffleSRV.getAllBankRequests().then((res: GRequest[]) => {
      this.bankRequests = res;
    });
    this.truffleSRV.getAllBankGuaranties().then((res: Guarantee[]) => {
      this.bankGuaranties = res;
    });
    this.truffleSRV.getAllBeneficiaryGuaranties().then((res: Guarantee[]) => {
      this.beneficiaryGuaranties = res;
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




    // }
    // else
    // {
    //     throw new Error('hashcode is empty');
    // }
  // };


  // rejectRequest = (requestId,comment) => {
  //   // ביטול של בנק
  //   for (var i in this.bankRequests) {
  //     if (this.bankRequests[i].GRequestID==requestId) {
  //       this.bankRequests[i].requestState=RequestState.rejected;
  //       break; //Stop this loop, we found it!
  //     }
  //   }
  //
  //   this.customerRequests=[...this.bankRequests];
  //   this.bankRequests=[...this.bankRequests];
  //
  //
  // };

  getGRequestData = (requestId, type: number) => {
    for (let i in this.bankRequests) {
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

  handleCreateRequest = (e) => {
    console.log('e', e);
    //todo  open ids
    let newRequest = this.truffleSRV.createRequest('0xd532D3531958448e9E179729421B92962fb81Ddc',
    '0xd532D3531958448e9E179729421B92962fb81Ddc', '0xd532D3531958448e9E179729421B92962fb81Ddc',
    e.purpose, e.amount, new Date(e.startDate).getTime()/1000, new Date(e.endDate).getTime()/1000, 0, 0);
    this.addNewUserRequests(newRequest);
    this.addNewBankRequests(newRequest);
  };

  handleRequestUpdate = (e) => {
    console.log('e',e);
    let updatedRequest;
    switch (e.type) {
      case 'withdrawal':
        updatedRequest = this.truffleSRV.withdrawalRequest(e.requestId, '');
        this.updateUserRequests(updatedRequest);
        this.updateBankRequests(updatedRequest);
        break;
      case 'updateBank':
        console.log(`update success! id: ${e.requestId} comment: ${e.details}`);
        updatedRequest = this.truffleSRV.updateRequest(e.requestId, e.details);
        this.updateUserRequests(updatedRequest);
        this.updateBankRequests(updatedRequest);
        break;
      case 'accept':
        console.log(`accept success! id: ${e.requestId}`);
        updatedRequest = this.truffleSRV.acceptRequest(e.requestId, '', '');
        this.updateUserRequests(updatedRequest.request);
        this.updateBankRequests(updatedRequest.request);
        this.addNewUserGuarantee(updatedRequest.guarantee);
        this.addNewBankGuarantee(updatedRequest.guarantee);
        this.addNewBenefGuarantee(updatedRequest.guarantee);
        break;
      case 'reject':
        console.log(`reject success! id: ${e.requestId} comment: ${e.details}`);
        updatedRequest = this.truffleSRV.rejectRequest(e.requestId, e.details);
        this.updateUserRequests(updatedRequest);
        this.updateBankRequests(updatedRequest);
        break;
      case 'terminate':
        console.log(`terminate success! id: ${e.guaranteeId}`);
        updatedRequest = this.truffleSRV.terminateGuatanty(e.guaranteeId, e.requestId, '', '');
        this.updateUserRequests(updatedRequest.request);
        this.updateBankRequests(updatedRequest.request);
        this.updateUserGuarantees(updatedRequest.guarantee);
        this.updateBankGuarantees(updatedRequest.guarantee);
        this.updateBenefGuarantees(updatedRequest.guarantee);
        break;
      case 'guaranteeUpdate':
        console.log(`update success! id: ${e.guaranteeId} amount: ${e.update.amount} date: ${e.update.date}`);
        updatedRequest = this.truffleSRV.guaranteeUpdate(e.guaranteeId, e.requestId, '', e.update.amount, e.update.date);
        this.updateUserRequests(updatedRequest.request);
        this.updateBankRequests(updatedRequest.request);
        this.updateUserGuarantees(updatedRequest.guarantee);
        this.updateBankGuarantees(updatedRequest.guarantee);
        this.updateBenefGuarantees(updatedRequest.guarantee);
        break;
      default:
        break;
    }
  };

  addNewUserRequests = (newRequest) => {
    this.customerRequests = [...this.customerRequests, newRequest];
  };

  addNewBankRequests = (newRequest) => {
    this.bankRequests = [...this.bankRequests, newRequest];
  };

  updateUserRequests = (updatedRequest) => {
    this.customerRequests = this.customerRequests.map((el) => {
      return el.GRequestID === updatedRequest.GRequestID ? updatedRequest : el;
    });
  };

  updateBankRequests = (updatedRequest) => {
    this.bankRequests = this.bankRequests.map((el) => {
      return el.GRequestID === updatedRequest.GRequestID ? updatedRequest : el;
    });
  };

  addNewUserGuarantee = (newGuarantee) => {
    console.log('newGuarantee', newGuarantee);
    this.customerGuaranties = [...this.customerGuaranties, newGuarantee];
  };

  addNewBankGuarantee = (newGuarantee) => {
    this.bankGuaranties = [...this.bankGuaranties, newGuarantee];
  };

  addNewBenefGuarantee = (newGuarantee) => {
    this.beneficiaryGuaranties = [...this.beneficiaryGuaranties, newGuarantee];
  };

  updateUserGuarantees = (updatedGuarantee) => {
    this.customerGuaranties = this.customerGuaranties.map((el) => {
      return el.GRequestID === updatedGuarantee.GRequestID ? updatedGuarantee : el;
    });
  };

  updateBankGuarantees = (updatedGuarantee) => {
    this.bankGuaranties = this.bankGuaranties.map((el) => {
      return el.GRequestID === updatedGuarantee.GRequestID ? updatedGuarantee : el;
    });
  };

  updateBenefGuarantees = (updatedGuarantee) => {
    this.beneficiaryGuaranties = this.beneficiaryGuaranties.map((el) => {
      return el.GRequestID === updatedGuarantee.GRequestID ? updatedGuarantee : el;
    });
  };
}
