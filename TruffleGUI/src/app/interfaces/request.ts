import {IndexType, RequestState, GuaranteeState} from "./enum";

export interface GRequest {
  GRequestID: string;
  customer: string;
  bank: string;
  beneficiary: string;
  StartDate: string;
  EndDate: string;
  amount: number;
  purpose: string;
  indexType: IndexType;
  indexDate: number;
  requestState: RequestState;
}

export interface ExpandedRequest {
  shortrequest: GRequest;
  log: RequestFlowLog[] ;
  
}


export interface RequestFlowLog{
  date: string;
  state: RequestState;
  comment: string;
}


export interface Guarantee {
  GuaranteeID: string;
  GRequestID: string;
  customer: string;
  bank: string;
  beneficiary: string;
  StartDate: string;
  EndDate: string;
  amount: number;
  purpose: string;
  indexType: IndexType;
  indexDate: number;
  guaranteeState: GuaranteeState;
}


export interface Customer {
  customerID: string,
  Name: string
  Address: string
}


export interface Bank {
  bankID: string,
  Name: string
  Address: string
}


export interface Beneficiary {
  beneficiaryID: string,
  Name: string
  Address: string
}
