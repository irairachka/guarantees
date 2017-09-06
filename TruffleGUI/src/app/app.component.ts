import { Component, HostListener, NgZone } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');


// Import our contract artifacts and turn them into usable abstractions.
const GuaranteeRequest_artifact = require('../../../build/contracts/GuaranteeRequest.json');
const Regulator_artifact = require('../../../build/contracts/Regulator.json');
const DigitalGuaranteeBNHP_artifact = require('../../../build/contracts/DigitalGuaranteeBNHP.json');
// MetaCoin is our usable abstraction, which we'll use through the code below.



// const metaincoinArtifacts = require('../../build/contracts/MetaCoin.json');

// Import libraries we need.
// import { default as Web3} from 'web3';
// import { default as contract } from 'truffle-contract';



const http=require('http');
// const web3providera=new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));



import { canBeNumber } from '../util/validation';

import {allRequests, allRequests as Requests} from '../../tempData/data';
import {GRequest, Guarantee} from "./interfaces/request";
import {isNullOrUndefined} from "util";

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // MetaCoin: any;
  Regulator = contract(Regulator_artifact);
  GuaranteeRequest = contract(GuaranteeRequest_artifact);
  DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);

  // TODO add proper types these variables
  account: any;
  accounts: any;
  web3: any;

  temp: boolean = false;

  balance: number;
  myRequests: GRequest[] = [];
  myGuaranties: Guarantee[] = [];
  data: any; // Dialog data
  openFormDialog: boolean = false; // show dialog
  modalType: string = 'user'; // dialog types
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;

  constructor(private _ngZone: NgZone) {

  }

  @HostListener('window:load')
  windowLoaded() {
    /** setup web3 connection and get accounts **/
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.warn(
        'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        'No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
    }
  };

  onReady = () => {
    this.Regulator.setProvider(this.web3.currentProvider);
    this.GuaranteeRequest.setProvider(this.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
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

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() => {
        this.getAllGRequests();
        this.getAllGuarantees();
      });
    });
  };

  getAllGuarantees = () => {
    console.log('getting guarantees');
    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getGuarantieAddressForBeneficiary.call({from: this.account});
      }).then((guaranteeAddresses) => {
        console.log('guaranteeAddresses', guaranteeAddresses);
        if(guaranteeAddresses.length > 0) {
          guaranteeAddresses.forEach((guaranteeAddress) => {
            this.getOneGuaranty(guaranteeAddress);
          });
        }
      }).catch((e) => {
        console.log(e);
      });
  };




  getAllGRequests = () => {
    /** Gets all guarantee requests for customer */
    /** parses the data and sends to UI */

    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getRequestsAddressForCustomer.call({from: this.account});
      }).then((guaranteeRequestAddresses) => {
        console.log(guaranteeRequestAddresses);
        guaranteeRequestAddresses.forEach((requestAddress) => {
          this.getOneGRequests(requestAddress);
          });
        }).catch((e) => {
          console.log(e);
      });
  };

  getOneGRequests = (requestAddress) => {
  /** Gets one guarantee requests by id */
  /** parses the data and sends to UI */
  console.log('requestAddress', requestAddress)
  this.GuaranteeRequest.at(requestAddress)
    .then((guaranteeRequestinstance) => {
      return guaranteeRequestinstance.getGuaranteeRequestData();
    }).then((result) => {
    let parsedResult = this.populateRequestData(result);
    this.myRequests = [...this.myRequests, parsedResult];
    }).catch((e) => {
      console.log(e);
    });
  };

  getOwnerAddress= (requestAddress) => {
    return this.account;
  }

  getCustomerData = (requestAddress) => {

    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getCustomer.call(requestAddress,{from: this.account});
      }).then((customer) => {
      console.log(customer);
      return {
        customerID: requestAddress,
        Name: resultArr[0],
        Address: resultArr[1]
      };
    }).catch((e) => {
      console.log(e);
    });
  };

  getBankData = (requestAddress) => {

    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getIssuer.call(requestAddress,{from: this.account});
      }).then((issuer) => {
      console.log(customer);
      return {
        customerID: requestAddress,
        Name: resultArr[0],
        Address: resultArr[1]
      };
    }).catch((e) => {
      console.log(e);
    });
  };

  getBeneficiaries = () => {

    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getBeneficiaries.call({from: this.account});
      }).then((beneficiaryAddress) => {
      console.log(beneficiaryAddress);
      return beneficiaryAddress;
    }).catch((e) => {
      console.log(e);
    });
  };



  getOneGuaranty = (guarantyAddress) => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    console.log('guarantyAddress', guarantyAddress);
    this.DigitalGuaranteeBNHP.at(guarantyAddress)
      .then((guaranteeinstance) => {
        return guaranteeinstance.getGuaranteeData();
      }).then((result) => {
      let parsedResult = this.populateGuarantyData(result);
      console.log('parsedResult', parsedResult);
      // this.myGuaranties = [...this.myGuaranties, parsedResult];
    }).catch((e) => {
      console.log(e);
    });
  };



  getGRequestData = (GRequestId, type: number) => {
    //type = user, bank or beneficiary
  };

  getGuaranteesData = (GRequestId, type: number) => {
    //type = user, bank or beneficiary
  };

  withdrawalRequest = (requestId) => {
    // ביטול של יוזר
  };

  rejectRequest = (requestId) => {
    // ביטול של בנק
  };

  terminateRequest = (requestId) => {
    // ביטול של מוטב
  };

  guaranteeUpdateRequest = () => {

  };

  acceptRequest = (requestId) => {
    // אישור של בנק
  };

  setStatus = message => {
    this.status = message;
  };

  createRequest = ( userId , bankId, benefId , purpose,
                    amount, StartDate, EndDate, indexType, indexDate) => {
    console.log("begin");
    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.createGuaranteeRequest.call(userId, bankId, benefId, purpose, amount, StartDate, EndDate, indexType, indexDate,
          { from: this.account, gas: 6000000});
      }).then((guaranteeRequestAddress) => {
        console.log(guaranteeRequestAddress);
        this.onNewRequestSuccess(guaranteeRequestAddress);
    }).catch((e) => {
      console.log(e);
      // this.setRegisterStatus("Unable to refresh balance; see log.", e);
    });
  };

  /** Handle form modal */
  openModal(e) {
    this.temp = true;
    console.log('e', e);
    this.modalType = e.user;
    if(!isNullOrUndefined(e.request)) {
      this.data = e.request
    }
    this.openFormDialog = true;
console.log('this.openFormDialog', this.openFormDialog);
  }

  clearData() {
    this.data = null;
  }

  handleCreateRequest = (e) => {
    console.log('e', e);
    this.createRequest('0xd532D3531958448e9E179729421B92962fb81Ddc',
      '0xd532D3531958448e9E179729421B92962fb81Ddc', '0xd532D3531958448e9E179729421B92962fb81Ddc',
      e.purpose, e.amount, (Date.now()/1000), (Date.now()/1000)+100000, 0, 0);
  };

  populateRequestData = (resultArr) => {
    const startDate = this.transformDateSolToJS(resultArr[6]);
    const endDate = this.transformDateSolToJS(resultArr[7]);

    return {
      GRequestID: resultArr[0],
      customer: resultArr[1],
      beneficiary: resultArr[2],
      bank: resultArr[3],
      purpose: resultArr[4],
      amount: resultArr[5].valueOf(),
      StartDate: startDate,
      EndDate: endDate,
      indexType: resultArr[8].valueOf(),
      indexDate: resultArr[9].valueOf(),
      RequestState: resultArr[10].valueOf()
    };
  }

  populateGuarantyData= (resultArr) => {
    const startDate = this.transformDateSolToJS(resultArr[6]);
    const endDate = this.transformDateSolToJS(resultArr[7]);

    return {
      GuaranteeID: resultArr[0],
      customer: resultArr[1],
      beneficiary: resultArr[2],
      bank: resultArr[3],
      purpose: resultArr[4],
      amount: resultArr[5].valueOf(),
      StartDate: startDate,
      EndDate: endDate,
      indexType: resultArr[8].valueOf(),
      indexDate: resultArr[9].valueOf(),
      GuarantyState: resultArr[10].valueOf()
    };
  };

  transformDateSolToJS = (longDate) => {
    const date = new Date(longDate * 1000);
    return date.toLocaleDateString('en-GB');
  }

  onNewRequestSuccess = (requestAddress) => {
    // toaster = success;
    // close modal
    this.getOneGRequests(requestAddress);
  }
}
