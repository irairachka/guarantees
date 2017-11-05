export enum IndexType { None, CPI, ConstructionMatirials }

export enum RequestState {
  created,
  waitingtobank,
  handling,
  waitingtocustomer,
  waitingtobeneficiery,
  withdrawed,
  accepted,
  changeRequested,
  rejected,
  terminationRequest }

export enum GuaranteeState {  None,  Valid, Expired ,Terminated , Reissued}

