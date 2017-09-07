import {GRequest, Bank, Customer, Guarantee, Beneficiary, ExpandedRequest} from "../src/app/interfaces/request";
import {IndexType, RequestState, GuaranteeState} from "../src/app/interfaces/enum";

const  addressOnChain='0xd532D3531958448e9E179729421B92962fb81Ddc';


const  addressOnChainRequest1='0xd532D3531958448e9E179729421B92962fb81Dd1';
const  addressOnChainRequest2='0xd532D3531958448e9E179729421B92962fb81Dd2';
const  addressOnChainRequest3='0xd532D3531958448e9E179729421B92962fb81Dd3';
const  addressOnChainRequest4='0xd532D3531958448e9E179729421B92962fb81Dd4';
const  addressOnChainRequest5='0xd532D3531958448e9E179729421B92962fb81Dd5';

const  addressOnChainGuaranty1='0xd532D3531958448e9E179729421B92962fb81Dc1';


export const mockCustomerRequests: GRequest[] = [
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

// export const customerGuaranties: Guarantee[] = [
//   {
//     GuaranteeID: this.addressOnChainGuaranty1,
//     GRequestID: this.addressOnChainRequest1,
//     customer:this. addressOnChain,
//     beneficiary: this.addressOnChain,
//     bank: this.addressOnChain,
//     StartDate: '10052017',
//     EndDate: '10052019',
//     amount: 10000,
//     purpose: 'שכר דירה',
//     indexType: IndexType.CPI,
//     indexDate: 1,
//     guaranteeState: GuaranteeState.Valid
//   }
// ];
//
// export const beneficiaries:Beneficiary[] =[
//   {
//     beneficiaryID: this.beneficiaryData.beneficiaryID,
//     Name: this.beneficiaryData.Name,
//     Address: this.beneficiaryData.Address
//   }
// ];
// export const bankRequests: GRequest[] = this.mockCustomerRequests;
//
// export const bankGuaranties: Guarantee[] = this.customerGuaranties;
// export const beneficiaryGuaranties: Guarantee[] = this.customerGuaranties;
//
//
//
// export const userData: Customer = {
//   customerID: this.addressOnChain,
//   Name: 'ישראל ישראלי',
//   Address: 'יצחק קצנסלון 5, תל אביב'
// };
//
// export const bankData: Bank = {
//   bankID: this.addressOnChain,
//   Name: "בנק הפועלים",
//   Address: "הנגב 11 תל אביב"
// };
//
// export const beneficiaryData: Beneficiary = {
//   beneficiaryID: this.addressOnChain,
//   Name: "עיריית תל אביב-יפו" ,
//   Address: "אבן גבירול 69 תל אביב-יפו"
// };




// export const expandedRequest: ExpandedRequest[] =[
//   {
//   shortrequest: customerRequests[0],
//   log: [
//     {
//       date: this.customerRequests[0].StartDate-100000,
//       state: RequestState.created,
//       comment: null
//     },
//     {
//       date: this.customerRequests[0].StartDate-90000,
//       state: RequestState.waitingtobank,
//       comment: null
//     },
//     {
//       date: this.customerRequests[0].StartDate-80000,
//       state: this.customerRequests[0].requestState,
//       comment: "הכל מאושר על ידי משפטיט"
//     }
//   ]
//
// },
//   {
//     shortrequest: this.customerRequests[1],
//     log: [
//       {
//         date: this.customerRequests[1].StartDate-10000,
//         state: RequestState.created,
//         comment: null
//       },
//
//       {
//         date: this.customerRequests[1].StartDate-10000,
//         state: this.customerRequests[1].requestState,
//         comment: null
//       }
//     ]
//
//   },
//   {
//     shortrequest: this.customerRequests[2],
//     log: [
//       {
//         date: this.customerRequests[2].StartDate-10000,
//         state: RequestState.created,
//         comment: null
//       },
//       {
//         date: this.customerRequests[2].StartDate-90000,
//         state: RequestState.waitingtobank,
//         comment: null
//       },
//       {
//         date: this.customerRequests[2].StartDate-100,
//         state: this.customerRequests[2].requestState,
//         comment: "לא מאושר על ידי משפטיט"
//       }
//     ]
//
//   },
//   {
//     shortrequest: this.customerRequests[3],
//     log: [
//       {
//         date: this.customerRequests[3].StartDate-10000,
//         state: RequestState.created,
//         comment: null
//       },
//       {
//         date: this.customerRequests[3].StartDate-90000,
//         state: RequestState.waitingtobank,
//         comment: null
//       },
//       {
//         date: this.customerRequests[3].StartDate-100,
//         state: this.customerRequests[3].requestState,
//         comment: "ממתין למשפטית לאישור"
//       }
//     ]
//
//   },
//   {
//     shortrequest: this.customerRequests[4],
//     log: [
//       {
//         date: this.customerRequests[4].StartDate-10000,
//         state: RequestState.created,
//         comment: null
//       },
//
//       {
//         date: this.customerRequests[4].StartDate-10000,
//         state: RequestState.waitingtobank,
//         comment: null
//       },
//       {
//         date: this.customerRequests[4].StartDate-100,
//         state: this.customerRequests[4].requestState,
//         comment: null
//       }
//     ]
//
//   }
// ];



