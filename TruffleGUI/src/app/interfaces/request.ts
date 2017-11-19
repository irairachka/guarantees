import {IndexType, RequestState, GuaranteeState} from "./enum";

export interface GRequest {
  GRequestID: string;
  customer: string;
  bank: string;
  beneficiary: string;
  beneficiaryName: string;
  StartDate: string;
  EndDate: string;
  amount: number;
  fullName: string;
  purpose: string;
  indexType: IndexType;
  indexDate: number;
  requestState: RequestState;
  ischangeRequest:boolean;
  changeRequest:string;
}

export interface ExpandedRequest {
  shortrequest: GRequest;
  log: RequestFlowLog[] ;

}


export interface ExpandedGuarantee {
  shortrequest: Guarantee;
  log: RequestFlowLog[] ;

}

export interface RequestFlowLog{
  eventname:string;
  date: string;
  state: RequestState;
  comment: string;
}


export interface Guarantee {
  GuaranteeID: string;
  GRequestID: string;
  customer: string;
  customerName: string;
  bank: string;
  beneficiary: string;
  StartDate: string;
  EndDate: string;
  amount: number;
  fullName: string;
  purpose: string;
  indexType: IndexType;
  indexDate: number;
  guaranteeState: GuaranteeState;

}


export interface Customer {
  customerID: string;
  Name: string;
  Address: string;
}


export interface Bank {
  bankID: string;
  Name: string;
  Address: string;
}


export interface Beneficiary {
  beneficiaryID: string;
  Name: string;
  Address: string;
}
