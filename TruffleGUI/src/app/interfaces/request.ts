import {IndexType, RequestState} from "./enum";

export interface GRequest {
  customer: string;
  beneficiary: string;
  bank: string;

  StartDate: string;
  EndDate: string;

  amount: number;
  purpose: string;

  indexType: IndexType;
  indexDate: number;

  RequestState: RequestState;
}
