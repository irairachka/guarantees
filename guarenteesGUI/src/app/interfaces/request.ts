import {IndexType, RequestState} from "./enum";

export interface Request {
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
