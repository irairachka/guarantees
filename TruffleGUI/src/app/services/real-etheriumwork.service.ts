import { Injectable, isDevMode } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
import {MessageService} from "primeng/components/common/messageservice";
import {
  mockCustomerRequests, mockcustomers, mockCustomerGuaranties, bankData,
  mockBankRequests, mockBankGuaranties, mockbeneficiaries, mockexpandedRequest
} from "../../../tempData/mockData";
import {Beneficiary, Customer, Guarantee,GRequest} from "../interfaces/request";
import {Observable} from "rxjs/Rx";
import {GuaranteeState, RequestState} from "../interfaces/enum";
import {MockService} from "./mock-etherium.service";
// Import our contract artifacts and turn them into usable abstractions.
const GuaranteeRequest_artifact = require('../../../../build/contracts/GuaranteeRequest.json');
const Regulator_artifact = require('../../../../build/contracts/Regulator.json');
const DigitalGuaranteeBNHP_artifact = require('../../../../build/contracts/DigitalGuaranteeBNHP.json');
const GuaranteeRequestExtender_artifact = require('../../../../build/contracts/GuaranteeRequestExtender.json');
const GuaranteeExtender_artifact = require('../../../../build/contracts/GuaranteeExtender.json');

let Regulator = contract(Regulator_artifact);
let GuaranteeRequest = contract(GuaranteeRequest_artifact);
let DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);
let GuaranteeExtender = contract(GuaranteeExtender_artifact);
let GuaranteeRequestExtender = contract(GuaranteeRequestExtender_artifact);


@Injectable()
export class RealService extends MockService {
  web3:any;
  currentMockId: number = 1000;

  realRequests =null;
  realGuarantees =null;




  accounts:any;
  account:any;



  constructor(public msgService:MessageService) {
    super(msgService);
      this.checkAndInstantiateWeb3();
      this.onReady();
  }

  /** ******************** **/
  /**  Setup Functions     **/
  /** ******************** **/

  checkAndInstantiateWeb3 = () => {
    var url="http://"+environment.server+":8545";  //"http://localhost:8545"

    if (typeof this.web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to "+url+". You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      this.web3 = new Web3(new Web3.providers.HttpProvider(url));
    }
  };

  onReady = () => {
    Regulator.setProvider(this.web3.currentProvider);
    GuaranteeRequest.setProvider(this.web3.currentProvider);
    DigitalGuaranteeBNHP.setProvider(this.web3.currentProvider);
    GuaranteeExtender.setProvider(this.web3.currentProvider);
    GuaranteeRequestExtender.setProvider(this.web3.currentProvider);



    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        this.msgService.add({severity: 'warn', summary: 'תקלת תקשורת', detail: 'הייתה בעיה גישה לשרת'});
        return;
      }

