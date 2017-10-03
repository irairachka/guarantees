import { Injectable, isDevMode } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
import {MessageService} from "primeng/components/common/messageservice";
import {
  mockCustomerRequests, mockcustomers, mockCustomerGuaranties, bankData,
  mockBankRequests, mockBankGuaranties, mockbeneficiaries
} from "../../../tempData/mockData";
import {Customer} from "../interfaces/request";
import {Observable} from "rxjs/Rx";

// Import our contract artifacts and turn them into usable abstractions.
const GuaranteeRequest_artifact = require('../../../../build/contracts/GuaranteeRequest.json');
const Regulator_artifact = require('../../../../build/contracts/Regulator.json');
// const DigitalGuaranteeBNHP_artifact = require('../../../build/contracts/DigitalGuaranteeBNHP.json');


@Injectable()
export class TruffleService {
  devMode: boolean = isDevMode();
  web3: any;
  Regulator = contract(Regulator_artifact);
  GuaranteeRequest = contract(GuaranteeRequest_artifact);
  // DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);

  accounts: any;
  account: any;

  constructor(private msgService: MessageService) {
    if(!this.devMode) {
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
            this.msgService.add({severity: 'warn', summary:'תקלת תקשורת', detail:'הייתה בעיה גישה לשרת'});
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
    if(this.devMode) {
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

  getAllUserRequests() {
    /** Gets all guarantee requests for customer */
    if(this.devMode) {
      return Observable.of(mockCustomerRequests);
    } else {
      return this.Regulator.deployed()
        .then((instance) => {
          return instance.getRequestAddresses.call({from: this.account});
      });
    }
  }

  getAllCustomerGuaranties = () => {
    if(this.devMode) {
      return new Promise((resolve)=> {
        resolve(mockCustomerGuaranties);
      });
    } else {
      this.Regulator
        .deployed().then((instance) => {
          return instance.getGuarantieAddressForCustomer.call({from: this.account});
        }).then((guaranteeAddresses) => {
        console.log('guaranteeAddresses', guaranteeAddresses);
        if (guaranteeAddresses.length > 0) {
          guaranteeAddresses.forEach((guaranteeAddress) => {
            // this.customerGuaranties = [...this.customerGuaranties, this.getOneGuaranty(guaranteeAddress)];
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
    if(this.devMode) {
      return new Promise((resolve) => {
        resolve(bankData);
      });
    } else {
      this.Regulator.deployed()
        .then((instance) => {
          return instance.getIssuer.call(requestAddress,{from: this.account});});
    }
  };

  getAllBankRequests = () => {
      /** Gets all guarantee requests for customer */
      /** parses the data and sends to UI */
    if(this.devMode) {
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
    if(this.devMode) {
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
    if(this.devMode) {
      return new Promise((resolve) => {
        resolve(mockbeneficiaries);
      });
    } else {
      this.Regulator.deployed().then((instance) => {
          return instance.getBeneficiaryAddresses.call({from: this.account});
        }).then((beneficiaryAddress) => {
        beneficiaryAddress.forEach((beneficiaryAddres) => {
          // this.beneficiaries = [...this.beneficiaries, this.getOneBeneficiary(beneficiaryAddres)];
        });
      }).catch((e) => {
        console.log(e);
      });
    }
  };

  getAllBeneficiaryGuaranties = () => {
    if(this.devMode) {
      return new Promise((resolve) => {
        resolve(mockbeneficiaries);
      });
    } else {
      this.Regulator.deployed().then((instance) => {
        return instance.getGuarantieAddressForBeneficiary.call({from: this.account});
      }).then((guaranteeAddresses) => {
        console.log('guaranteeAddresses', guaranteeAddresses);
        if (guaranteeAddresses.length > 0) {
          guaranteeAddresses.forEach((guaranteeAddress) => {
            // this.beneficiaryGuaranties = [...this.beneficiaryGuaranties, this.getOneGuaranty(guaranteeAddress)];
          });
        }
      }).catch((e) => {
        console.log(e);
      });
    }
  };

  // getOneBeneficiary = (beneficiaryAddress): Beneficiary => {
  //   /** Gets one guarantee requests by id */
  //   /** parses the data and sends to UI */
  //   console.log('beneficiaryAddress', beneficiaryAddress);
  //   this.Regulator
  //     .deployed()
  //     .then((instance) => {
  //       return instance.getBeneficiaries.call({from: this.account});
  //     }).then((result) => {
  //     return this.populateBeneficiaryData(beneficiaryAddress,result);
  //   }).catch((e) => {
  //     console.log(e);
  //   });
  //   return;
  // };

  // populateBeneficiaryData= (beneAddress,resultArr) => {
  //   return {
  //     beneficiaryID: beneAddress,
  //     Name: resultArr[0],
  //     Address: resultArr[1],
  //   };
  // };

  /** ***********************/
  /**  Helper Function   ****/
  /** ***********************/

  // getOneGRequests = (requestAddress): GRequest => {
  //   /** Gets one guarantee requests by id */
  //   /** parses the data and sends to UI */
  //   this.GuaranteeRequest.at(requestAddress)
  //     .then((guaranteeRequestinstance) => {
  //       return guaranteeRequestinstance.getGuaranteeRequestData();
  //     }).then((result) => {
  //     return this.populateRequestData(result);
  //   }).catch((e) => {
  //     console.log(e);
  //   });
  //   return;
  // };

  // populateRequestData = (resultArr): GRequest => {
  //   const startDate = this.transformDateSolToJS(resultArr[6]);
  //   const endDate = this.transformDateSolToJS(resultArr[7]);
  //
  //   return {
  //     GRequestID: resultArr[0],
  //     customer: resultArr[1],
  //     beneficiary: resultArr[2],
  //     bank: resultArr[3],
  //     beneficiaryName: this.getBeneficiaryData(resultArr[2]).Name,
  //     purpose: resultArr[4],
  //     amount: resultArr[5].valueOf(),
  //     StartDate: startDate,
  //     EndDate: endDate,
  //     indexType: resultArr[8].valueOf(),
  //     indexDate: resultArr[9].valueOf(),
  //     requestState: resultArr[10].valueOf()
  //   };
  // };

  // getBeneficiaryData= (beneAddress): Beneficiary => {
  //   for (var i in this.beneficiaries) {
  //     if (this.beneficiaries[i].beneficiaryID==beneAddress) {
  //       return this.beneficiaries[i];
  //     }
  //   }
  //   return this.beneficiaries[0];
  // };

  // getOneGuaranty = (guarantyAddress): Guarantee  => {
  //   /** Gets one guarantee requests by id */
  //   /** parses the data and sends to UI */
  //   console.log('guarantyAddress', guarantyAddress);
  //   this.DigitalGuaranteeBNHP.at(guarantyAddress)
  //     .then((guaranteeinstance) => {
  //       return guaranteeinstance.getGuaranteeData();
  //     }).then((result) => {
  //     return this.populateGuarantyData(result);
  //   }).catch((e) => {
  //     console.log(e);
  //   });
  //   return;
  // };

  // populateGuarantyData= (resultArr) => {
  //   const startDate = this.transformDateSolToJS(resultArr[6]);
  //   const endDate = this.transformDateSolToJS(resultArr[7]);
  //
  //   return {
  //     GuaranteeID: resultArr[0],
  //     customer: resultArr[1],
  //     beneficiary: resultArr[2],
  //     bank: resultArr[3],
  //     customerName: this.getOneCustomerData(resultArr[2]).Name,
  //     purpose: resultArr[4],
  //     amount: resultArr[5].valueOf(),
  //     StartDate: startDate,
  //     EndDate: endDate,
  //     indexType: resultArr[8].valueOf(),
  //     indexDate: resultArr[9].valueOf(),
  //     GuaranteeState: resultArr[10].valueOf()
  //   };
  // };

  // getOneCustomerData = (customerAddress): Customer => {
  //   for (var i in this.customers) {
  //     if (this.customers[i].customerID==customerAddress) {
  //       return this.customers[i];
  //     }
  //   }
  //   return this.customers[0];
  // };
}
