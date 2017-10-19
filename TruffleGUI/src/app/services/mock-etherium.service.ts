import { Injectable, isDevMode } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
import {MessageService} from "primeng/components/common/messageservice";
import {
  mockCustomerRequests, mockcustomers, mockCustomerGuaranties, bankData,
  mockBankRequests, mockBankGuaranties, mockbeneficiaries, mockexpandedRequest, mockBeneficiaryGuaranties, userData
} from "../../../tempData/mockData";
import {Beneficiary, Customer, Guarantee,GRequest} from "../interfaces/request";
import {Observable} from "rxjs/Rx";
import {GuaranteeState, RequestState} from "../interfaces/enum";

// // Import our contract artifacts and turn them into usable abstractions.
// const GuaranteeRequest_artifact = require('../../../../build/contracts/GuaranteeRequest.json');
// const Regulator_artifact = require('../../../../build/contracts/Regulator.json');
// // const DigitalGuaranteeBNHP_artifact = require('../../../build/contracts/DigitalGuaranteeBNHP.json');

@Injectable()
export class MockService {
  idmoc: number = 1000;
  web3:any;
  mockRequests ;
  mockGuarantees ;
  // Regulator = contract(Regulator_artifact);
  // GuaranteeRequest = contract(GuaranteeRequest_artifact);
  // DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);

  accounts:any;
  account:any;

  constructor(public msgService:MessageService) {
    this.mockRequests = mockCustomerRequests;
    this.mockGuarantees = mockCustomerGuaranties;

  }

  public setMockRequests (mockRequests)
  {
    this.mockRequests=mockRequests;
  };

  public setMockGuarantee(mockGuarantees)
  {
    this.mockGuarantees=mockGuarantees;
  };
  /************************/
  /**  Get User Data   ****/
  /************************/

  getCustomerData = (customerAddress?) => {
    return new Promise((resolve)=> {
      resolve(userData);
    });
  };

  getRequestHistory = (requestAddress) => {
    console.log("getRequestHistory",requestAddress);

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
    return this.getAllRequests();
  };

  // getAllBankRequests = () => {
  //   /** Gets all guarantee requests for customer */
  //   /** parses the data and sends to UI */
  //   return new Promise((resolve) => {
  //     resolve(mockBankRequests);
  //   });
  // };


  getAllBankGuaranties = () => {
    return this.getAllGuaranties();
  };

  // getAllBankGuaranties = () => {
  //   return new Promise((resolve) => {
  //     resolve(mockBankGuaranties);
  //   });
  // };

  /** ************************* **/
  /**  Get Beneficiary Data     **/
  /** ************************* **/

  getAllBeneficiaries = () => {
    return new Promise((resolve) => {
      resolve(mockbeneficiaries);
    });
  };

  getAllBeneficiaryGuaranties = () => {
    return this.getAllGuaranties();
  }

  // getAllBeneficiaryGuaranties = () => {
  //   return new Promise((resolve) => {
  //     resolve(mockBeneficiaryGuaranties);
  //   });
  // };

  getBeneficiaryData = (id) => {
    return mockbeneficiaries[0];
  };

  /** ************************/
  /**    Update requests  ****/
  /** ************************/

  createRequest( userId , bankId, benefId , purpose,
                 amount, StartDate, EndDate, indexType, indexDate):any {
    return new Promise((resolve, reject)=> {
      this.idmoc = this.idmoc + 1;
      this.msgService.add({severity: 'success', summary: 'ערבות חדשה', detail: 'בקשה לערבות חדשה נשלחה בהצלחה'});
      let newItem = this.populateRequestData(
        ['' + this.idmoc,
          userId,
          bankId,
          benefId,
          '',
          purpose,
          amount,
          StartDate,
          EndDate,
          indexType,
          indexDate,
          RequestState.waitingtobank
        ]
      );
      this.mockRequests = [...mockCustomerRequests, newItem];
      resolve(newItem);
    });
  };




  withdrawalRequest = (requestId, comment):any => {
    return new Promise((resolve, reject)=> {
      let updatedItem = this.mockRequests.find((item) => {
        return item.GRequestID === requestId;
      });
      updatedItem.requestState = RequestState.withdrawed;
      resolve(updatedItem);
    });
  };

  updateRequest = (requestId, comment) => {
    // עדכון של בנק
    return new Promise((resolve, reject)=> {
      let updatedItem = this.mockRequests.find((item) => {
        return item.GRequestID === requestId;
      });
      updatedItem.requestState = RequestState.handling;

      resolve(updatedItem);
    });
  };

  rejectRequest = (requestId, comment) => {
    return new Promise((resolve, reject)=> {
    let rejectedItem = this.mockRequests.find((item) => {
      return item.GRequestID === requestId;
    });
    rejectedItem.requestState = RequestState.rejected;
      resolve(rejectedItem);
    });
  };

