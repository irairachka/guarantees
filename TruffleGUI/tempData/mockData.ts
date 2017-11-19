import {GRequest, Bank, Customer, Guarantee, Beneficiary, ExpandedRequest} from "../src/app/interfaces/request";
import {IndexType, RequestState, GuaranteeState} from "../src/app/interfaces/enum";

const  addressOnChain='0x00a329c0648769a73afac7f9381e08fb43dbea72';
// const  addressOnChain='0x006fbafdadf4ef72aebf71666537a6315fe24cae';

const  addressOnChainRequest1='0xd532D3531958448e9E179729421B92962fb81Dd1';
const  addressOnChainRequest2='0xd532D3531958448e9E179729421B92962fb81Dd2';
const  addressOnChainRequest3='0xd532D3531958448e9E179729421B92962fb81Dd3';
const  addressOnChainRequest4='0xd532D3531958448e9E179729421B92962fb81Dd4';
const  addressOnChainRequest5='0xd532D3531958448e9E179729421B92962fb81Dd5';
const  addressOnChainRequest6='0xd532D3531958448e9E179729421B92962fb81Dd6';

const  addressOnChainGuaranty1='0xd532D3531958448e9E179729421B92962fb81Dc1';

export const beneficiaryData: Beneficiary = {
  beneficiaryID: addressOnChain,
  Name: "עיריית ראשון לציון" ,
  Address: "הכרמל 20, ראשון לציון"
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
    fullName: 'ישראל ישראלי',
    purpose: 'מכרז נקיון',
    indexType: IndexType.CPI,
    indexDate: 1,
    requestState: RequestState.accepted,
    ischangeRequest: false,
    changeRequest:''
  },{
    GRequestID: addressOnChainRequest2,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    beneficiaryName: beneficiaryData.Name,
    StartDate: '10/05/2017',
    EndDate: '10/05/2019',
    amount: 250000,
    fullName: 'ישראל ישראלי',
    purpose: 'מכרז בניה',
    indexType: IndexType.ConstructionMatirials,
    indexDate: 1,
    requestState: RequestState.waitingtobank,
    ischangeRequest: false,
    changeRequest:''
  },{
    GRequestID: addressOnChainRequest3,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    beneficiaryName: beneficiaryData.Name,
    StartDate: '10/05/2017',
    EndDate: '10/05/2019',
    amount: 9500,
    fullName: 'ישראל ישראלי',
    purpose: 'מכרז גינון',
    indexType: IndexType.None,
    indexDate: 1,
    requestState: RequestState.rejected,
    ischangeRequest: false,
    changeRequest:''
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
    fullName: 'ישראל ישראלי',
    purpose: 'מכרז תחבורה',
    indexType: IndexType.CPI,
    indexDate: 1,
    requestState: RequestState.handling,
    ischangeRequest: false,
    changeRequest:''
  },{
    GRequestID: addressOnChainRequest5,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    beneficiaryName: beneficiaryData.Name,
    StartDate: '10/05/2017',
    EndDate: '10/05/2019',
    amount: 16000,
    fullName: 'ישראל ישראלי',
    purpose: 'ספק תחזוקה',
    indexType: IndexType.None,
    indexDate: 1,
    requestState: RequestState.withdrawed,
    ischangeRequest: false,
    changeRequest:''
  },{
    GRequestID: addressOnChainRequest6,
    customer: addressOnChain,
    beneficiary: addressOnChain,
    bank: addressOnChain,
    beneficiaryName: beneficiaryData.Name,
    StartDate: '10/05/2017',
    EndDate: '10/05/2019',
    amount: 500,
    fullName: 'ישראל ישראלי',
    purpose: 'נסיון',
    indexType: IndexType.None,
    indexDate: 1,
    requestState: RequestState.waitingtocustomer,
    ischangeRequest: false,
    changeRequest:''
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
    fullName: 'ישראל ישראלי',
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
      eventname:'created',
      date: mockCustomerRequests[0].StartDate,
      state: RequestState.created,
      comment: null
    },
    {
      eventname:'waitingtobank',
      date: mockCustomerRequests[0].StartDate,
      state: RequestState.waitingtobank,
      comment: null
    },
    {
      eventname:'accepted',
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
        eventname:'created',
        date: mockCustomerRequests[1].StartDate,
        state: RequestState.created,
        comment: null
      },

      {
        eventname:'waitingtobank',
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
        eventname:'created',
        date: mockCustomerRequests[2].StartDate,
        state: RequestState.created,
        comment: null
      },
      {
        eventname:'waitingtobank',
        date: mockCustomerRequests[2].StartDate,
        state: RequestState.waitingtobank,
        comment: null
      },
      {
        eventname:'rejected',
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
        eventname:'created',
        date: mockCustomerRequests[3].StartDate,
        state: RequestState.created,
        comment: null
      },
      {
        eventname:'waitingtobank',
        date: mockCustomerRequests[3].StartDate,
        state: RequestState.waitingtobank,
        comment: null
      },
      {
        eventname:'rejected',
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
        eventname:'created',
        date: mockCustomerRequests[4].StartDate,
        state: RequestState.created,
        comment: null
      },

      {
        eventname:'waitingtobank',
        date: mockCustomerRequests[4].StartDate,
        state: RequestState.waitingtobank,
        comment: null
      },
      {
        eventname:'waitingtobank',
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
        eventname:'created',
        date: mockCustomerRequests[5].StartDate,
        state: RequestState.created,
        comment: null
      },

      {
        eventname:'waitingtobank',
        date: mockCustomerRequests[5].StartDate,
        state: RequestState.waitingtobank,
        comment: null
      },
      {
        eventname:'rejected',
        date: mockCustomerRequests[5].StartDate,
        state: mockCustomerRequests[5].requestState,
        comment: "לא ברור למה ביקשו!!!"
      }
    ]

  }
];



