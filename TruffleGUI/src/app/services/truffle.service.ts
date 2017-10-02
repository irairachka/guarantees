import { Injectable } from '@angular/core';
import {Web3} from 'web3';
const contract = require('truffle-contract');
import {MessageService} from "primeng/components/common/messageservice";

// Import our contract artifacts and turn them into usable abstractions.
const GuaranteeRequest_artifact = require('../../../../build/contracts/GuaranteeRequest.json');
const Regulator_artifact = require('../../../../build/contracts/Regulator.json');
// const DigitalGuaranteeBNHP_artifact = require('../../../build/contracts/DigitalGuaranteeBNHP.json');


@Injectable()
export class TruffleService {
  web3: any;
  Regulator = contract(Regulator_artifact);
  // GuaranteeRequest = contract(GuaranteeRequest_artifact);
  // DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);

  accounts: any;
  account: any;

  constructor(private msgService: MessageService) {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof this.web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8180"));
    }
  };

  onReady = () => {
    if(this.web3 !== undefined){
      this.Regulator.setProvider(this.web3.currentProvider);
      //   this.GuaranteeRequest.setProvider(this.web3.currentProvider);
      //
      //   // Get the initial account balance so it can be displayed.
      //   this.web3.eth.getAccounts((err, accs) => {
      //     if (err != null) {
      //       this.msgService.add({severity: 'warn', summary:'תקלת תקשורת', detail:'הייתה בעיה גישה לשרת'});
      //       return;
      //     }
      //
      //     if (accs.length === 0) {
      //       alert(
      //         'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
      //       );
      //       return;
      //     }
      //     this.accounts = accs;
      //     this.account = this.accounts[0];
      //
      //     /** Part of original truffle **/
      //     // This is run from window:load and ZoneJS is not aware of it we
      //     // need to use _ngZone.run() so that the UI updates on promise resolution
      //     // this._ngZone.run(() => {
      //     //   this.getAllUserRequests();
      //     // });
      //   });
    }
  };

  getAllUserRequests() {
    /** Gets all guarantee requests for customer */
    // return this.Regulator.deployed()
    //   .then((instance) => {
    //     return instance.getRequestsAddressForCustomer.call({from: this.account});
    //   })
    return 'truffle-service'
  };
}
