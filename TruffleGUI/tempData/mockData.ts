import {GRequest, Bank, Customer, Guarantee, Beneficiary, ExpandedRequest} from "../src/app/interfaces/request";
import {IndexType, RequestState, GuaranteeState} from "../src/app/interfaces/enum";

const  addressOnChain='0xd532D3531958448e9E179729421B92962fb81Ddc';


const  addressOnChainRequest1='0xd532D3531958448e9E179729421B92962fb81Dd1';
const  addressOnChainRequest2='0xd532D3531958448e9E179729421B92962fb81Dd2';
const  addressOnChainRequest3='0xd532D3531958448e9E179729421B92962fb81Dd3';
const  addressOnChainRequest4='0xd532D3531958448e9E179729421B92962fb81Dd4';
const  addressOnChainRequest5='0xd532D3531958448e9E179729421B92962fb81Dd5';
const  addressOnChainRequest6='0xd532D3531958448e9E179729421B92962fb81Dd6';

const  addressOnChainGuaranty1='0xd532D3531958448e9E179729421B92962fb81Dc1';

export const beneficiaryData: Beneficiary = {
  beneficiaryID: addressOnChain,
  Name: "עיריית ת׳׳א" ,
  Address: "אבן גבירול 69 תל אביב-יפו"
};

export const userData: Customer = {
  customerID: addressOnChain,
  Name: 'ישראל ישראלי',
  Address: 'יצחק כצנסלון 5, תל אביב'
};

export const bankData: Bank = {
  bankID: addressOnChain,
  Name: "בנק הפועלים",
  Address: "הנגב 11 תל אביב"
};

export const mockCustomerRequests: GRequest[] = [
  {
    GRequestID: addressOnChainRequest1,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    beneficiaryName: beneficiaryData.Name,
    StartDate: '10/05/17',
    EndDate: '10/05/19',
    amount: 10000,
    purpose: 'מכרז נקיון',
    indexType: IndexType.CPI,
    indexDate: 1,
    requestState: RequestState.accepted
  },{
    GRequestID: addressOnChainRequest2,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    beneficiaryName: beneficiaryData.Name,
    StartDate: '10/05/2017',
    EndDate: '10/05/2019',
    amount: 250000,
    purpose: 'מכרז בניה',
    indexType: IndexType.ConstructionMatirials,
    indexDate: 1,
    requestState: RequestState.waitingtobank
  },{
    GRequestID: addressOnChainRequest3,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    beneficiaryName: beneficiaryData.Name,
    StartDate: '10/05/2017',
    EndDate: '10/05/2019',
    amount: 9500,
    purpose: 'מכרז גינון',
    indexType: IndexType.None,
    indexDate: 1,
    requestState: RequestState.rejected
  },
  {
    GRequestID: addressOnChainRequest4,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    beneficiaryName: beneficiaryData.Name,
    bank: addressOnChain,
    StartDate: '10/05/2017',
    EndDate: '10/05/2019',
    amount: 775000,
    purpose: 'מכרז תחבורה',
    indexType: IndexType.CPI,
    indexDate: 1,
    requestState: RequestState.handling
  },{
    GRequestID: addressOnChainRequest5,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    beneficiaryName: beneficiaryData.Name,
    StartDate: '10/05/2017',
    EndDate: '10/05/2019',
    amount: 16000,
    purpose: 'ספק תחזוקה',
    indexType: IndexType.None,
    indexDate: 1,
    requestState: RequestState.withdrawed
  },{
    GRequestID: addressOnChainRequest6,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    beneficiaryName: beneficiaryData.Name,
    StartDate: '10/05/2017',
    EndDate: '10/05/2019',
    amount: 500,
    purpose: 'נסיון',
    indexType: IndexType.None,
    indexDate: 1,
    requestState: RequestState.waitingtocustomer
  }
];

export const mockCustomerGuaranties: Guarantee[] = [
  {
    GuaranteeID: addressOnChainGuaranty1,
    GRequestID: addressOnChainRequest1,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    customerName: userData.Name,
    StartDate: '10/05/2017',
    EndDate: '10/05/2019',
    amount: 10000,
    purpose: 'מכרז נקיון' ,
    indexType: IndexType.CPI,
    indexDate: 1,
    guaranteeState: GuaranteeState.Valid
  }
];

export const mockbeneficiaries:Beneficiary[] =[
  beneficiaryData
];

export const mockcustomers:Customer[] =[
  userData
];
export const mockBankRequests: GRequest[] = mockCustomerRequests;

export const mockBankGuaranties: Guarantee[] = mockCustomerGuaranties;

export const mockBeneficiaryGuaranties: Guarantee[] = mockCustomerGuaranties;

export const mockexpandedRequest: ExpandedRequest[] =[
  {
  shortrequest: mockCustomerRequests[0],
  log: [
    {
      date: mockCustomerRequests[0].StartDate,
      state: RequestState.created,
      comment: null
    },
    {
      date: mockCustomerRequests[0].StartDate,
      state: RequestState.waitingtobank,
      comment: null
    },
    {
      date: mockCustomerRequests[0].StartDate,
      state: mockCustomerRequests[0].requestState,
      comment: "אושר על ידי משפטית"
    }
  ]

},
  {
    shortrequest: mockCustomerRequests[1],
    log: [
      {
        date: mockCustomerRequests[1].StartDate,
        state: RequestState.created,
        comment: null
      },

      {
        date: mockCustomerRequests[1].StartDate,
        state: mockCustomerRequests[1].requestState,
        comment: null
      }
    ]

  },
  {
    shortrequest: mockCustomerRequests[2],
    log: [
      {
        date: mockCustomerRequests[2].StartDate,
        state: RequestState.created,
        comment: null
      },
      {
        date: mockCustomerRequests[2].StartDate,
        state: RequestState.waitingtobank,
        comment: null
      },
      {
        date: mockCustomerRequests[2].StartDate,
        state: mockCustomerRequests[2].requestState,
        comment: " לא אושר על ידי משפטית"
      }
    ]

  },
  {
    shortrequest: mockCustomerRequests[3],
    log: [
      {
        date: mockCustomerRequests[3].StartDate,
        state: RequestState.created,
        comment: null
      },
      {
        date: mockCustomerRequests[3].StartDate,
        state: RequestState.waitingtobank,
        comment: null
      },
      {
        date: mockCustomerRequests[3].StartDate,
        state: mockCustomerRequests[3].requestState,
        comment: "ממתין למשפטית"
      }
    ]

  },
  {
    shortrequest: mockCustomerRequests[4],
    log: [
      {
        date: mockCustomerRequests[4].StartDate,
        state: RequestState.created,
        comment: null
      },

      {
        date: mockCustomerRequests[4].StartDate,
        state: RequestState.waitingtobank,
        comment: null
      },
      {
        date: mockCustomerRequests[4].StartDate,
        state: mockCustomerRequests[4].requestState,
        comment: null
      }
    ]
  },
  {
    shortrequest: mockCustomerRequests[5],
    log: [
      {
        date: mockCustomerRequests[5].StartDate,
        state: RequestState.created,
        comment: null
      },

      {
        date: mockCustomerRequests[5].StartDate,
        state: RequestState.waitingtobank,
        comment: null
      },
      {
        date: mockCustomerRequests[5].StartDate,
        state: mockCustomerRequests[5].requestState,
        comment: "לא ברור למה ביקשו!!!"
      }
    ]

  }
];



