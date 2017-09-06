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

  RequestState: RequestState;
}


export interface Guarantee {
  GuaranteeID: string;
  customer: string;
  bank: string;
  beneficiary: string;
  StartDate: string;
  EndDate: string;
  amount: number;
  purpose: string;
  indexType: IndexType;
  indexDate: number;
  GuaranteeState: GuaranteeState;
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
