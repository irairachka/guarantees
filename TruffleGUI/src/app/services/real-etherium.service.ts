import { Injectable, isDevMode } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
import {MessageService} from "primeng/components/common/messageservice";
import {
  mockCustomerRequests, mockcustomers, mockCustomerGuaranties, bankData,
  mockBankRequests, mockBankGuaranties, mockbeneficiaries, mockexpandedRequest
} from "../../../tempData/mockData";
import {Beneficiary, Customer, Guarantee} from "../interfaces/request";
import {Observable} from "rxjs/Rx";
import {RequestState} from "../interfaces/enum";

// Import our contract artifacts and turn them into usable abstractions.
const GuaranteeRequest_artifact = require('../../../../build/contracts/GuaranteeRequest.json');
const Regulator_artifact = require('../../../../build/contracts/Regulator.json');
// const DigitalGuaranteeBNHP_artifact = require('../../../build/contracts/DigitalGuaranteeBNHP.json');


@Injectable()
export class TruffleService {
  devMode:boolean = isDevMode();
  web3:any;
  Regulator = contract(Regulator_artifact);
  GuaranteeRequest = contract(GuaranteeRequest_artifact);
  // DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);

  accounts:any;
  account:any;

  constructor(private msgService:MessageService) {
    if (!this.devMode) {
      this.checkAndInstantiateWeb3();
      this.onReady();
    }
  }

  /** ******************** **/
  /**  Setup Functions     **/
  /** ******************** **/

