import {Component, OnDestroy, OnInit, Injectable, Inject} from '@angular/core';

// Interfaces, mock data and utils
import {
  mockexpandedRequest, mockbeneficiaries, mockcustomers
} from '../../tempData/mockData';

import {GRequest, Guarantee, Beneficiary, Customer, ExpandedRequest, Bank} from "./interfaces/request";
import {EtheriumService} from "./services/real-etherium.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable()
export class AppComponent implements OnInit, OnDestroy {

  // Requests and Guarantees
  customerRequests: GRequest[] = [];
  customerGuaranties: Guarantee[] = [];
  bankRequests: GRequest[] = [];
  bankGuaranties: Guarantee[] = [];
  beneficiaryGuaranties: Guarantee[] = [];

  // User type data
  beneficiaries: Beneficiary[] = [];
  customer: Customer;
  bank: Bank;

  constructor(@Inject(EtheriumService) private truffleSRV: EtheriumService)
  {
    let account;
    truffleSRV.lasyInit().then((account));
  }

  ngOnInit() {

    this.watcher();



    this.truffleSRV.getAllBeneficiaries().then((res: Beneficiary[]) => {
      this.beneficiaries = res;
      console.log("this.beneficiaries=",this.beneficiaries);
    });

    this.truffleSRV.getBankData().then((res: Bank) => {
      this.bank = res;
      console.log("this.bank=",this.bank);
    });

    // Get user, bank and beneficiary data
    this.truffleSRV.getCustomerData().then((res: Customer) => {
      this.customer = res;
      console.log("this.customer=",this.customer);
    });

    // get requests and guarantee data
    this.truffleSRV.getAllUserRequests().then((res: GRequest[]) => {
      this.customerRequests = res;
      console.log("this.customerRequests=",this.customerRequests);
    });
    this.truffleSRV.getAllCustomerGuaranties().then((res: Guarantee[]) => {
      this.customerGuaranties = res;
      console.log("this.customerGuaranties=",this.customerGuaranties);
    });
    this.truffleSRV.getAllRequests().then((res: GRequest[]) => {
      this.bankRequests = res;
      console.log("this.bankRequests",this.bankRequests);
    });
    this.truffleSRV.getAllGuaranties().then((res: Guarantee[]) => {
      this.bankGuaranties = res;
      console.log("this.bankGuaranties",this.bankGuaranties);
    });
    this.truffleSRV.getAllBeneficiaryGuarantees().then((res: Guarantee[]) => {
      this.beneficiaryGuaranties = res;
      console.log("this.beneficiaryGuaranties",this.beneficiaryGuaranties);

    });
    // console.log("user app comp ngOnInit end");
  }


  handleCreateRequest = (e) => {
     console.log("handleCreateRequest ",e.userId, this.bank.bankID, e.beneficiary, e.purpose, e.amount, e.startDate, e.endDate, 0, 0);
    let newRequest = this.truffleSRV.createRequest(e.userId, this.bank.bankID, e.beneficiary, e.purpose, e.amount,
      e.startDate, e.endDate, 0, 0).then((newRequest)=> {
      console.log("newRequest", newRequest);
      this.addNewUserRequests(newRequest);
      this.addNewBankRequests(newRequest);
    });
  };

  handleRequestUpdate = (e) => {
    console.log('e',e);
    let updatedRequest;
    switch (e.type) {
      case 'withdrawal':
        updatedRequest = this.truffleSRV.withdrawalRequest(e.requestId, '').then((updatedRequest)=>{
          this.updateUserRequests(updatedRequest);
          this.updateBankRequests(updatedRequest);
        });
        break;
      case 'updateBank':
        console.log(`update success! id: ${e.requestId} comment: ${e.details}`);
        updatedRequest = this.truffleSRV.updateRequest(e.requestId, e.details).then((updatedRequest)=>{
          this.updateUserRequests(updatedRequest);
          this.updateBankRequests(updatedRequest);
        });
        break;
      case 'accept':
        console.log(`accept success! id: ${e.requestId}`);
         this.truffleSRV.acceptRequest(e.requestId, '', '').then((updatedRequest)=>{
           // debugger;
           if(!isNullOrUndefined(updatedRequest)) {
             console.log(`acceptRequest success! id: ${e}`, updatedRequest);

             this.updateUserRequests(updatedRequest.request);
             this.updateBankRequests(updatedRequest.request);

             if (updatedRequest.terminatedguarantee != null) {
               this.updateUserGuarantees(updatedRequest.terminatedguarantee);
               this.updateBankGuarantees(updatedRequest.terminatedguarantee);
               this.updateBenefGuarantees(updatedRequest.terminatedguarantee);
             }
           }

           this.truffleSRV.guaranteeSignComplite(e.requestId, '', '').then((guarantee)=>{
             // debugger;
             this.addNewUserGuarantee(guarantee);
             this.addNewBankGuarantee(guarantee);
             this.addNewBenefGuarantee(guarantee);
           });

        });


        break;
      case 'reject':
        updatedRequest = this.truffleSRV.rejectRequest(e.requestId, e.details).then((updatedRequest)=>{
          if(!isNullOrUndefined(updatedRequest)) {
            console.log(`reject success! id: ${e.requestId} comment: ${e.details}`);
            this.updateUserRequests(updatedRequest);
            this.updateBankRequests(updatedRequest);
          }
        });
        break;
      case 'terminate':
        updatedRequest = this.truffleSRV.terminateGuatanty(e.guaranteeId, e.requestId, '', '').then((res)=>{
          if(!isNullOrUndefined(res)) {
            console.log(`terminate success! id: ${e.guaranteeId}`,res);
            this.updateUserGuarantees(res.guarantee);
            this.updateBankGuarantees(res.guarantee);
            this.updateBenefGuarantees(res.guarantee);
            this.updateUserRequests(res.request);
            this.updateBankRequests(res.request);
          }
        });
        break;
      case 'guaranteeUpdate':
        console.log(`update success! id: ${e.guaranteeId} amount: ${e.update.amount} date: ${e.update.date}`);
        this.truffleSRV.guaranteeUpdate(e.guaranteeId, e.requestId, '', e.update.amount, e.update.date).then((response:any)=>{
          this.addNewUserRequests(response);
          this.addNewBankRequests(response);
          });
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

  watcher(){
    this.truffleSRV.startCreateListener(this.listenerCallback);
  }

  listenerCallback(e) {
    console.log('e', e);
  }

  ngOnDestroy() {
    this.truffleSRV.stopCreateListener();
  }
}