  acceptRequest = (requestId, comment , hashcode) => {
    // אישור של בנק
    // if  (hashcode) {
    return new Promise((resolve, reject)=> {

      // find and change state of selected request
    let acceptedItem = this.mockRequests.find((item) => {
      return item.GRequestID === requestId;
    });
    acceptedItem.requestState = RequestState.accepted;

      resolve( acceptedItem);

    });

  };

  guaranteeSignComplite = (requestId, comment , hashcode):any => {
    return new Promise((resolve, reject)=> {


        // find and change state of selected request
        let acceptedItem = this.mockRequests.find((item) => {
          return item.GRequestID === requestId;
        });

        // generate new guarantee
        let guarantee =  this.populateGuaranteeData(
        [acceptedItem.GRequestID,
          acceptedItem.GRequestID,
          acceptedItem.GRequestID,
          acceptedItem.GRequestID,
          acceptedItem.GRequestID,
          this.getOneCustomerData(acceptedItem.customer).Name,
          acceptedItem.purpose,
          acceptedItem.amount,
          new Date(acceptedItem.StartDate).getTime()/1000,
          new Date(acceptedItem.EndDate).getTime()/1000,
          acceptedItem.indexType,
          acceptedItem.indexDate,
          GuaranteeState.Valid
        ]
      );


      // {
      //   GuaranteeID: acceptedItem.GRequestID,
      //     GRequestID: acceptedItem.GRequestID,
      //   customer: acceptedItem.customer,
      //   beneficiary: acceptedItem.GRequestID,
      //   bank: acceptedItem.GRequestID,
      //   customerName: this.getOneCustomerData(acceptedItem.customer).Name,
      //   StartDate: acceptedItem.StartDate,
      //   EndDate: acceptedItem.EndDate,
      //   amount: acceptedItem.amount,
      //   fullName: 'ישראל ישראלי',
      //   purpose: acceptedItem.purpose,
      //   indexType: acceptedItem.indexType,
      //   indexDate: acceptedItem.indexDate,
      //   guaranteeState: GuaranteeState.Valid
      // };


        this.mockGuarantees = [...this.mockGuarantees, guarantee];
        resolve(guarantee);

      })
    };



  terminateGuatanty = (guaranteeId, requestId, comment , hashcode) => {
    return new Promise((resolve, reject)=> {

      // find and change state of selected request
    let terminatedRequest = this.mockRequests.find((item) => {
      return item.GRequestID === requestId;
    });
    terminatedRequest.requestState = RequestState.terminationRequest;

    let terminatedGuarantee = this.mockGuarantees.find((item) => {
      return item.GuaranteeID === guaranteeId;
    });
    terminatedGuarantee.guaranteeState = GuaranteeState.Terminated;

      resolve(terminatedGuarantee);
    });
  };

  terminateGuatantyComplite = (guaranteeId, requestId, comment , hashcode) => {
    return new Promise((resolve, reject)=> {

      // find and change state of selected request
      let terminatedRequest = this.mockRequests.find((item) => {
        return item.GRequestID === requestId;
      });
      terminatedRequest.requestState = RequestState.terminationRequest;

      resolve(terminatedRequest);
    });
  };

  guaranteeUpdate = (guatantyId, requestId, comment, amount, date) => {
    return new Promise((resolve, reject)=> {

      // find and change state of selected request
    let unpdatedRequest = this.mockRequests.find((item) => {
      return item.GRequestID === requestId;
    });
    unpdatedRequest.amount = amount;
    unpdatedRequest.EndDate = date;

    let updatedGuarantee = this.mockGuarantees.find((item) => {
      return item.GuaranteeID === guatantyId;
    });
    updatedGuarantee.amount = amount;
    updatedGuarantee.EndDate = date;

      resolve(unpdatedRequest);
    });
  };

  guaranteeUpdateCommit = (guatantyId, requestId, comment, amount, date) => {
    return new Promise((resolve, reject)=> {

      // find and change state of selected request
      let unpdatedRequest = this.mockRequests.find((item) => {
        return item.GRequestID === requestId;
      });
      unpdatedRequest.amount = amount;
      unpdatedRequest.EndDate = date;

      let updatedGuarantee = this.mockGuarantees.find((item) => {
        return item.GuaranteeID === guatantyId;
      });
      updatedGuarantee.amount = amount;
      updatedGuarantee.EndDate = date;

      resolve( updatedGuarantee);
    });
  };

  getGuarantyHistory = (requestId) => {
    return new Promise((resolve) => {
      resolve(mockexpandedRequest[0].log);
    });
  };

  /** ***********************/
  /**  Helper Function   ****/
  /** ***********************/


