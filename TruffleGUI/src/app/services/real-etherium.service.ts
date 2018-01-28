import { Injectable, isDevMode } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
import {MessageService} from "primeng/components/common/messageservice";
import {
  mockCustomerRequests, mockcustomers, mockCustomerGuaranties, bankData,
  mockBankRequests, mockBankGuaranties, mockbeneficiaries, mockexpandedRequest
} from "../../../tempData/mockData";
import {Beneficiary, Customer, Guarantee,GRequest} from "../interfaces/request";
import {Observable} from "rxjs/Rx";
import {GuaranteeState, RequestState} from "../interfaces/enum";
import {MockService} from "./mock-etherium.service";
// Import our contract artifacts and turn them into usable abstractions.
const GuaranteeRequest_artifact = require('../../../../build/contracts/GuaranteeRequest.json');
const Regulator_artifact = require('../../../../build/contracts/Regulator.json');
const DigitalGuaranteeBNHP_artifact = require('../../../../build/contracts/DigitalGuaranteeBNHP.json');
const GuaranteeRequestExtender_artifact = require('../../../../build/contracts/GuaranteeRequestExtender.json');
const GuaranteeExtender_artifact = require('../../../../build/contracts/GuaranteeExtender.json');

let Regulator = contract(Regulator_artifact);
let GuaranteeRequest = contract(GuaranteeRequest_artifact);
let DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);
let GuaranteeExtender = contract(GuaranteeExtender_artifact);
let GuaranteeRequestExtender = contract(GuaranteeRequestExtender_artifact);

@Injectable()
export class EtheriumService extends MockService {
  


  constructor(public msgService:MessageService) {
    super(msgService);

  }


  

}
