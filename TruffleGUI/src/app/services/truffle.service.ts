import { Injectable, isDevMode } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
import {MessageService} from "primeng/components/common/messageservice";
import {mockCustomerRequests, mockcustomers, mockCustomerGuaranties} from "../../../tempData/mockData";
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
      return new Promise((resolve, reject)=> {
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
      return new Promise((resolve, reject)=> {
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
}
