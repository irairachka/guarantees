import {GRequest, Bank, Customer} from "../src/app/interfaces/request";
import {IndexType, RequestState} from "../src/app/interfaces/enum";

export const allRequests = [
  {
    customer: 'XXXX',
    beneficiary: 'YYYY',
    bank: 'ZZZZ',
    StartDate: '10052017',
    EndDate: '10052019',
    amount: 10000,
    purpose: 'שכר דירה',
    indexType: IndexType.CPI,
    indexDate: 1,
    RequestState: RequestState.accepted
  },
  {
    customer: 'XXXX',
    beneficiary: 'YYYY',
    bank: 'ZZZZ',
    StartDate: '10052017',
    EndDate: '10052019',
    amount: 10000,
    purpose: 'מכרז של העירייה',
    indexType: IndexType.ConstructionMatirials,
    indexDate: 1,
    RequestState: RequestState.waitingtobeneficiery
  },
  {
    customer: 'XXXX',
    beneficiary: 'YYYY',
    bank: 'ZZZZ',
    StartDate: '10052017',
    EndDate: '10052019',
    amount: 10000,
    purpose: 'מכרז לבניית גינה',
    indexType: IndexType.None,
    indexDate: 1,
    RequestState: RequestState.waitingtobank
  },
  {
    customer: 'XXXX',
    beneficiary: 'YYYY',
    bank: 'ZZZZ',
    StartDate: '10052017',
    EndDate: '10052019',
    amount: 10000,
    purpose: 'מכרז על שיפוץ כבישים',
    indexType: IndexType.CPI,
    indexDate: 1,
    RequestState: RequestState.handling
  },{
    customer: 'XXXX',
    beneficiary: 'YYYY',
    bank: 'ZZZZ',
    StartDate: '10052017',
    EndDate: '10052019',
    amount: 10000,
    purpose: 'ספק תחזוקה',
    indexType: IndexType.None,
    indexDate: 1,
    RequestState: RequestState.accepted
  }
];

export const userData: Customer = {
  customerID: '0xd532D3531958448e9E179729421B92962fb81Ddc',
  Name: 'ישראל ישראלי',
  Address: 'יצחק קצנסלון 5, תל אביב'
};

export const bankData = {
  bankID: '0xd532D3531958448e9E179729421B92962fb81Ddc',
  Name: 'הפועלים',
  Address: 'אבן גבירול 156'
};
