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
import {_catch} from "rxjs/operator/catch";

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

  getRequestHistory = (requestAddress):any => {
    console.log("getRequestHistory",requestAddress);

    return new Promise((resolve) => {
      var history;
      try{
        history=mockexpandedRequest[mockexpandedRequest.findIndex(item => {
          return item.shortrequest.GRequestID === requestAddress
        })].log
      }
      catch(error)
      {
        history= [
        {
          eventname:'Not_Find',
          date: '01/01/1970',
          state: RequestState.created,
          comment: "hustory not exist in mock data!"
        }
      ];
      }
      resolve(
        history
        );
    });
  };

  getAllUserRequests = () => {
    return this.getAllRequests();
  };

  getAllRequests = ()=> {
    /** Gets all guarantee requests for customer */
    return new Promise((resolve)=> {
      resolve(this.mockRequests);
    });
  };

  getAllCustomerGuaranties = () => {
    return this.getAllGuaranties();
  };


  getAllGuaranties = (customerAddress=this.account) => {
    return new Promise((resolve) => {
      resolve(this.mockGuarantees);
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
      this.populateRequestDataP(
        ['' + this.idmoc,
          userId,
          bankId,
          benefId,
          '',
          purpose,
          amount,
          this.transformDateJSToSol(StartDate),
          this.transformDateJSToSol(EndDate),
          // StartDate,
          // EndDate,
          indexType,
          indexDate,
          RequestState.waitingtobank,
          false,
          ''
        ]
      ).then((newItem)=>{
        this.mockRequests = [...this.mockRequests, newItem];
        resolve(newItem);
      });

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

  updateRequest = (requestId, comment):any => {
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

  acceptRequest = (requestId, comment , hashcode):any => {
    // אישור של בנק
    // if  (hashcode) {
    return new Promise((resolve, reject)=> {

      // find and change state of selected request
    let acceptedItem = this.mockRequests.find((item) => {
      return item.GRequestID === requestId;
    });
    acceptedItem.requestState = RequestState.accepted;


    if (acceptedItem.ischangeRequest)
    {
      let terminatedGuarantee = this.mockGuarantees.find((item) => {
        return item.GRequestID === acceptedItem.changeRequest;
      });
      terminatedGuarantee.guaranteeState = GuaranteeState.Terminated;

      // console.log('acceptRequest',acceptedItem.ischangeRequest,terminatedGuarantee,acceptedItem);
      resolve({
        terminatedguarantee: terminatedGuarantee,
        request: acceptedItem
      });
    }
      else
    {
      // console.log('acceptRequest',acceptedItem.ischangeRequest,null,acceptedItem);

      resolve({
        terminatedguarantee: null,
        request: acceptedItem
      });
    }

    });

  };

  guaranteeSignComplite = (requestId, comment , hashcode):any => {
    return new Promise((resolve, reject)=> {


        // find and change state of selected request
        let acceptedItem = this.mockRequests.find((item) => {
          return item.GRequestID === requestId;
        });

        this.getOneCustomerDataP(acceptedItem.customer)
          .then((customer)=>{
            let guarantee =  this.populateGuaranteeDataP(
              [acceptedItem.GRequestID,
                acceptedItem.GRequestID,
                acceptedItem.GRequestID,
                acceptedItem.GRequestID,
                acceptedItem.GRequestID,
                customer.Name,
                acceptedItem.purpose,
                acceptedItem.amount,
                this.transformDateJSToSol(acceptedItem.StartDate),
                this.transformDateJSToSol(acceptedItem.EndDate),
                acceptedItem.indexType,
                acceptedItem.indexDate,
                GuaranteeState.Valid
              ]
            ).then((guarantee)=>{
              this.mockGuarantees = [...this.mockGuarantees, guarantee];
              resolve(guarantee);
            });

          });
        // generate new guarantee


      })
    };



  terminateGuatanty = (guaranteeId, requestId, comment , hashcode,customerAddress=this.account):any => {
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
    this.msgService.add({severity: 'success', summary: 'ביטול ערבות', detail: 'בקשה לביטול הערבות  נשלחה בהצלחה'});

      resolve({
        guarantee: terminatedGuarantee,
        request: terminatedRequest
      });
    });
  };

  guaranteeUpdate = (guatantyId, requestId, comment, amount, date ,customerAddress=this.account):any => {

    return new Promise((resolve, reject)=> {

      this.idmoc = this.idmoc + 1;
      // find and change state of selected request
      let unpdatedRequest = this.mockRequests.find((item) => {
        return item.GRequestID === requestId;
      });

      // console.log('guaranteeUpdate',unpdatedRequest.StartDate,date , requestId);
      if (date ==='undefined' || date =='')
        date=unpdatedRequest.EndDate;
      // make new request
      this.populateRequestDataP(
        [ '' + this.idmoc,
          unpdatedRequest.userId,
          unpdatedRequest.bankId,
          unpdatedRequest.benefId,
          '',
          unpdatedRequest.purpose,
          amount,
          this.transformDateJSToSol(unpdatedRequest.StartDate),
          this.transformDateJSToSol(date),
          unpdatedRequest.indexType,
          unpdatedRequest.indexDate,
          RequestState.waitingtobank,
          true,
          requestId
        ]
      ).then((newItem)=>{
        this.mockRequests = [...this.mockRequests, newItem];
        this.msgService.add({severity: 'success', summary: 'שינוי ערבות', detail: 'בקשה לשינוי הערבות  נשלחה בהצלחה'});

        resolve(newItem);
      });




    //
    // let updatedGuarantee = this.mockGuarantees.find((item) => {
    //   return item.GuaranteeID === guatantyId;
    // });
    // updatedGuarantee.amount = amount;
    // updatedGuarantee.EndDate = date;
    //
    //   resolve({
    //     request: newItem
    //   });
    });
  };

  // guaranteeUpdateCommit = (guatantyId, requestId, comment, amount, date) => {
  //   return new Promise((resolve, reject)=> {
  //
  //     // find and change state of selected request
  //     let unpdatedRequest = this.mockRequests.find((item) => {
  //       return item.GRequestID === requestId;
  //     });
  //     unpdatedRequest.amount = amount;
  //     unpdatedRequest.EndDate = date;
  //
  //     let updatedGuarantee = this.mockGuarantees.find((item) => {
  //       return item.GuaranteeID === guatantyId;
  //     });
  //     updatedGuarantee.amount = amount;
  //     updatedGuarantee.EndDate = date;
  //
  //     resolve( updatedGuarantee);
  //   });
  // };

  getGuarantyHistory = (requestId):any => {
    return new Promise((resolve) => {
      resolve(mockexpandedRequest[0].log);
    });
  };

  /** ***********************/
  /**  Helper Function   ****/
  /** ***********************/


  populateRequestDataP=(resultArr)=>  {

    return new Promise((resolve, reject)=> {

      const startDate = this.transformDateSolToJS(resultArr[7]);
    const endDate = this.transformDateSolToJS(resultArr[8]);
    //
    // const startDate = (new Date(resultArr[6] * 1000) ).toDateString();
    // const endDate = (new Date(resultArr[7] * 1000) ).toDateString();
    const proposal= resultArr[5];
    const full_name= resultArr[4];
    const changeRequestId=(resultArr[13] !== undefined ? resultArr[13] : '') ;

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
      requestState: resultArr[11].valueOf(),
      ischangeRequest: (resultArr[12] == 'true'  || resultArr[12]==true) ,
      changeRequest:changeRequestId

    };
    // console.log("request data:", ask);

      resolve(ask);
    });
  };


  populateGuaranteeDataP=(resultArr) => {
    return new Promise((resolve, reject)=> {


      const startDatet = this.transformDateSolToJS(resultArr[7]);
      const endDatet = this.transformDateSolToJS(resultArr[8]);

      // const startDate = (new Date(resultArr[8].valueOf() * 1000) ).toDateString();
      // const endDate = (new Date(resultArr[9].valueOf() * 1000) ).toDateString();
      const indexDate = resultArr[11].valueOf();
      const proposal = resultArr[6];
      const full_name = resultArr[5];
      const state = resultArr[12].valueOf();
      var ask = {
        GuaranteeID: resultArr[0],
        GRequestID: resultArr[1],
        customer: resultArr[2],
        beneficiary: resultArr[4],
        bank: resultArr[3],
        customerName: full_name,
        StartDate: startDatet,
        EndDate: endDatet,
        amount: resultArr[7].valueOf(),
        fullName: full_name,
        purpose: proposal,
        indexType: resultArr[10].valueOf(),
        indexDate: indexDate.valueOf(),
        guaranteeState: state.valueOf()
      };


      console.log("populateGuaranteeData:", ask);

      resolve(ask);
    });
  };




  transformDateSolToJS = (longDate) => {
    const date = new Date(longDate * 1000);
    return date.toLocaleDateString('en-GB');
  };

  transformDateJSToSol = (caldate) => {
    var soltime = Date.parse(caldate)/1000;
    if (isNaN(soltime) )
    {
      var thDate=caldate.split("/");
      if (thDate.length<3)
        thDate=caldate.split("-");
      var newDate=thDate[1]+"/"+thDate[0]+"/"+thDate[2];
      soltime = (new Date(newDate).getTime()/1000);

    }

    console.log('transformDateJSToSol',caldate,Date.parse(caldate),caldate.split("/"),caldate.split("-"),soltime);

    return Math.floor(soltime);

  };

  
  getOneCustomerDataP = (customerAddress):any => {
    return new Promise((resolve)=> {
      for (var i in mockcustomers) {
        if (mockcustomers[i].customerID == customerAddress) {
          resolve(mockcustomers[i]);
        }
      }

      resolve(mockcustomers[0]);


      });

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
