import {IndexType, RequestState} from "./enum";

export interface Request {
  customer: string;
  beneficiary: string;
  bank: string;

  StartDate: string;
  EndDate: string;

  amount: number;
  purpose: number;

  indexType: IndexType;
  indexDate: number;

  RequestState: RequestState;
}