  checkAndInstantiateWeb3 = () => {
    if (typeof this.web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
  };

  onReady = () => {
    this.Regulator.setProvider(this.web3.currentProvider);
    this.GuaranteeRequest.setProvider(this.web3.currentProvider);
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        this.msgService.add({severity: 'warn', summary: 'תקלת תקשורת', detail: 'הייתה בעיה גישה לשרת'});
        return;
      }

      if (accs.length === 0) {
        alert(
          'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
        );
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];

      /** Part of original truffle **/
      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      // this._ngZone.run(() => {
      //   this.getAllUserRequests();
      // });
    });
  };

  /************************/
  /**  Get User Data   ****/
  /************************/

  getCustomerData = (customerAddress) => {
    if (this.devMode) {
      return new Promise((resolve)=> {
        resolve(mockcustomers);
      });
    } else {
      return this.Regulator.deployed()
        .then((instance) => {
          return instance.getCustomer.call(customerAddress, {from: this.account});
        });
    }
  };


  // getOneRequest = (requestAddress) => {
  //   /** Gets one guarantee requests by id */
  //   /** parses the data and sends to UI */
  //   GuaranteeRequest.at(requestAddress)
  //     .then((guaranteeRequestinstance) => {
  //       return guaranteeRequestinstance.getGuaranteeRequestData();
  //     }).then((result) => {
  //     return this.populateRequestData(result);
  //   }).catch((e) => {
  //     console.log(e);
  //   });
  // };


  // getRequestHistory = (requestAddress) => {
  //   if (this.devMode) {
  //     return new Promise((resolve) => {
  //       resolve(mockexpandedRequest[0].log);
  //     });
  //   } else {
  //     // go to blockchain and get real data of events
  //     return GuaranteeRequest.deployed()
  //       .then((instance) => {
  //         return instance.allEvents([{requestId: requestAddress}], {
  //           fromBlock: 0,
  //           toBlock: 'latest'
  //         }).get(function (error, result) {
  //           var requestevents;
  //           for (var i = result.length - 1; i >= 0; i--) {
  //             var cur_result = result[i];
  //             requestevents = [...requestevents, this.listEventsInner(cur_result)];
  //           }
  //
  //           return {
  //             shortrequest: requestAddress,
  //             log: requestevents
  //           };
  //         });
  //       })
  //       .catch(function (error) {
  //         return {
  //           shortrequest: requestAddress,
  //           log: error
  //         };
  //       });
  //   }
  //   ;
  // };


  // function getAllUserRequests() {
  /** Gets all guarantee requests  */


  getAllUserRequests = () => {
    // by user

    return this.getAllRequests();

  };

  getAllRequests = ()=> {
    /** Gets all guarantee requests for customer */
    if (this.devMode) {
      return new Promise((resolve)=> {
        resolve(mockCustomerRequests);
      });
    } else {
      var customerGuarantyRequests;
    //   return Regulator.deployed()
    //     .then((instance) => {
    //       return instance.getRequestAddressList.call({from: this.account});
    //     }).then(function (guaranteeRequestAddresses) {
    //       console.log("guaranteeRequestAddresses[]:", guaranteeRequestAddresses);
    //       guaranteeRequestAddresses.forEach((guaranteeRequestAddress) => {
    //         // console.log("guaranteeAddress",guaranteeRequestAddress);
    //         customerGuarantyRequests = [...customerGuarantyRequests, this.getOneRequest(guaranteeRequestAddress)];
    //       });
    //       return customerGuarantyRequests;
    //     }).catch(function (error) {
    //       console.error(error);
    //       return error;
    //     });
    }
  };

  getAllCustomerGuaranties = () => {

    return this.getAllGuaranties();

  };


  getAllGuaranties = () => {
    if (this.devMode) {
      return new Promise((resolve) => {
        resolve(mockCustomerGuaranties);
      });
    }
    else {
      var customerGuaranties;
      this.Regulator.deployed().then((instance) => {
        return instance.getGuaranteeAddressesList.call({from: this.account});
      })
        .then((guaranteeAddresses) => {
          console.log('guaranteeAddresses', guaranteeAddresses);
          if (guaranteeAddresses.length > 0) {
            guaranteeAddresses.forEach((guaranteeAddress) => {
              customerGuaranties = [...customerGuaranties, this.getOneGuaranty(guaranteeAddress)];
            });
          }
        }).catch((e) => {
        console.log(e);
      });
    }
  };


  /** ****************** **/
  /**  Get Bank Data     **/
  /** ****************** **/

  getBankData = (requestAddress) => {
    if (this.devMode) {
      return new Promise((resolve) => {
        resolve(bankData);
      });
    } else {
      this.Regulator.deployed()
        .then((instance) => {
          return instance.getIssuer.call(requestAddress, {from: this.account});
        });
    }
  };

  getAllBankRequests = () => {
    /** Gets all guarantee requests for customer */
    /** parses the data and sends to UI */
    if (this.devMode) {
      return new Promise((resolve) => {
        resolve(mockBankRequests);
      });
    } else {
      this.Regulator.deployed().then((instance) => {
        return instance.getRequestsAddressForIssuer.call({from: this.account});
      }).then((guaranteeRequestAddresses) => {
        console.log(guaranteeRequestAddresses);
        guaranteeRequestAddresses.forEach((requestAddress) => {
          // this.bankRequests = [...this.bankRequests, this.getOneGRequests(requestAddress)];
        });
      }).catch((e) => {
        console.log(e);
      });
    }
  };

  getAllBankGuaranties = () => {
    if (this.devMode) {
      return new Promise((resolve) => {
        resolve(mockBankGuaranties);
      });
    } else {
      this.Regulator
        .deployed()
        .then((instance) => {
          return instance.getGuarantieAddressForIssuer.call({from: this.account});
        }).then((guaranteeAddresses) => {
        console.log('guaranteeAddresses', guaranteeAddresses);
        if (guaranteeAddresses.length > 0) {
          guaranteeAddresses.forEach((guaranteeAddress) => {
            // this.bankGuaranties = [...this.bankGuaranties, this.getOneGuaranty(guaranteeAddress)];
          });
        }
      }).catch((e) => {
        console.log(e);
      });
    }
  };

  /** ************************* **/
  /**  Get Beneficiary Data     **/
  /** ************************* **/

  getAllBeneficiaries = () => {
    if (this.devMode) {
      return new Promise((resolve) => {
        resolve(mockbeneficiaries);
      });
    } else {
      var beneficiaries;
      this.Regulator.deployed().then((instance) => {
        return instance.getBeneficiaryAddresses.call({from: this.account});
      }).then((beneficiaryAddresses) => {
        beneficiaryAddresses.forEach((beneficiaryAddress) => {
          beneficiaries = [...beneficiaries, this.getOneBeneficiary(beneficiaryAddress)];
        });
      }).catch((e) => {
        console.log(e);
      });
    }
  };

  getOneBeneficiary = (beneficiaryAddress):Beneficiary => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    console.log('beneficiaryAddress', beneficiaryAddress);
    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getBeneficiary.call(beneficiaryAddress, {from: this.account});
      }).then((result) => {
      return this.populateBeneficiaryData(beneficiaryAddress, result);
    }).catch((e) => {
      console.log(e);
    });
    return;
  };

  getAllBeneficiaryGuaranties = (beneficiarAddress) => {
    if (this.devMode) {
      return new Promise((resolve) => {
        resolve(mockbeneficiaries);
      });
    } else {
      // this.Regulator.deployed().then((instance) => {
      //   return instance.getBeneficiaryAddresses.call({from: this.account});
      // }).then((beneficiarAddresses) => {
      //   console.log('guaranteeAddresses', guaranteeAddresses);
      //   if (beneficiarAddresses.length > 0) {
      //     beneficiarAddresses.forEach((beneficiarAddress) => {
      //       // this.beneficiaryGuaranties = [...this.beneficiaryGuaranties, this.getOneGuaranty(beneficiarAddress)];
      //     });
      //   }
      // }).catch((e) => {
      //   console.log(e);
      // });
    }
  };

  getOneGuaranty = (guarantyAddress):Guarantee => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    console.log('guarantyAddress', guarantyAddress);
    // this.DigitalGuaranteeBNHP.at(guarantyAddress)
    //   .then((guaranteeinstance) => {
    //     return guaranteeinstance.getGuaranteeData();
    //   }).then((result) => {
    //   return this.populateGuarantyData(result);
    // }).catch((e) => {
    //   console.log(e);
    // });
    return;
  };

  // getBeneficiaryData= (beneAddress): Beneficiary => {
  //   for (var i in this.beneficiaries) {
  //     if (this.beneficiaries[i].beneficiaryID==beneAddress) {
  //       return this.beneficiaries[i];
  //     }
  //   }
  //   return this.beneficiaries[0];
  // };


  /** ***********************/
  /**  Helper Function   ****/
  /** ***********************/

  // populateGuarantyData = (resultArr) => {
  //   const startDate = this.transformDateSolToJS(resultArr[7]);
  //   const endDate = this.transformDateSolToJS(resultArr[8]);
  //   {
  //     return {
  //       GuaranteeID: resultArr[0],
  //       customer: resultArr[2],
  //       beneficiary: resultArr[4],
  //       bank: resultArr[3],
  //       customerName: this.getOneCustomerData(resultArr[2]).Name,
  //       purpose: resultArr[5],
  //       amount: resultArr[6].valueOf(),
  //       StartDate: startDate,
  //       EndDate: endDate,
  //       indexType: resultArr[9].valueOf(),
  //       indexDate: resultArr[10].valueOf(),
  //       GuaranteeState: resultArr[11].valueOf()
  //     };
  //   }
  //
  // };


    // populateRequestData = (resultArr) => {
    //
    //   const startDate = this.transformDateSolToJS(resultArr[6]);
    //   const endDate = this.transformDateSolToJS(resultArr[7]);
    //
    //
    //   return {
    //     GRequestID: resultArr[0],
    //     customer: resultArr[1],
    //     beneficiary: resultArr[3],
    //     bank: resultArr[2],
    //     beneficiaryName: this.getBeneficiaryData(resultArr[3]).Name,
    //     purpose: resultArr[4],
    //     amount: resultArr[5].valueOf(),
    //     StartDate: startDate,
    //     EndDate: endDate,
    //     indexType: resultArr[8].valueOf(),
    //     indexDate: resultArr[9].valueOf(),
    //     requestState: resultArr[10].valueOf()
    //   };
    // };

    // listEventsInner = (result) => {
    //
    //   const theDate = this.transformDateSolToJS(result.args.timestamp);
    //   var theState = RequestState.waitingtobank;
    //   var comments = null;
    //
    //   if (result.event == "Accepted") theState = RequestState.accepted;
    //   if (result.args.commentline != null) comments = result.args.commentline;
    //
    //
    //   return {
    //     date: theDate,
    //     state: theState,
    //     comment: comments
    //   }
    // };

    populateBeneficiaryData = (beneAddress, resultArr) => {
      return {
        beneficiaryID: beneAddress,
        Name: resultArr[0],
        Address: resultArr[1],
      };
    };


    // getOneCustomerData = (customerAddress): Customer => {
    //   for (var i in this.customers) {
    //     if (this.customers[i].customerID==customerAddress) {
    //       return this.customers[i];
    //     }
    //   }
    //   return this.customers[0];
    // };


    getGuarantyHistory = (requestId) => {
      if (this.devMode) {
        return new Promise((resolve) => {
          resolve(mockexpandedRequest[0].log);
        });
      } else {
        // go to blockchain and get real data
      }
    };

}