  populateRequestData=(resultArr)=>  {

    const startDate = this.transformDateSolToJS(resultArr[7]);
    const endDate = this.transformDateSolToJS(resultArr[8]);
    //
    // const startDate = (new Date(resultArr[6] * 1000) ).toDateString();
    // const endDate = (new Date(resultArr[7] * 1000) ).toDateString();
    const proposal= resultArr[5];
    const full_name= resultArr[4];

    var ask= {
      GRequestID: resultArr[0],
      customer: resultArr[1],
      beneficiary: resultArr[2],
      bank: resultArr[3],
      beneficiaryName: this.getBeneficiaryData(resultArr[2]).Name,
      fullName:full_name,
      purpose: proposal,
      amount: resultArr[6].valueOf(),
      StartDate: startDate,
      EndDate: endDate,
      indexType: resultArr[9].valueOf(),
      indexDate: resultArr[10].valueOf(),
      requestState: resultArr[11].valueOf()
    };
    // console.log("request data:", ask);

    return ask;
  };


  populateGuaranteeData=(resultArr) => {

    const startDatet = this.transformDateSolToJS(resultArr[7]);
    const endDatet = this.transformDateSolToJS(resultArr[8]);

    // const startDate = (new Date(resultArr[8].valueOf() * 1000) ).toDateString();
    // const endDate = (new Date(resultArr[9].valueOf() * 1000) ).toDateString();
    const indexDate=resultArr[11].valueOf();
    const proposal= resultArr[6];
    const full_name= resultArr[5];
    const state= resultArr[12].valueOf();
    var ask= {
      GuaranteeID: resultArr[0],
      GRequestID: resultArr[1],
      customer: resultArr[2],
      beneficiary: resultArr[4],
      bank: resultArr[3],
      customerName: full_name,
      StartDate: startDatet,
      EndDate: endDatet,
      amount: resultArr[7].valueOf(),
      fullName:full_name,
      purpose: proposal,
      indexType: resultArr[10].valueOf(),
      indexDate: indexDate.valueOf(),
      guaranteeState: state.valueOf()
    };



    // {
    //   GuaranteeID: acceptedItem.GRequestID,
    //     GRequestID: acceptedItem.GRequestID,
    //   customer: acceptedItem.customer,
    //   beneficiary: acceptedItem.GRequestID,
    //   bank: acceptedItem.GRequestID,
    //   customerName: this.getOneCustomerData(acceptedItem.customer).Name,
    //   StartDate: acceptedItem.StartDate,
    //   EndDate: acceptedItem.EndDate,
    //   amount: acceptedItem.amount,
    //   fullName: 'ישראל ישראלי',
    //   purpose: acceptedItem.purpose,
    //   indexType: acceptedItem.indexType,
    //   indexDate: acceptedItem.indexDate,
    //   guaranteeState: GuaranteeState.Valid
    // };


    console.log("populateGuaranteeData:", ask);

    return ask;
  };




  // populateRequestData = (resultArr) => {
  //     const startDate = this.transformDateSolToJS(resultArr[6]);
  //     const endDate = this.transformDateSolToJS(resultArr[7]);
  //
  //
  //     return {
  //       GRequestID: resultArr[0],
  //       customer: resultArr[1],
  //       beneficiary: resultArr[3],
  //       bank: resultArr[2],
  //       beneficiaryName: this.getBeneficiaryData(resultArr[3]).Name,
  //       purpose: resultArr[4],
  //       amount: resultArr[5].valueOf(),
  //       StartDate: startDate,
  //       EndDate: endDate,
  //       indexType: resultArr[8].valueOf(),
  //       indexDate: resultArr[9].valueOf(),
  //       requestState: resultArr[10].valueOf()
  //     };
  //   };

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

  /** ***********************/
  /**  Watcher Functions ****/
  /** ***********************/

  startCreateListener = (callback) => {
    callback('success!!!!');
    // return GuaranteeRequest.deployed()
    //   .then((instance) => {
    //     watcherSign = instance.GuaranteeRequestCreated({}, {
    //       fromBlock: 0,
    //       toBlock: 'latest'
    //     });
    //
    //
    //     watcherSign.watch(function (error, event) {
    //
    //       if (!error) {
    //         console.log("in watcher sig",event.args);
    //
    //       } else {
    //         console.log("Unable to watch events; see log.",error);
    //
    //       }
    //       //once the event has been detected, take actions as desired
    //       //   var data = 'from: ' + response.args._from+"<br>candidateName: "+web3.toUtf8(response.args._candidateName) +"<br>";
    //       //  assert.equal(response, 1 , "Event number should be 1");
    //
    //     })
    //
    //   }).catch(function (error) {
    //     self.setRegisterStatus("Unable to watch events; see log.",error);
    //
    //   });
  };

  stopCreateListener = () => {
  //   if (watcherSign != null)
  //     watcherSign.stopWatching();
  };

}
