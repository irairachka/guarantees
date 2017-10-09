import { Injectable, isDevMode } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
import {MessageService} from "primeng/components/common/messageservice";
import {
  mockCustomerRequests, mockcustomers, mockCustomerGuaranties, bankData,
  mockBankRequests, mockBankGuaranties, mockbeneficiaries, mockexpandedRequest, mockBeneficiaryGuaranties, userData
} from "../../../tempData/mockData";
import {Beneficiary, Customer, Guarantee} from "../interfaces/request";
import {Observable} from "rxjs/Rx";
import {GuaranteeState, RequestState} from "../interfaces/enum";

// Import our contract artifacts and turn them into usable abstractions.
const GuaranteeRequest_artifact = require('../../../../build/contracts/GuaranteeRequest.json');
const Regulator_artifact = require('../../../../build/contracts/Regulator.json');
// const DigitalGuaranteeBNHP_artifact = require('../../../build/contracts/DigitalGuaranteeBNHP.json');


@Injectable()
export class EtheriumService {
  idmoc: number = 1000;
  web3:any;
  Regulator = contract(Regulator_artifact);
  GuaranteeRequest = contract(GuaranteeRequest_artifact);
  // DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);

  accounts:any;
  account:any;

  constructor(private msgService:MessageService) {}

  /************************/
  /**  Get User Data   ****/
  /************************/

  getCustomerData = (customerAddress?) => {
    return new Promise((resolve)=> {
      resolve(userData);
    });
  };

  getRequestHistory = (requestAddress) => {
    return new Promise((resolve) => {
      resolve(mockexpandedRequest[0].log);
    });
  };

  getAllUserRequests = () => {
    return this.getAllRequests();
  };

  getAllRequests = ()=> {
    /** Gets all guarantee requests for customer */
    return new Promise((resolve)=> {
      resolve(mockCustomerRequests);
    });
  };

  getAllCustomerGuaranties = () => {
    return this.getAllGuaranties();
  };


  getAllGuaranties = () => {
    return new Promise((resolve) => {
      resolve(mockCustomerGuaranties);
    });
  };

  /** ****************** **/
  /**  Get Bank Data     **/
  /** ****************** **/

  getBankData = (requestAddress?) => {
    return new Promise((resolve) => {
      resolve(bankData);
    });
  };

  getAllBankRequests = () => {
    /** Gets all guarantee requests for customer */
    /** parses the data and sends to UI */
    return new Promise((resolve) => {
      resolve(mockBankRequests);
    });
  };

  getAllBankGuaranties = () => {
    return new Promise((resolve) => {
      resolve(mockBankGuaranties);
    });
  };

  /** ************************* **/
  /**  Get Beneficiary Data     **/
  /** ************************* **/

  getAllBeneficiaries = () => {
    return new Promise((resolve) => {
      resolve(mockbeneficiaries);
    });
  };

  getAllBeneficiaryGuaranties = () => {
    return new Promise((resolve) => {
      resolve(mockBeneficiaryGuaranties);
    });
  };

  getBeneficiaryData = (id) => {
    return mockbeneficiaries[0];
  };

  /** ************************/
  /**    Update requests  ****/
  /** ************************/

  createRequest( userId , bankId, benefId , purpose,
                 amount, StartDate, EndDate, indexType, indexDate) {
    this.idmoc = this.idmoc +1;
    this.msgService.add({severity: 'success', summary:'ערבות חדשה', detail:'בקשה לערבות חדשה נשלחה בהצלחה'});
    return this.populateRequestData(
      [''+this.idmoc,
        '0xd532D3531958448e9E179729421B92962fb81Ddc',
        '0xd532D3531958448e9E179729421B92962fb81Ddc',
        '0xd532D3531958448e9E179729421B92962fb81Ddc',
        purpose,
        amount,
        StartDate,
        EndDate,
        indexType,
        indexDate,
        RequestState.waitingtobank
      ]
    );
  };

  withdrawalRequest = (requestId, comment) => {
    let updatedItem = mockCustomerRequests.find((item) => {
      return item.GRequestID === requestId;
    });
    updatedItem.requestState = RequestState.withdrawed;
    return updatedItem;
  };

