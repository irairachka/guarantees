import { Injectable, isDevMode } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
import {MessageService} from "primeng/components/common/messageservice";
import {
  mockCustomerRequests, mockcustomers, mockCustomerGuaranties, bankData,
  mockBankRequests, mockBankGuaranties, mockbeneficiaries, mockexpandedRequest, mockBeneficiaryGuaranties
} from "../../../tempData/mockData";
import {Beneficiary, Customer, Guarantee} from "../interfaces/request";
import {Observable} from "rxjs/Rx";

// Import our contract artifacts and turn them into usable abstractions.
const GuaranteeRequest_artifact = require('../../../../build/contracts/GuaranteeRequest.json');
const Regulator_artifact = require('../../../../build/contracts/Regulator.json');
// const DigitalGuaranteeBNHP_artifact = require('../../../build/contracts/DigitalGuaranteeBNHP.json');


@Injectable()
export class EtheriumService {
  devMode:boolean = isDevMode();
  web3:any;
  Regulator = contract(Regulator_artifact);
  GuaranteeRequest = contract(GuaranteeRequest_artifact);
  // DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);

  accounts:any;
  account:any;

  constructor() {}

  /************************/
  /**  Get User Data   ****/
  /************************/

  getCustomerData = (customerAddress) => {
    return new Promise((resolve)=> {
      resolve(mockcustomers);
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

  getBankData = (requestAddress) => {
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

  /** ***********************/
  /**  Helper Function   ****/
  /** ***********************/

    getGuarantyHistory = (requestId) => {
      return new Promise((resolve) => {
        resolve(mockexpandedRequest[0].log);
      });
    };
}