      if (accs.length === 0) {
        alert(
          'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
        );
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];
      console.log('this.accounts',this.accounts)
      /** Part of original truffle **/
      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      // this._ngZone.run(() => {
      //   this.getAllUserRequests();
      // });
    });
  };

  /************************/
  /**  replaced   ****/
  /************************/

  // getAllRequests = ()=> {
  //   /** Gets all guarantee requests for customer */
  //      return this.getAllUserRequestsEt();
  //   };

  getAllRequests = ()=> {

     // if (this.realRequests==null)
     // {
      /** Gets all guarantee requests for customer */
      return new Promise((resolve, reject)=> {
        this.getAllUserRequestsEt().then((requestsEt)=> {
          this.realRequests=[...mockCustomerRequests, ...requestsEt];
          super.setMockRequests(this.realRequests);
          resolve(this.realRequests);
        }).catch((error)=> {

          this.msgService.add({
            severity: 'error',
            summary: 'תקלת בבלוקציין',
            detail: 'Etherium Fatal Error!!!'
          });
          reject(error);
        });

      });
     // }
    // else
    //   new Promise((resolve, reject)=> {
    //     resolve(this.mockRequests);
    //   });
  };

  getAllGuaranties = () => {
    // if (this.realGuarantees==null) {
      return new Promise((resolve, reject)=> {
        this.getAllUserGuarantees().then((GuarantiesEt)=> {
          this.realGuarantees = [...mockCustomerGuaranties, ...GuarantiesEt];
          super.setMockGuarantee(this.realGuarantees);
          resolve(this.realGuarantees);
        }).catch((error)=> {
          this.msgService.add({
            severity: 'error',
            summary: 'תקלת בבלוקציין',
            detail: 'Etherium Fatal Error!!!'
          });
          reject(error);
        });
      })
    // }
    // else
    //   new Promise((resolve, reject)=> {
    //     resolve(this.mockGuarantees);
    //   });

  };


  createRequest( userId , bankId, benefId , purpose,
                 amount, StartDate, EndDate, indexType, indexDate ) {

    let newItem ;
    let addressOfIns;
    const startDate =  StartDate;
    const endDate = EndDate ;
    console.log("createRequest dates",StartDate, EndDate);

    return new Promise((resolve, reject)=> {
      // debugger;
      return this.createRequestEt(userId, bankId, benefId, "full name", purpose,
        amount, StartDate*1000, EndDate*1000, indexType, indexDate, 'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f0fdc2')
        .then((instance) => {

          console.log("createRequest result", instance);
          newItem = this.populateRequestData(
            [instance.address,
              userId,
              bankId,
              benefId,
              this.web3.fromUtf8(''),
              this.web3.fromUtf8(purpose),
              amount,
              startDate,
              endDate,
              indexType,
              indexDate,
              RequestState.created
            ]
          );
          addressOfIns = instance.address;
          this.addRequestEt(this.account, addressOfIns).then((result) => {

            console.log("addRequestEt result", instance);


            this.submitRequestEt(this.account, this.getGuaranteeRequestInstance(addressOfIns), '').then((result) => {

              console.log("submitRequestEt result", instance);

              newItem = this.populateRequestData(
                [instance.address,
                  userId,
                  bankId,
                  benefId,
                  this.web3.fromUtf8(''),
                  this.web3.fromUtf8(purpose),
                  amount,
                  startDate,
                  endDate,
                  indexType,
                  indexDate,
                  RequestState.waitingtobank
                ]
              );

              this.msgService.add({
                severity: 'success',
                summary: 'ערבות חדשה',
                detail: 'בקשה לערבות חדשה נשלחה בהצלחה'
              });
              // console.log("newItem", newItem);
              this.mockRequests = [...this.mockRequests, newItem];
              resolve(newItem);

            }).catch((error)=> {
              console.error('error',error);
              this.msgService.add({
                severity: 'warn',
                summary: 'ערבות חדשה',
                detail: 'בקשה לערבות חדשה נכשלה חלקית'
              });
              this.mockRequests = [...this.mockRequests, newItem];
              resolve(newItem);
            })
          }).catch((error) => {
            console.error('error',error);
            this.msgService.add({
              severity: '׳warn',
              summary: 'ערבות חדשה',
              detail: 'בקשה לערבות חדשה נכשלה חלקית'
            });console.log("newItem", newItem);
            this.mockRequests = [...this.mockRequests, newItem];
            resolve(newItem);
          })


        }).catch((error) => {
          console.error('error',error);
          this.msgService.add({
            severity: 'error',
            summary: 'ערבות חדשה',
            detail: 'בקשה לערבות חדשה נכשלה'
          });
          reject(error);
          // throw error;
          //   this.currentMockId = this.currentMockId +1;
          //    newItem = this.populateRequestData(
          //     [''+this.currentMockId,
          //       userId,
          //       bankId,
          //       benefId,
          //       this.web3.fromUtf8(''),
          //       this.web3.fromUtf8(purpose),
          //       amount,
          //       startDate,
          //       endDate,
          //       indexType,
          //       indexDate,
          //       RequestState.waitingtobank
          //     ]
          //    );
          // this.msgService.add({severity: 'success', summary:'ערבות חדשה', detail:'בקשה לערבות חדשה נשלחה בהצלחה'});
          // console.log("newItem",newItem);
          // this.mockRequests = [...this.mockRequests, newItem];
          // return newItem ;
        });
    });

  };

  withdrawalRequest = (requestId, comment):any => {
    return new Promise((resolve, reject)=> {
      this.withdrawalRequestEt(this.getGuaranteeRequestInstance(requestId), '', this.account).then((result) => {

        let updatedItem = this.mockRequests.find((item) => {
          return item.GRequestID === requestId;
        });
        updatedItem.requestState = RequestState.withdrawed;
        // console.log('updatedItem',updatedItem);
        resolve(updatedItem);
        this.msgService.add({
          severity: 'success',
          summary: 'ערבות חדשה',
          detail: 'בקשה לערבות בוטלה בהצלחה'
        });

      }).catch((error)=> {
        console.error('error',error);
        this.msgService.add({
          severity: 'error',
          summary: 'ערבות חדשה',
          detail: 'בקשה למשיכת ערבות  נכשלה'
        });
        reject(error);

      })



    });
  };



  updateRequest = (requestId, comment):any => {
    return new Promise((resolve, reject)=> {

      this.updateRequestEt(this.getGuaranteeRequestInstance(requestId), comment, RequestState.handling).then((result) => {

        let updatedItem = this.mockRequests.find((item) => {
          return item.GRequestID === requestId;
        });
        updatedItem.requestState = RequestState.handling;
        this.msgService.add({
          severity: 'success',
          summary: 'ערבות חדשה',
          detail: 'בקשה לערבות עודכנה בהצלחה'
        });
        resolve(updatedItem);


      }).catch((error)=> {
        console.error('error',error);

        this.msgService.add({
          severity: 'error',
          summary: 'ערבות חדשה',
          detail: 'בקשה לעדכון ערבות  נכשלה'
        });
        reject(error);

      })



    });
  };




  rejectRequest = (requestId, comment) => {
    return new Promise((resolve, reject)=> {
      // console.log('rejectRequest',requestId);
      if(comment == null) comment="NaN";
      this.rejectRequestEt(this.getGuaranteeRequestInstance(requestId), comment).then((result) => {
        // console.log('address is exist',requestId);
        let rejectedItem = this.mockRequests.find((item) => {
          return item.GRequestID === requestId;
        });
        rejectedItem.requestState = RequestState.rejected;

        resolve(rejectedItem);

      }).catch((error)=> {
        console.error('error',error);
        this.msgService.add({
          severity: 'error',
          summary: 'ערבות חדשה',
          detail: 'בקשה לדחית ערבות  נכשלה'
        });
        reject(error);

      })



    });
  };

  acceptRequest = (requestId, comment , hashcode) => {
    return new Promise((resolve, reject)=> {
       console.log('acceptRequest',requestId);
      this.acceptRequestEt(requestId).then((result) => {



        // find and change state of selected request
        let acceptedItem = this.mockRequests.find((item) => {
          return item.GRequestID === requestId;
        });
        acceptedItem.requestState = RequestState.accepted;

        resolve(acceptedItem);

      }).catch((error)=> {
        console.error('error',error);
        this.msgService.add({
          severity: 'error',
          summary: 'ערבות חדשה',
          detail: 'בקשה לאישור ערבות  נכשלה'
        });
        reject(error);


      })
    })
  };

  guaranteeSignComplite = (requestId, comment , hashcode):any => {
    return new Promise((resolve, reject)=> {

       console.log("before guaranteeSignComplite res",requestId, comment , hashcode);
      this.guaranteeSignCompliteEt(requestId, hashcode).then((result2) => {
        console.log("after guaranteeSignComplite result2",result2);


        // find and change state of selected request
        let acceptedItem = this.mockRequests.find((item) => {
          return item.GRequestID === requestId;
        });
        acceptedItem.requestState = RequestState.accepted;


        var startDate=acceptedItem.StartDate.split("/");
        var newstartDate=startDate[1]+"/"+startDate[0]+"/"+startDate[2];
        var endDate=acceptedItem.EndDate.split("/");
        var newsendDate=endDate[1]+"/"+endDate[0]+"/"+endDate[2];

        // alert(new Date(newDate).getTime())

        const startDatet=new Date(newstartDate).getTime()/1000;
        const endDatet=new Date(newsendDate).getTime()/1000;
        // console.log("guaranteeSignComplite ",acceptedItem.StartDate,startDatet,acceptedItem.EndDate,endDatet);

        // generate new guarantee
        let guarantee =  this.populateGuaranteeData(
          [ result2,
            acceptedItem.GRequestID,
            acceptedItem.GRequestID,
            acceptedItem.GRequestID,
            acceptedItem.GRequestID,
            this.web3.fromUtf8(this.getOneCustomerData(acceptedItem.customer).Name),
            this.web3.fromUtf8(acceptedItem.purpose),
            acceptedItem.amount,
            startDatet,
            endDatet,
            acceptedItem.indexType,
            acceptedItem.indexDate,
            GuaranteeState.Valid
          ]
        );

        this.mockGuarantees = [...this.mockGuarantees, guarantee];
        this.msgService.add({
          severity: 'success',
          summary: 'ערבות חדשה',
          detail: 'בוצע חשיפה לערבות חדשה בהצלחה'
        });
        resolve(guarantee);


      }).catch((error)=> {
        console.error('error',error);
        this.msgService.add({
          severity: 'error',
          summary: 'ערבות חדשה',
          detail: 'בקשה להוצאת האישור ערבות  נכשלה'
        });
        reject(error);

      })
    });
  };


  terminateGuatanty = (guaranteeId, requestId, comment , hashcode):any => {
    return new Promise((resolve, reject)=> {
       console.log('terminateGuatanty',requestId,guaranteeId,this.mockGuarantees);
      this.terminateGuaranteeEt(guaranteeId).then((result) => {
        console.log('terminateGuatanty - ',guaranteeId,this.getAllGuaranties(),result);
        // debugger;
        // find and change state of selected request
        let terminatedRequest = this.mockRequests.find((item) => {
          return item.GRequestID === requestId;
        });
        terminatedRequest.requestState = RequestState.terminationRequest;

        let terminatedGuarantee = this.mockGuarantees.find((item) => {
          return item.GuaranteeID === guaranteeId;
        });
        terminatedGuarantee.guaranteeState = GuaranteeState.Terminated;

        resolve({
          guarantee: terminatedGuarantee,
          request: terminatedRequest
        });

      }).catch((error)=> {
        console.error('error',error);
        this.msgService.add({
          severity: 'error',
          summary: 'ערבות חדשה',
          detail: 'בקשה לביטול ערבות  נכשלה'
        });
        reject(error);


      })
    })
  };




  getGuarantyHistory = (requestId):any => {
    return new Promise((resolve, reject)=> {
      this.getGuarantyHistoryEt(requestId).then((history)=>
      {
        console.log(history);
        resolve(history);
      }).catch((error)=> {
        console.error('error',error);
        this.msgService.add({
          severity: 'error',
          summary: 'ערבות חדשה',
          detail: 'בקשה לקבלת איסטוריה  נכשלה'
        });
        reject(error);


      })

    });
  };


  // getCustomerData = (customerAddress?) => {
  //   if (customerAddress == 'undefined')
  //     customerAddress=this.account;
  //   return this.getOneCustomerEt(customerAddress);
  // };




  createRequestEt =( userAccount , bankAccount, benefAccount ,fullname, purpose,
                     amount, StartDate, EndDate, indexType, indexDate,proposalIPFSHash) =>
  {
    var StartDateEt=Math.floor((StartDate/1000));
    var EndDateEt=Math.floor((EndDate/1000));
    var purposeEt=this.web3.fromUtf8(purpose);
    var fullnameEt=this.web3.fromUtf8(fullname);
    var proposalIPFSHashEt='0x'.concat(proposalIPFSHash);

    return (GuaranteeRequest.new(bankAccount,benefAccount,fullnameEt,purposeEt,amount,StartDateEt,EndDateEt,indexType, indexDate,proposalIPFSHashEt,{gas:4000000,from: userAccount}));
  };

  submitRequestEt =( userAccount ,guaranteeRequestInstance ,comments) => {
    console.log("submitRequest:",userAccount,guaranteeRequestInstance.address);
    return guaranteeRequestInstance.submit(comments,{from: userAccount});
  };

  withdrawalRequestEt = (guaranteeRequestInstance, comments,userAccount) => {
    // let requestInstance = getGuaranteeRequestInstance(requestId);
    // console.log("withdrawal:", userAccount, guaranteeRequestInstance.address);
    return guaranteeRequestInstance.withdrawal(comments, {from: userAccount});
  };


  getGuaranteeRequestInstance=(requestAddress) =>
  {
    return GuaranteeRequest.at(requestAddress);
  };



  addRequestEt=( userAccount , reqaddress) =>
  {
    return Regulator.deployed().then(function(instance) {
      return instance.addGuaranteeRequest(reqaddress,{from: userAccount});
    }).catch(function(error) {
      throw error;
    });
  };

  getRequestStateEt=( userAccount , guaranteeRequestInstance) =>{
    return guaranteeRequestInstance.getRequestState.call({from: userAccount});
  };

  getGuarantyStateEt =( userAccount , guaranteeInstance) =>{
    return guaranteeInstance.getGuaranteeState.call({from: userAccount});
  };


  guaranteeUpdate = (guatantyId, requestId, comment, amount, date):any => {
    return new Promise((resolve, reject)=> {

      // find and change state of selected request
      let unpdatedRequest = this.mockRequests.find((item) => {
        return item.GRequestID === requestId;
      });
      unpdatedRequest.amount = amount;
      unpdatedRequest.EndDate = date;

      let updatedGuarantee = this.mockGuarantees.find((item) => {
        return item.GuaranteeID === guatantyId;
      });
      updatedGuarantee.amount = amount;
      updatedGuarantee.EndDate = date;

      resolve({
        request: unpdatedRequest,
        guarantee: updatedGuarantee
      });
    });
  };






  updateRequestEt = (guaranteeRequestInstance, comment ,state) => {
    // עדכון של בנק
    // let guaranteeRequestInstance=getGuaranteeRequestInstance(requestId);
    return guaranteeRequestInstance.bankStateChange(comment,state,{from: this.account});
  };

  rejectRequestEt = (guaranteeRequestInstance, comment) => {
    // let guaranteeRequestInstance=getGuaranteeRequestInstance(requestId);
    return guaranteeRequestInstance.reject(comment,{from: this.account});
  };

  acceptRequestEt = (requestId) => {
    // אישור של בנק
    // if  (hashcode) {
    // let guaranteeRequestInstance=getGuaranteeRequestInstance(requestId);
    // return guaranteeRequestInstance.accept(comment)
    return Regulator.deployed()
      .then( (instance)=> {
        // console.log("acceptRequestEt requestId",requestId)
        return instance.acceptGuaranteeRequest(requestId,{from: this.account});

      }).catch(function (error) {
        throw error;
      })

  };


  guaranteeSignCompliteEt = (requestId,guaranteeIPFSHash) => {
    // אישור של
    // if  (hashcode) {
    var guaranteeIPFSHashEt='0x'.concat(guaranteeIPFSHash);
    const hashcodeBug='0xe04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f0fdc2';


    return Regulator.deployed()
      .then( (instance)=> {
        console.log("guaranteeSignCompliteEt",requestId,guaranteeIPFSHash);
        return instance.GuaranteeSignComplite(requestId,hashcodeBug,{from: this.account});
      }).then( (tx)=> {
        var guaranteeRequest = GuaranteeRequest.at(requestId);
        return guaranteeRequest.getGuaranteeAddress.call();


      }).catch(function (error) {
        console.error('error',error);
        throw error;
      })

  };


  terminateGuaranteeEt = (garantyId) => {

    return Regulator.deployed()
      .then( (instance) =>{
        console.log("terminateGuaranteeEt garantyId",garantyId);
        return instance.terminateGuarantee(garantyId,{from:this.account});
      }).catch(function (error) {
        throw error;
      })

  };

  changeGuaranteeEt = (gauranteeId,ammount,dateEnd) => {

    return Regulator.deployed()
      .then( (instance)=> {
        console.log("acceptRequestEt requestId",gauranteeId)
        return instance.changeGuarantee(gauranteeId,ammount,dateEnd);
      }).catch(function (error) {
        throw error;
      })

  };

  terminateGuatantyEt = (guaranteeId, requestId) => {
    return Regulator.deployed().then((instance)=> {
      return instance.terminateGuarantee.call(requestId,guaranteeId,{from: this.account})
    }).catch(function(error) {
      throw error;
    });

  };



  getGuarantyHistoryEt = (guaranteeAddress) => {

    return new Promise((resolve) => {


      var requestevents = [];
      var guarantee = DigitalGuaranteeBNHP.at(guaranteeAddress);
      var allevents = guarantee.allEvents({fromBlock: 0, toBlock: 'latest'})

      return allevents.get( (error, result)=> {

        // RegulatoryContractDeployed({}, {fromBlock: 0, toBlock: 'latest'}).get(function (error, result) {
        for (var i = result.length - 1; i >= 0; i--) {
          var cur_result = result[i];
          requestevents.push(this.populateHistoryLineData(cur_result.event, cur_result.args));
        }

        var replay=
        {
          shortguarantee: guaranteeAddress,
          log: requestevents
        };

        resolve(replay);

      })
    })
  };

  private populateHistoryLineData(event:any, args:any) {
    console.log("populateHistoryLineData",event, args);
    const pDate = (new Date(args.timestamp.valueOf() * 1000) ).toDateString();
    const state =args.curentstatus.valueOf();
    var comment_ = args.commentline;
    if (typeof(comment_) == "undefined") {
      comment_ =""
    }

    var ask= {
      eventname:event,
      date: pDate,
      state: state,
      comment: comment_


    };

    return ask;
  };


  getOneRequest =(requestAddress)=>  {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    return GuaranteeRequest.at(requestAddress)
      .then((guaranteeRequestinstance)=>  {
        // console.log("getOneRequest:get data");
        return guaranteeRequestinstance.getGuaranteeRequestData.call();
      }).then((result) =>{
         // console.log("getOneRequest:", result[7].valueOf(),result[8].valueOf());
        return this.populateRequestData(result);
      })
      .catch(function(e)  {
        console.log(e);
      });
  };






  populateBenefisiaryData=(benefisiaryID,resultArr) => {


    var ask= {
      beneficiaryID: benefisiaryID,
      Name: resultArr[0] ,
      Address: resultArr[1]
    };
    // console.log("request data:", ask);

    return ask;
  };

  populateRequestData=(resultArr)=>  {
    // console.log(resultArr);
    const startDate = this.transformDateSolToJS(resultArr[7].valueOf());
    const endDate = this.transformDateSolToJS(resultArr[8].valueOf());

    // const startDate = (new Date(resultArr[6] * 1000) ).toDateString();
    // const endDate = (new Date(resultArr[7] * 1000) ).toDateString();
    //  console.log('startDate1',resultArr[7] * 1000,startDate,'endDate1',resultArr[8] * 1000,endDate);
    const proposal=this.web3.toUtf8( resultArr[5]);
    const full_name=this.web3.toUtf8( resultArr[4]);

    var ask= {
      GRequestID: resultArr[0],
      customer: resultArr[1],
      beneficiary: resultArr[2],
      bank: resultArr[3],
      beneficiaryName: this.getBeneficiaryData(resultArr[2]).Name,
      fullName:full_name,
      purpose: proposal,
      amount: parseInt(resultArr[6].valueOf()),
      StartDate: startDate,
      EndDate: endDate,
      indexType: parseInt(resultArr[9].valueOf()),
      indexDate: parseInt(resultArr[10].valueOf()),
      requestState: parseInt(resultArr[11].valueOf())
    };
    // console.log("request data:", ask);

    return ask;
  };

  getAllBeneficiariesEt=()=> {
    // function getAllUserRequests() {
    /** Gets all guarantee requests for customer */
    let customerGuaranties=[];
    return Regulator.deployed()
      .then( (instance)=> {
        return instance.getBeneficiaryAddresses.call({from: this.account});
      }).then( (beneficiaryAddresses)=> {
        console.log("beneficiaryAddresses[]:", beneficiaryAddresses);
        return Promise.all(beneficiaryAddresses.map((beneficiaryAddress) => {
          return new Promise(resolve =>
            this.getOneBeneficiary(beneficiaryAddresses).then((returneddata) => resolve(returneddata)));
        }));


      }).catch(function (error) {
        throw error;
      })
  };

  getAllIssuers=() =>{
    // function getAllUserRequests() {
    /** Gets all guarantee requests for customer */
    let  issuers=[];
    return Regulator.deployed()
      .then( (instance)=> {
        return instance.getIssuerAddressesList.call({from: this.account});
      }).then( (issuersAddresses)=> {
        console.log("issuersAddresses[]:", issuersAddresses);
        return Promise.all(issuersAddresses.map((issuersAddress) => {
          return new Promise(resolve =>
            this.getOneIssuer(issuersAddresses).then((returneddata) => resolve(returneddata)));
        }));


      }).catch(function (error) {
        throw error;
      })
  };


  getAllUserRequestsEt=() =>{
    // function getAllUserRequests() {
    /** Gets all guarantee requests for customer */
    let customerGuaranties=[];
    return Regulator.deployed()
      .then( (instance)=> {
        return instance.getRequestAddressList.call();//({from: this.account});
      }).then( (guaranteeAddresses)=> {
        console.log("guaranteeRequestAddresses[]:", guaranteeAddresses);
        return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
          return new Promise(resolve =>
            this.getOneRequest(guaranteeAddress).then((returneddata) => resolve(returneddata)));
        }));


      }).catch(function (error) {
        throw error;
      })
  };
  // });

  getOneBeneficiary = (beneficiaryAddress) => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    return Regulator.deployed()
      .then( (instance)=> {
        return instance.getBeneficiary.call(beneficiaryAddress);
      }).then((result) =>{
        console.log("getBeneficiary:", result);
        return this.populateBenefisiaryData(beneficiaryAddress,result);
      })
      .catch(function(e)  {
        console.log(e);
      });
  };



  getOneCustomerEt =(customerAddress) => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    return Regulator.deployed()
      .then( (instance)=> {

        return instance.getCustomer.call(customerAddress);
      }).then((result)=> {
        console.log("getcustomer:", result);
        return this.populateCustomerAddressData(customerAddress,result);
      })
      .catch(function(e)  {
        console.log(e);
      });
  };

  getAllUserGuarantees=() =>{
     /** Gets all guarantee requests for customer */
    let customerGuaranties=[];
    return Regulator.deployed()
      .then( (instance)=> {
        return instance.getGuaranteeAddressesList.call({from: this.account});
      }).then( (guaranteeAddresses) =>{
        console.log("guaranteeAddresses[]:", guaranteeAddresses);
        return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
          return new Promise(resolve =>
            this.getOneGuarantee(guaranteeAddress).then((returneddata) => resolve(returneddata)));
        }));


      }).catch(function (error) {
        throw error;
      })
  };

  getOneGuarantee =(requestAddress) => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    return GuaranteeExtender.at(requestAddress)
      .then((guaranteeExtenderInstance)=>  {
        // console.log("getOneGuarantee:get data");
        return guaranteeExtenderInstance.getGuaranteeData.call();
      }).then((result) =>{
        // console.log("getOneGuarantee:", result);
        return this.populateGuaranteeData(result);
      })
      .catch(function(e)  {
        console.log(e);
      });
  };


  getOneIssuer= (issuerAddress) => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */

    return Regulator.deployed()
      .then( (instance) =>{
        return instance.getIssuer.call(issuerAddress);
      }).then((result)=> {
        console.log("getOneIssuer:", result);
        return this.populateIssuerAddressData(issuerAddress,result);
      })

      .catch(function(e)  {
        console.log(e);
      });
  };

  populateIssuerAddressData=(issuerId,resultArr)=>  {


    var ask= {
      bankID: issuerId,
      Name: resultArr[0] ,
      Address: resultArr[1]
    };

    // console.log("request data:", ask);

    return ask;
  };

  populateCustomerAddressData=(customerID,resultArr) => {


    var ask= {
      customerID: customerID,
      Name: resultArr[0],
      Address: resultArr[1]
    };

    // console.log("request data:", ask);

    return ask;
  };

  populateGuaranteeData=(resultArr) => {

    const startDatet = this.transformDateSolToJS(resultArr[8].valueOf());
    const endDatet = this.transformDateSolToJS(resultArr[9].valueOf());

     // console.log("dates",resultArr[8].valueOf(),startDatet,resultArr[9].valueOf(),endDatet);
    // const startDate = (new Date(resultArr[8].valueOf() * 1000) ).toDateString();
    // const endDate = (new Date(resultArr[9].valueOf() * 1000) ).toDateString();
    const indexDate=resultArr[11].valueOf();
    const proposal=this.web3.toUtf8( resultArr[6]);
    const full_name=this.web3.toUtf8( resultArr[5]);
    const state= resultArr[12].valueOf();
    // console.log("state",state,resultArr);
    var ask= {
      GuaranteeID: resultArr[0],
      GRequestID: resultArr[1],
      customer: resultArr[2],
      beneficiary: resultArr[4],
      bank: resultArr[3],
      customerName: this.getOneCustomerData(resultArr[2]).Name,
      StartDate: startDatet,
      EndDate: endDatet,
      amount: parseInt(resultArr[7].valueOf()),
      fullName:full_name,
      purpose: proposal,
      indexType: parseInt(resultArr[10].valueOf()),
      indexDate: parseInt(indexDate.valueOf()),
      guaranteeState: parseInt(state.valueOf())
    };


    // console.log("populateGuaranteeData:", ask);

    return ask;
  };



}