  updateRequest = (requestId, comment) => {
    // עדכון של בנק
    let updatedItem = mockCustomerRequests.find((item) => {
      return item.GRequestID === requestId;
    });
    updatedItem.requestState = RequestState.handling;
    return updatedItem;
  };

  rejectRequest = (requestId, comment) => {
    let rejectedItem = mockCustomerRequests.find((item) => {
      return item.GRequestID === requestId;
    });
    rejectedItem.requestState = RequestState.rejected;
    return rejectedItem;
  };

  acceptRequest = (requestId, comment , hashcode) => {
    // אישור של בנק
    // if  (hashcode) {

    // find and change state of selected request
    let acceptedItem = mockCustomerRequests.find((item) => {
      return item.GRequestID === requestId;
    });
    acceptedItem.requestState = RequestState.accepted;

    // generate new guarantee
    let guarantee = {
          GuaranteeID: acceptedItem.GRequestID,
          GRequestID: acceptedItem.GRequestID,
          customer: acceptedItem.customer,
          beneficiary: acceptedItem.GRequestID,
          bank: acceptedItem.GRequestID,
          customerName: this.getOneCustomerData(acceptedItem.customer).Name,
          StartDate: acceptedItem.StartDate,
          EndDate: acceptedItem.EndDate,
          amount: acceptedItem.amount,
          purpose: acceptedItem.purpose,
          indexType: acceptedItem.indexType,
          indexDate: acceptedItem.indexDate,
          guaranteeState: GuaranteeState.Valid };

    return {
      request: acceptedItem,
      guarantee
    };
  };

  terminateGuatanty = (guaranteeId, requestId, comment , hashcode) => {
    // if  (hashcode) {
    // find and change state of selected request
    let terminatedRequest = mockCustomerRequests.find((item) => {
      return item.GRequestID === requestId;
    });
    terminatedRequest.requestState = RequestState.terminationRequest;

    let terminatedGuarantee = mockCustomerGuaranties.find((item) => {
      return item.GuaranteeID === guaranteeId;
    });
    terminatedGuarantee.guaranteeState = GuaranteeState.Terminated;

    return {
      request: terminatedRequest,
      guarantee: terminatedGuarantee
    }
  };

  guaranteeUpdate = (guatantyId, requestId, comment, amount, date) => {
    // if  (hashcode) {
    // find and change state of selected request
    let unpdatedRequest = mockCustomerRequests.find((item) => {
      return item.GRequestID === requestId;
    });
    unpdatedRequest.amount = amount;
    unpdatedRequest.EndDate = date;

    let updatedGuarantee = mockCustomerGuaranties.find((item) => {
      return item.GuaranteeID === guatantyId;
    });
    updatedGuarantee.amount = amount;
    updatedGuarantee.EndDate = date;

    return {
      request: unpdatedRequest,
      guarantee: updatedGuarantee
    }
  };

  /** ***********************/
  /**  Helper Function   ****/
  /** ***********************/

  getGuarantyHistory = (requestId) => {
    return new Promise((resolve) => {
      resolve(mockexpandedRequest[0].log);
    });
  };

  populateRequestData = (resultArr) => {
      const startDate = this.transformDateSolToJS(resultArr[6]);
      const endDate = this.transformDateSolToJS(resultArr[7]);


      return {
        GRequestID: resultArr[0],
        customer: resultArr[1],
        beneficiary: resultArr[3],
        bank: resultArr[2],
        beneficiaryName: this.getBeneficiaryData(resultArr[3]).Name,
        purpose: resultArr[4],
        amount: resultArr[5].valueOf(),
        StartDate: startDate,
        EndDate: endDate,
        indexType: resultArr[8].valueOf(),
        indexDate: resultArr[9].valueOf(),
        requestState: resultArr[10].valueOf()
      };
    };

  transformDateSolToJS = (longDate) => {
    const date = new Date(longDate * 1000);
    return date.toLocaleDateString('en-GB');
  };

  getOneCustomerData = (customerAddress): Customer => {
    for (var i in mockcustomers) {
      if (mockcustomers[i].customerID==customerAddress) {
        return mockcustomers[i];
      }
    }
    return mockcustomers[0];
  };
}
