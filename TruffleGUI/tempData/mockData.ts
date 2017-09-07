import {GRequest, Bank, Customer, Guarantee, Beneficiary} from "../src/app/interfaces/request";
import {IndexType, RequestState, GuaranteeState} from "../src/app/interfaces/enum";

const  addressOnChain='0xd532D3531958448e9E179729421B92962fb81Ddc';


const  addressOnChainRequest1='0xd532D3531958448e9E179729421B92962fb81Dd1';
const  addressOnChainRequest2='0xd532D3531958448e9E179729421B92962fb81Dd2';
const  addressOnChainRequest3='0xd532D3531958448e9E179729421B92962fb81Dd3';
const  addressOnChainRequest4='0xd532D3531958448e9E179729421B92962fb81Dd4';
const  addressOnChainRequest5='0xd532D3531958448e9E179729421B92962fb81Dd5';

const  addressOnChainGuaranty1='0xd532D3531958448e9E179729421B92962fb81Dc1';


export const customerRequests: GRequest[] = [
  {
    GRequestID: addressOnChainRequest1,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    StartDate: '10052017',
    EndDate: '10052019',
    amount: 10000,
    purpose: 'שכר דירה',
    indexType: IndexType.CPI,
    indexDate: 1,
    requestState: RequestState.accepted
  },{
    GRequestID: addressOnChainRequest2,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    StartDate: '10052017',
    EndDate: '10052019',
    amount: 10000,
    purpose: 'מכרז של העירייה',
    indexType: IndexType.ConstructionMatirials,
    indexDate: 1,
    requestState: RequestState.waitingtobank
  },{
    GRequestID: addressOnChainRequest3,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    StartDate: '10052017',
    EndDate: '10052019',
    amount: 10000,
    purpose: 'מכרז לבניית גינה',
    indexType: IndexType.None,
    indexDate: 1,
    requestState: RequestState.rejected
  },
  {
    GRequestID: addressOnChainRequest4,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    StartDate: '10052017',
    EndDate: '10052019',
    amount: 10000,
    purpose: 'מכרז על שיפוץ כבישים',
    indexType: IndexType.CPI,
    indexDate: 1,
    requestState: RequestState.handling
  },{
    GRequestID: addressOnChainRequest5,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    StartDate: '10052017',
    EndDate: '10052019',
    amount: 10000,
    purpose: 'ספק תחזוקה',
    indexType: IndexType.None,
    indexDate: 1,
    requestState: RequestState.withdrawed
  }
];

export const customerGuaranties: Guarantee[] = [
  {
    GuaranteeID: addressOnChainGuaranty1,
    GRequestID: addressOnChainRequest1,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    StartDate: '10052017',
    EndDate: '10052019',
    amount: 10000,
    purpose: 'שכר דירה',
    indexType: IndexType.CPI,
    ndexDate: 1,
    guaranteeState: GuaranteeState.valid
  }
];

export const beneficiaries:Beneficiary[] =[
  {
    beneficiaryID: beneficiaryData.beneficiaryID,
    Name: beneficiaryData.Name,
    Address: beneficiaryData.Address
  }
];
export const bankRequests: GRequest[] = customerRequests;

export const bankGuaranties: Guarantee[] = customerGuaranties;
export const beneficiaryGuaranties: Guarantee[] = customerGuaranties;



export const userData: Customer = {
  customerID: addressOnChain,
  Name: 'ישראל ישראלי',
  Address: 'יצחק קצנסלון 5, תל אביב'
};

export const bankData: Bank = {
  bankID: addressOnChain,
  Name: "בנק הפועלים",
  Address: "הנגב 11 תל אביב"
};

export const beneficiaryData: Beneficiary = {

  beneficiaryID: addressOnChain,
  Name: "עיריית תל אביב-יפו" ,
  Address: "אבן גבירול 69 תל אביב-יפו"

};




export const expandedRequest: ExpandedRequest[] =[
  {
  shortrequest: customerRequests[0],
  log: [
    {
      date: customerRequests[0].StartDate-10000,
      state: RequestState.created,
      comment: null
    },
    {
      date: customerRequests[0].StartDate-100,
      state: RequestState.accepted,
      comment: "הכל מאושר על ידי משפטיט"
    }
  ]

}
];



