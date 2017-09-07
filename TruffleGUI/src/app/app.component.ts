// Dependancies for Truffle
import { Component, HostListener, NgZone } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');

// Import our contract artifacts and turn them into usable abstractions.
const GuaranteeRequest_artifact = require('../../../build/contracts/GuaranteeRequest.json');
const Regulator_artifact = require('../../../build/contracts/Regulator.json');
const DigitalGuaranteeBNHP_artifact = require('../../../build/contracts/DigitalGuaranteeBNHP.json');

// Interfaces, mock data and utils
import { userData, bankData, } from '../../tempData/mockData';
import {GRequest, Guarantee, Beneficiary} from "./interfaces/request";
import {isNullOrUndefined} from "util";
import {GuaranteeState, RequestState} from "./interfaces/enum";

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Regulator = contract(Regulator_artifact);
  GuaranteeRequest = contract(GuaranteeRequest_artifact);
  DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);

  account: any;
  accounts: any;
  web3: any;

  // Requests and Guarantees
  customerRequests: GRequest[] = [];
  customerGuaranties: Guarantee[] = [];
  bankRequests: GRequest[] = [];
  bankGuaranties: Guarantee[] = [];
  beneficiaryGuaranties: Guarantee[] = [];

  // User type data
  beneficiaries: Beneficiary[] =[];

  // Dialog data
  dialogData: any;
  openFormDialog: boolean = false; // show dialog
  modalType: string = 'user'; // dialog types

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
        // TODO - add get all data functions
      });
    });
  };

  getAllUserRequests = () => {
    /** Gets all guarantee requests for customer */
    /** parses the data and sends to UI */

    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getRequestsAddressForCustomer.call({from: this.account});
      }).then((guaranteeRequestAddresses) => {
      console.log(guaranteeRequestAddresses);
      guaranteeRequestAddresses.forEach((requestAddress) => {
        this.customerRequests = [...this.customerRequests, this.getOneGRequests(requestAddress)];

      });
    }).catch((e) => {
      console.log(e);
    });
  };


  getOneGRequests = (requestAddress): GRequest => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    this.GuaranteeRequest.at(requestAddress)
      .then((guaranteeRequestinstance) => {
        return guaranteeRequestinstance.getGuaranteeRequestData();
      }).then((result) => {
      return this.populateRequestData(result);
    }).catch((e) => {
      console.log(e);
    });
    return;
  };



  getAllBankRequests = () => {
    /** Gets all guarantee requests for customer */
    /** parses the data and sends to UI */

    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getRequestsAddressForIssuer.call({from: this.account});
      }).then((guaranteeRequestAddresses) => {
      console.log(guaranteeRequestAddresses);
      guaranteeRequestAddresses.forEach((requestAddress) => {
        this.bankRequests = [...this.bankRequests, this.getOneGRequests(requestAddress)];
      });
    }).catch((e) => {
      console.log(e);
    });
  };

  getAllBeneficiaryGuaranties = () => {
    console.log('getting guarantees');
    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getGuarantieAddressForBeneficiary.call({from: this.account});
      }).then((guaranteeAddresses) => {
      console.log('guaranteeAddresses', guaranteeAddresses);
      if(guaranteeAddresses.length > 0) {
        guaranteeAddresses.forEach((guaranteeAddress) => {
          this.beneficiaryGuaranties = [...this.beneficiaryGuaranties, this.getOneGuaranty(guaranteeAddress)];
        });
      }
    }).catch((e) => {
      console.log(e);
    });
  };


  getAllCustomerGuaranties = () => {
    console.log('getting guarantees');
    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getGuarantieAddressForCustomer.call({from: this.account});
      }).then((guaranteeAddresses) => {
      console.log('guaranteeAddresses', guaranteeAddresses);
      if(guaranteeAddresses.length > 0) {
        guaranteeAddresses.forEach((guaranteeAddress) => {
          this.customerGuaranties = [...this.customerGuaranties, this.getOneGuaranty(guaranteeAddress)];
        });
      }
    }).catch((e) => {
      console.log(e);
    });
  };


  getAllBankGuaranties = () => {
    console.log('getting guarantees');
    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getGuarantieAddressForIssuer.call({from: this.account});
      }).then((guaranteeAddresses) => {
      console.log('guaranteeAddresses', guaranteeAddresses);
      if(guaranteeAddresses.length > 0) {
        guaranteeAddresses.forEach((guaranteeAddress) => {
          this.bankGuaranties = [...this.bankGuaranties, this.getOneGuaranty(guaranteeAddress)];
        });
      }
    }).catch((e) => {
      console.log(e);
    });
  };


  getOneGuaranty = (guarantyAddress): Guarantee  => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    console.log('guarantyAddress', guarantyAddress);
    this.DigitalGuaranteeBNHP.at(guarantyAddress)
      .then((guaranteeinstance) => {
        return guaranteeinstance.getGuaranteeData();
      }).then((result) => {
      return this.populateGuarantyData(result);
    }).catch((e) => {
      console.log(e);
    });
    return;
  };

  getCustomerData = (requestAddress) => {
    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getCustomer.call(requestAddress,{from: this.account});
      }).then((customer) => {
      console.log(customer);
      return {
        customerID: requestAddress,
        Name: customer[0],
        Address: customer[1]
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
      console.log('issuer', issuer);
      return {
        BankID: requestAddress,
        Name: issuer[0],
        Address: issuer[1]
      };
    }).catch((e) => {
      console.log(e);
    });
  };

  getAllBeneficiaries = () => {
    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getBeneficiaryAddresses.call({from: this.account});
      }).then((beneficiaryAddress) => {
      beneficiaryAddress.forEach((beneficiaryAddres) => {
        this.beneficiaries = [...this.beneficiaries, this.getOneBeneficiary(beneficiaryAddres)];
      });
    }).catch((e) => {
      console.log(e);
    });
  };


  getOneBeneficiary = (beneficiaryAddress): Beneficiary => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    console.log('beneficiaryAddress', beneficiaryAddress);
    this.Regulator
      .deployed()
      .then((instance) => {
        return instance.getBeneficiaries.call({from: this.account});
      }).then((result) => {
      return this.populateBeneficiaryData(beneficiaryAddress,result);
    }).catch((e) => {
      console.log(e);
    });
    return;
  };



  getGuaranteesData = (guaranteeID, type: number) => {
    //type = user, bank or beneficiary
    this.customerGuaranties.forEach((Guarantee) => {
      if (Guarantee.GuaranteeID==guaranteeID) return Request;
    });

    this.bankGuaranties.forEach((Guarantee) => {
      if (Guarantee.GuaranteeID==guaranteeID) return Request;
    });

    this.beneficiaryGuaranties.forEach((Request) => {
      if (Request.GuaranteeID==guaranteeID) return Request;
    });

  };

  populateRequestData = (resultArr): GRequest => {
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
      requestState: resultArr[10].valueOf()
    };
  };

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
      GuaranteeState: resultArr[10].valueOf()
    };
  };

  populateBeneficiaryData= (beneAddress,resultArr) => {

    return {
      beneficiaryID: beneAddress,
      Name: resultArr[0],
      Address: resultArr[1],

    };
  };

  acceptRequest = (requestId, comment , hashcode) => {
    // אישור של בנק
    if  (hashcode) {
      this.bankRequests.forEach((Request) => {
        if (Request.GRequestID==requestId)
        {
          Request.requestState=RequestState.accepted;
          return Request;
        }
      });
    }
    else
    {
        throw new Error('hashcode is empty');
    }
  };

  rejectRequest = (requestId,comment) => {
    // ביטול של בנק

    this.bankRequests.forEach((Request) => {
      if (Request.GRequestID==requestId)
      {
        Request.requestState=RequestState.rejected;
        return Request;
      }
    });
  };


  withdrawalRequest = (requestId) => {
    // ביטול של יוזר
    this.customerRequests.forEach((Request) => {
      if (Request.GRequestID==requestId)
      {
        Request.requestState=RequestState.withdrawed;
        return Request;
      }
    });
  };

  terminateGuatanty = (guatantyId) => {
    // ביטול של מוטב
    let requestid=null;
    this.customerGuaranties.forEach((Guaranty) => {
      if (Guaranty.GuaranteeID==guatantyId)
      {
        Guaranty.guaranteeState=GuaranteeState.Terminated;
        requestid=Guaranty.GRequestID;
      }
    });
    this.customerRequests.forEach((Request) => {
      if (Request.GRequestID==requestid)
      {
        Request.requestState=RequestState.terminationRequest;
      }
    });

  };


  guaranteeUpdate = (guatantyId,comment,ammount,date) => {
    this.customerGuaranties.forEach((Guaranty) => {
      if (Guaranty.GuaranteeID==guatantyId)
      {
        Guaranty.guaranteeState=GuaranteeState.Terminated;
        Guaranty.amount=ammount;
        Guaranty.EndDate=date;
      }
    });

  };

  updateRequest = (requestId,state,comment) => {
    // ביטול של בנק

    this.bankRequests.forEach((Request) => {
      if (Request.GRequestID==requestId)
      {
        Request.requestState=state;
      }
    });
  };


  getGRequestData = (requestId, type: number) => {

    this.customerRequests.forEach((Request) => {
      if (Request.GRequestID==requestId) {
        return this.fillMockRequest(Request, 0)
      }
    });

    this.bankRequests.forEach((Request) => {
      if (Request.GRequestID==requestId) {
        return this.fillMockRequest(Request, 1)
      }
    });

  };


  fillMockRequest = (request,type) => {
    if (type==0)
    {
      return {
        shortrequest: request,
        log: [{
          date: '01/09/17',
          state: RequestState.created,
          comment: null },
          {
            date: '01/09/17',
            state: RequestState.accepted,
            comment: "הכל מאושר על ידי משפטיט"
          }]
      }
    }
      else
    {
        return {
          shortrequest: request,
          log: [{
            date: '01/09/17',
        state: RequestState.created,
        comment: null
      },
        {
          date: '01/09/17',
          state: RequestState.rejected,
          comment: "אין כיסוי מספיק"
        }]
      }
    }
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
    });
  };

  /** Handle form modal */
  openModal(e) {
    console.log('e', e);
    this.modalType = e.user;
    if(!isNullOrUndefined(e.request)) {
      this.dialogData = e.request
    }
    this.openFormDialog = true;
console.log('this.openFormDialog', this.openFormDialog);
  }

  clearData() {
    this.dialogData = null;
  }

  handleCreateRequest = (e) => {
    console.log('e', e);
    this.createRequest('0xd532D3531958448e9E179729421B92962fb81Ddc',
      '0xd532D3531958448e9E179729421B92962fb81Ddc', '0xd532D3531958448e9E179729421B92962fb81Ddc',
      e.purpose, e.amount, (Date.now()/1000), (Date.now()/1000)+100000, 0, 0);
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
