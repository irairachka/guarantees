import { Injectable, isDevMode } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
import {MessageService} from "primeng/components/common/messageservice";
import {
  mockCustomerRequests, mockcustomers, mockCustomerGuaranties, bankData, userData ,
  mockBankRequests, mockBankGuaranties, mockbeneficiaries, mockexpandedRequest
} from "../../../tempData/mockData";
import {Beneficiary, Customer, Guarantee, GRequest, ExpandedGuarantee} from "../interfaces/request";
import {Observable} from "rxjs/Rx";
import {GuaranteeState, RequestState} from "../interfaces/enum";
import {MockService} from "./mock-etherium.service";
import {environment} from "../../environments/environment";
import {isNullOrUndefined} from "util";
// Import our contract artifacts and turn them into usable abstractions.
const GuaranteeRequest_artifact = require('../../../../build/contracts/GuaranteeRequest.json');
const Regulator_artifact = require('../../../../build/contracts/Regulator.json');
const DigitalGuaranteeBNHP_artifact = require('../../../../build/contracts/DigitalGuaranteeBNHP.json');
const GuaranteeRequestExtender_artifact = require('../../../../build/contracts/GuaranteeRequestExtender.json');
const GuaranteeExtender_artifact = require('../../../../build/contracts/GuaranteeExtender.json');
const ChangeGuaranteeRequest_artifact = require('../../../../build/contracts/ChangeGuaranteeRequest.json');

let Regulator = contract(Regulator_artifact);
let GuaranteeRequest = contract(GuaranteeRequest_artifact);
let DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);
let GuaranteeExtender = contract(GuaranteeExtender_artifact);
let GuaranteeRequestExtender = contract(GuaranteeRequestExtender_artifact);
let ChangeGuaranteeRequest= contract(ChangeGuaranteeRequest_artifact);

@Injectable()
export class RealService extends MockService {
  web3:any;
  // currentMockId: number = 1000;

  realRequests =[];
  realGuarantees =[];
  realCustomers =[];
  realBeneficiaries:any=[];
  realIssuers=[];

  accounts:any;
  account:any;
  // ready:boolean=false;


  constructor(public msgService:MessageService) {
    super(msgService);
      this.checkAndInstantiateWeb3();
      this.onReady();
    console.log("end of constructor");
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
    ChangeGuaranteeRequest.setProvider(this.web3.currentProvider);


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
      // this.ready=true;
      console.log('this.account',this.account)
      console.log('this.accounts',this.accounts)
      /** Part of original truffle **/
      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      // this._ngZone.run(() => {

      this.getAllBeneficiaries();
      this.getBankData(this.account);
      this.getCustomerData(this.account);


        // this.getAllRequests();
        // this.getAllGuaranties();

      // });
    });
  };

  lasyInit=()=>{
    return new Promise((resolve, reject)=> {
      this.web3.eth.getAccounts((err, accs) => {
        if (err != null) {
          reject('תקלת תקשורת');
          return;
        }

        if (accs.length === 0) {
          reject(
            'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
          );
          return;
        }
        this.accounts = accs;
        this.account = this.accounts[0];
        resolve(this.account);

      });
    })
  };

  /************************/
  /**  replaced   ****/
  /************************/

  getAllRequests = (customerAddress=this.account) =>{

    // /** Gets all guarantee requests for customer */
    // return new Promise((resolve, reject)=> {
    //     console.log("getAllUserRequestsEt in getAllRequests()",this.account);
    // debugger;
    return Regulator.deployed()
      .then( (instance)=> {
        console.log('instance.getRequestAddressList.call({from: useraccount} from acc:',instance.address,customerAddress);
        return instance.getRequestAddressList.call({from: customerAddress});
      }).then( (guaranteeAddresses)=> {
        console.log("guaranteeRequestAddresses[]:", guaranteeAddresses);
        return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
          return new Promise(resolve =>
            this.getOneRequest(guaranteeAddress).then((returneddata) => resolve(returneddata)));
        }))
      }).then((requestsEt)=> {
        this.realRequests=[ ...requestsEt];
        super.setMockRequests(this.realRequests);
        return this.realRequests;
      }).catch(function (error) {
        console.error(error);
        throw error;
      });

  };


  // getAllRequests = ()=> {
  //
  //    // if (this.realRequests==null)
  //    // {
  //     /** Gets all guarantee requests for customer */
  //     return new Promise((resolve, reject)=> {
  //       console.log("getAllUserRequestsEt in getAllRequests()",this.account);
  //       // debugger;
  //       this.getAllUserRequestsEt(this.account).then((requestsEt)=> {
  //         this.realRequests=[ ...requestsEt];
  //         super.setMockRequests(this.realRequests);
  //         resolve(this.realRequests);
  //       }).catch((error)=> {
  //
  //         this.msgService.add({
  //           severity: 'error',
  //           summary: 'תקלת בבלוקציין',
  //           detail: 'Etherium Fatal Error!!!'
  //         });
  //         reject(error);
  //       });
  //
  //     });
  //    // }
  //   // else
  //   //   new Promise((resolve, reject)=> {
  //   //     resolve(this.mockRequests);
  //   //   });
  // };


  getAllUserRequests(customerAddress=this.account)
  {

    // return new Promise((resolve, reject)=> {

    return this.getAllRequests( ).then((realRequests)=> {
      return realRequests
        .filter(function (element) {
          return (element.customer === customerAddress);

        });
    }).catch(function (error) {
      console.error(error);
      throw error;
    })

  };

  getAllBankRequests( bankAddress=this.account)
  {

    // return new Promise((resolve, reject)=> {

    return this.getAllRequests(bankAddress).then((realRequests)=> {
      return realRequests
        .filter(function (element) {
          return (element.bank === bankAddress);

        });
    }).catch(function (error) {
      console.error(error);
      throw error;
    })

  };

  getAllGuaranties = (customerAddress = this.account) => {
    return Regulator.deployed()
      .then((instance)=> {
        console.log('instance.getRequestAddressList.call({from: useraccount} from acc:', instance.address, customerAddress ,this.account);
        return instance.getGuaranteeAddressesList.call({from: customerAddress});
      }).then((guaranteeAddresses)=> {
        console.log("guaranteeAddresses[]:", guaranteeAddresses);
        return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
          return new Promise(resolve =>
            this.getOneGuarantee(guaranteeAddress).then((returneddata) => resolve(returneddata)));
        }))
      }).then((guaranteeEt)=> {
        //     console.log("getBeneficiaryEt " ,requestsEt);
        this.realGuarantees = [ ...guaranteeEt];
        super.setMockGuarantee(this.realGuarantees);
        return this.realGuarantees;
      }).catch(function (error) {
        console.error(error);
        throw error;
      });

  };

  getAllCustomerGuaranties(customerAddress=this.account) {

    return this.getAllGuaranties(customerAddress).then((realRequests)=> {
      return realRequests
        .filter(function (element) {
          return (element.customer === customerAddress);

        });
    }).catch(function (error) {
      console.error(error);
      throw error;
    })

  };

  getAllBeneficiaryGuarantees(beneficiaryAddress=this.account) {

    return this.getAllGuaranties(beneficiaryAddress).then((realRequests)=> {
      return realRequests
        .filter(function (element) {
          return (element.beneficiary === beneficiaryAddress);

        });
    }).catch(function (error) {
      console.error(error);
      throw error;
    })

  };

  getAllBankGuaranties (bankAddress=this.account)
  {


    return this.getAllGuaranties(bankAddress).then((realRequests)=> {
      return realRequests
        .filter(function (element) {
          return (element.bank === bankAddress);

        });
    }).catch(function (error) {
      console.error(error);
      throw error;
    })

  };


  // getAllGuaranties = (customerAddress=this.account) => {
  //   // if (this.realGuarantees==null) {
  //     return new Promise((resolve, reject)=> {
  //       this.getAllUserGuarantees(this.account).then((GuarantiesEt)=> {
  //         this.realGuarantees = [ ...GuarantiesEt];
  //         super.setMockGuarantee(this.realGuarantees);
  //         resolve(this.realGuarantees);
  //       }).catch((error)=> {
  //         this.msgService.add({
  //           severity: 'error',
  //           summary: 'תקלת בבלוקציין',
  //           detail: 'Etherium Fatal Error!!!'
  //         });
  //         reject(error);
  //       });
  //     });
  //   // }
  //   // else
  //   //   new Promise((resolve, reject)=> {
  //   //     resolve(this.mockGuarantees);
  //   //   });
  //
  // };


  /************************/
  /**  Get User Data   ****/
  /************************/

  getCustomerData = (customerAddress?) => {
    // debugger;
    return new Promise((resolve, reject)=> {
      if (isNullOrUndefined(customerAddress )) {
        if (!isNullOrUndefined(this.account)) {
          customerAddress = this.account;
        }
        else {
          console.log('customerAddress and this.account is undefined', customerAddress, this.account);
          //todo to delete
          return this.lasyInit().then((customerAddress2)=> {
            // console.log('lasyInit done :',customerAddress);
            customerAddress = this.account;
          });
        }
      }

      for (var i in this.realCustomers) {
        if (this.realCustomers[i].customerID == customerAddress) {
          resolve(this.realCustomers[i]);
        }
      }


      this.getOneCustomerEt(customerAddress).then((loadCustomer)=> {
        // this.realCustomers.add(loadCustomer)
        // console.log(this);
        this.realCustomers = [...this.realCustomers, loadCustomer];
        resolve(loadCustomer);
      }).catch((error)=> {

        this.msgService.add({
          severity: 'error',
          summary: 'תקלת בבלוקציין',
          detail: 'Etherium Fatal Error!!!'
        });
        reject(error);
      });

    });
  };


  getOneCustomerEt =(customerAddress) => {

    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    return Regulator.deployed()
      .then( (instance)=> {
        console.log("getcustomer:customerAddress", customerAddress);
        return instance.getCustomer.call(customerAddress , {from: this.account});
      }).then((result) =>{
        console.log("getcustomer:", result);
        return this.populateCustomerAddressData(customerAddress,result);
      })
      .catch((e)  =>{
        console.log(e);
      });
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



  /** ****************** **/
  /**  Get Bank Data     **/
  /** ****************** **/

  getBankData = (customerAddress?) => {
    // debugger;
    return new Promise((resolve, reject)=> {
      if (isNullOrUndefined(customerAddress )) {
        if (!isNullOrUndefined(this.account)) {
          customerAddress = this.account;
        }
        else {
          console.log('customerAddress and this.account is undefined', customerAddress, this.account);
          //todo to delete
          return this.lasyInit().then((customerAddress1)=> {
            customerAddress = this.account;
            // console.log('lasyInit done :',customerAddress);
            // return this.getIssierEt(customerAddress).then((loadCustomer)=> {
            //   // this.realCustomers.add(loadCustomer)
            //   // console.log(this);
            //   this.realIssuers = [...this.realIssuers, loadCustomer];
            //   resolve(loadCustomer);
            // });
          });
        }
      }

      for (var i in this.realIssuers) {
        if (this.realIssuers[i].bankID == customerAddress) {
          resolve(this.realIssuers[i]);
        }
      }


      this.getIssierEt(customerAddress).then((loadCustomer)=> {
        // this.realCustomers.add(loadCustomer)
        // console.log(this);
        this.realIssuers = [...this.realIssuers, loadCustomer];
        resolve(loadCustomer);
      }).catch((error)=> {

        this.msgService.add({
          severity: 'error',
          summary: 'תקלת בבלוקציין',
          detail: 'Etherium Fatal Error!!!'
        });
        reject(error);
      });

    });
  };



  // getBankData = (requestAddress?) => {
  //
  //   return new Promise((resolve) => {
  //     if (isNullOrUndefined(requestAddress )) {
  //       if (isNullOrUndefined(this.account ))
  //       {
  //         return this.lasyInit().then((requestAddress)=>{
  //           return this.getOneIssuerDataP(requestAddress);
  //         })
  //         // //todo to delete
  //         // resolve(bankData);
  //         // return;
  //
  //       }
  //       else
  //         requestAddress = this.account;
  //     }
  //     return this.getOneIssuerDataP(requestAddress);
  //   });
  //
  //
  // };
  //
  // getAllBankRequests = () => {
  //   /** Gets all guarantee requests for customer */
  //   /** parses the data and sends to UI          */
  //   return this.getAllRequests();
  // };



  // getAllBankGuaranties = () => {
  //   return this.getAllGuaranties();
  // };



  getAllIssuersEt=() =>{
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
            this.getBankData(issuersAddresses).then((returneddata) => resolve(returneddata)));
        }));


      }).catch(function (error) {
        throw error;
      })
  };


  // getOneIssuerDataP = (bankID):any => {
  //   return new Promise((resolve, reject)=> {
  //     for (var i in this.realIssuers) {
  //       if (this.realIssuers[i].bankID == bankID) {
  //         resolve(this.realIssuers[i]);
  //       }
  //     }
  //
  //     this.getIssierEt(bankID).then((loadIssuer)=> {
  //       this.realIssuers = [...this.realIssuers, loadIssuer];
  //       resolve(loadIssuer);
  //     }).catch((error)=> {
  //
  //       this.msgService.add({
  //         severity: 'error',
  //         summary: 'תקלת בבלוקציין',
  //         detail: 'Etherium Fatal Error!!!'
  //       });
  //       reject(error);
  //     });
  //
  //   });
  // };

  getIssierEt =(issierAddress) => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    return Regulator.deployed()
      .then( (instance)=> {

        return instance.getIssuer.call(issierAddress, {from: this.account});
      }).then((result)=> {
        console.log("issier:", result);
        return this.populateIssuerData(issierAddress,result);
      })
      .catch((e)  =>{
        console.log(e);
      });
  };

  populateIssuerData=(issierID,resultArr) => {


    var ask= {
      bankID: issierID,
      Name: resultArr[0],
      Address: resultArr[1]
    };

    // console.log("request data:", ask);

    return ask;
  };


  /** ************************* **/
  /**  Get Beneficiary Data     **/
  /** ************************* **/

  getAllBeneficiaries = () => {
    return this.getAllBeneficiariesEt();
  };

  getAllBeneficiariesEt=()=> {
    // function getAllUserRequests() {
    /** Gets all guarantee requests for customer */
    // let customerGuaranties=[];
    return Regulator.deployed()
      .then( (instance)=> {
        return instance.getBeneficiaryAddresses.call({from: this.account});
      }).then( (beneficiaryAddresses)=> {
        console.log("beneficiaryAddresses[]:", beneficiaryAddresses);
        return Promise.all(beneficiaryAddresses.map((beneficiaryAddress) => {
          return new Promise(resolve =>
            this.getOneBeneficiaryDataP(beneficiaryAddress).then((returneddata) => resolve(returneddata)));
        }));
      }).then((returneddata)=> {
        console.log("this.realBeneficiaries= " ,this.realBeneficiaries);
        this.realBeneficiaries = [ ...returneddata];
        return this.realBeneficiaries;
      }).catch(function (error) {
        throw error;
      })
  };

  // getAllBeneficiaryGuaranties = () => {
  //   return this.getAllGuaranties();
  // };


  getBeneficiaryData = (BeneficiaryAddress?) => {
    if (isNullOrUndefined(BeneficiaryAddress )) {
      if (isNullOrUndefined(this.account ))
      {
        BeneficiaryAddress =this.web3.eth.getAccounts[0];

      }
      else
        BeneficiaryAddress = this.account;
    }
    return this.getOneBeneficiaryDataP(BeneficiaryAddress);

  };


  getOneBeneficiaryDataP = (beneficiaryID):any => {
    return new Promise((resolve, reject)=> {
      for (var i in this.realBeneficiaries) {
        if (this.realBeneficiaries[i].beneficiaryID == beneficiaryID) {
          console.log("getOneBeneficiaryDataP check :",typeof(this.realBeneficiaries[i].beneficiaryID),typeof(beneficiaryID),this.realBeneficiaries[i].beneficiaryID , beneficiaryID , this.realBeneficiaries[i].beneficiaryID == beneficiaryID ,this.realBeneficiaries[i].beneficiaryID === beneficiaryID);

          resolve(this.realBeneficiaries[i]);
        }
      }
      console.log("getOneBeneficiaryDataP b not found :",beneficiaryID , typeof(beneficiaryID) , " in ", this.realBeneficiaries);
      this.getBeneficiaryEt(beneficiaryID).then((loadBeneficiaries)=> {
        this.realBeneficiaries = [...this.realBeneficiaries, loadBeneficiaries];
        console.log("this.realBeneficiaries :",this.realBeneficiaries);
        resolve(loadBeneficiaries);
      }).catch((error)=> {

        this.msgService.add({
          severity: 'error',
          summary: 'תקלת בבלוקציין',
          detail: 'Etherium Fatal Error!!!'
        });
        reject(error);
      });

    });
  };


  getBeneficiaryEt =(beneficiaryAddress) => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    return Regulator.deployed()
      .then( (instance)=> {

        return instance.getBeneficiary.call(beneficiaryAddress);
      }).then((result)=> {
        console.log("getBeneficiaryEt:", beneficiaryAddress,result);
        return this.populateBeneficiaryData(beneficiaryAddress,result);
      })
      .catch(function(e)  {
        console.log(e);
      });
  };


  populateBeneficiaryData=(benefisiaryID,resultArr) => {

    if (Array.isArray(benefisiaryID)) benefisiaryID=benefisiaryID[0];
    var ask= {
      beneficiaryID: benefisiaryID,
      Name: resultArr[0] ,
      Address: resultArr[1]
    };
     // console.log("populateBeneficiaryData :", ask,resultArr);

    return ask;
  };



  /** ************************* **/
  /**  request operations       **/
  /** ************************* **/



  createRequest( userId , bankId, benefId , purpose,
                 amount, StartDate, EndDate, indexType, indexDate ) {


    return new Promise((resolve, reject)=> {


      // let  requestAddr;
      // let instance ;
      let addressOfIns;
      const thestartDate =  this.transformDateJSToSol(StartDate);
      const theendDate = this.transformDateJSToSol(EndDate) ;
      console.log("createRequest ",userId, bankId, benefId, "full name", purpose,
        amount, thestartDate, theendDate, indexType, indexDate);

      // debugger;
      return this.createRequestEt(userId, bankId, benefId, "full name", purpose,
        amount, thestartDate, theendDate, indexType, indexDate, 'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f0fdc2')
        .then((theinstance) => {
          // instance=theinstance;
          addressOfIns=theinstance.address;
          console.log("Request created with address",addressOfIns);

          return this.populateRequestDataP(
            [addressOfIns,
            userId,
            bankId,
            benefId,
            this.web3.fromUtf8(''),
            this.web3.fromUtf8(purpose),
            amount,
            thestartDate,
            theendDate,
            indexType,
            indexDate,
            RequestState.created,
            false,
            ''
          ]
        );
      }).then((newItem)=> {

          return this.addRequestEt(this.account, addressOfIns);
      }).then((result) => {
          // requestAddr=result;
          // console.log("addRequestEt result", instance);

          return this.submitRequestEt(this.account, this.getGuaranteeRequestInstance(addressOfIns), '');
      }).then((result) => {

          console.log("submitRequestEt result", addressOfIns, " <> ",
            userId," <> ",
            bankId," <> ",
            benefId);

          return this.populateRequestDataP(
            [addressOfIns,
              userId,
              bankId,
              benefId,
              this.web3.fromUtf8(''),
              this.web3.fromUtf8(purpose),
              amount,
              thestartDate,
              theendDate,
              indexType,
              indexDate,
              RequestState.waitingtobank,
              false,
              ''
            ]
          );
      }).then((newItem)=> {

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
              severity: 'error',
              summary: 'ערבות חדשה',
              detail: 'בקשה לערבות חדשה נכשלה'
            });
            reject(error);
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





  acceptRequest = (requestId, comment , hashcode):any => {
    return new Promise((resolve, reject)=> {
       console.log('acceptRequest',requestId);
      this.acceptRequestEt(requestId).then((result) => {


        // find and change state of selected request
        let acceptedItem = this.mockRequests.find((item) => {
          return item.GRequestID === requestId;
        });
        acceptedItem.requestState = RequestState.accepted;

        if (acceptedItem.ischangeRequest)
        {
          let terminatedGuarantee = this.mockGuarantees.find((item) => {
            return item.GRequestID === acceptedItem.changeRequest;
          });
          terminatedGuarantee.guaranteeState = GuaranteeState.Terminated;

          // console.log('acceptRequest',acceptedItem.ischangeRequest,terminatedGuarantee,acceptedItem);
          resolve({
            terminatedguarantee: terminatedGuarantee,
            request: acceptedItem
          });
        }
        else
        {
          // console.log('acceptRequest',acceptedItem.ischangeRequest,null,acceptedItem);

          resolve({
            terminatedguarantee: null,
            request: acceptedItem
          });
        }


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




  createRequestEt =( userAccount , bankAccount, benefAccount ,fullname, purpose,
                     amount, StartDate, EndDate, indexType, indexDate,proposalIPFSHash) =>
  {
    // var StartDateEt=Math.floor((StartDate/1000));
    // var EndDateEt=Math.floor((EndDate/1000));
    if (purpose === 'undefined' || purpose==null)
      purpose='';
    var purposeEt=this.web3.fromUtf8(purpose);
    var fullnameEt=this.web3.fromUtf8(fullname);
    var proposalIPFSHashEt='0x'.concat(proposalIPFSHash);
    console.log( "createRequestEt",bankAccount,benefAccount);
    return (GuaranteeRequest.new(bankAccount,benefAccount,fullnameEt,purposeEt,amount,StartDate,EndDate,indexType, indexDate,proposalIPFSHashEt,{gas:5700000,from: userAccount}));
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




  getRequestHistoryEt = (requestAddress) => {

    return new Promise((resolve) => {


      var requestevents = [];
      var guaranteeRequest = GuaranteeRequest.at(requestAddress);
      var allevents = guaranteeRequest.allEvents({fromBlock: 0, toBlock: 'latest'})

      if (allevents.length>0)
        return allevents.get( (error, result) => {

          // RegulatoryContractDeployed({}, {fromBlock: 0, toBlock: 'latest'}).get(function (error, result) {
          for (var i = result.length - 1; i >= 0; i--) {
            var cur_result = result[i];
            // console.log('getRequestHistoryEt',cur_result);
            let line = this.populateHistoryLineData(cur_result.event, cur_result.args);
            if (!isNullOrUndefined(line))
              requestevents.push(line);
          }


          var replay =
          {
            shortrequest: requestAddress,
            log: requestevents
          };

          resolve(replay);

        })
      else {
        guaranteeRequest = ChangeGuaranteeRequest.at(requestAddress);
        allevents = guaranteeRequest.allEvents({fromBlock: 0, toBlock: 'latest'});

        return allevents.get((error, result) => {

          // RegulatoryContractDeployed({}, {fromBlock: 0, toBlock: 'latest'}).get(function (error, result) {
          for (var i = result.length - 1; i >= 0; i--) {
            var cur_result = result[i];
            // console.log('getRequestHistoryEt',cur_result);
            let line = this.populateHistoryLineData(cur_result.event, cur_result.args);
            if (!isNullOrUndefined(line))
              requestevents.push(line);
          }
          var replay =
          {
            shortrequest: requestAddress,
            log: requestevents
          };

          resolve(replay);
        });
      }


    })
  };


  /** ************************* **/
  /**  guarantee operations       **/
  /** ************************* **/



  guaranteeSignComplite = (requestId, comment , hashcode):any => {
    return new Promise((resolve, reject)=> {

       console.log("before guaranteeSignComplite res",requestId, comment , hashcode);
      this.guaranteeSignCompliteEt(requestId, hashcode,this.account).then((result2) => {
        console.log("after guaranteeSignComplite result2",result2);

        if (result2 =='0x0000000000000000000000000000000000000000')
        {
          this.msgService.add({
            severity: 'error',
            summary: 'ערבות חדשה',
            detail: 'בקשה להוצאת האישור ערבות  נכשלה'
          });
          reject('בקשה להוצאת האישור ערבות  נכשלה');
          return;
        }

        // find and change state of selected request
        let acceptedItem = this.mockRequests.find((item) => {
          return item.GRequestID === requestId;
        });
        acceptedItem.requestState = RequestState.accepted;



        // var startDate=acceptedItem.StartDate.split("/");
        // var newstartDate=startDate[1]+"/"+startDate[0]+"/"+startDate[2];
        // var endDate=acceptedItem.EndDate.split("/");
        // var newsendDate=endDate[1]+"/"+endDate[0]+"/"+endDate[2];

        // alert(new Date(newDate).getTime())

        const startDatet=this.transformDateJSToSol(acceptedItem.StartDate);
          // new Date(newstartDate).getTime()/1000;
        const endDatet=this.transformDateJSToSol(acceptedItem.EndDate);
          // new Date(newsendDate).getTime()/1000;
        // console.log("guaranteeSignComplite ",acceptedItem.StartDate,startDatet,acceptedItem.EndDate,endDatet);

        this.getOneCustomerDataP(acceptedItem.customer).then((customer)=>
        {


          // generate new guarantee
          let guarantee =  this.populateGuaranteeDataP(
            [ result2,
              requestId,
              acceptedItem.customer,
              acceptedItem.bank,
              acceptedItem.beneficiary,
              this.web3.fromUtf8(customer.Name),
              this.web3.fromUtf8(acceptedItem.purpose),
              acceptedItem.amount,
              startDatet,
              endDatet,
              acceptedItem.indexType,
              acceptedItem.indexDate,
              GuaranteeState.Valid
            ]
          ).then((guarantee)=>{
            this.mockGuarantees = [...this.mockGuarantees, guarantee];
            this.msgService.add({
              severity: 'success',
              summary: 'ערבות חדשה',
              detail: 'בוצע חשיפה לערבות חדשה בהצלחה'
            });
            resolve(guarantee);
          });




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
  });
  };





  terminateGuatanty = (guaranteeId, requestId, comment , hashcode,customerAddress=this.account):any => {
    return new Promise((resolve, reject)=> {
       console.log('terminateGuatanty',requestId,guaranteeId,this.mockGuarantees);
      this.terminateGuaranteeEt(this.account,guaranteeId).then((result) => {
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


  guaranteeUpdate = (guatantyId, requestId, comment, amount, date ,customerAddress=this.account):any => {
    return new Promise((resolve, reject)=> {

      // find and change state of selected request
      let unpdateRequest = this.mockRequests.find((item) => {
        return item.GRequestID === requestId;
      });


      if (date ==='undefined' || date =='')
        date=unpdateRequest.EndDate;

       console.log('guaranteeUpdate',date,this.transformDateJSToSol(date) );
      this.changeGuaranteeEt(customerAddress,guatantyId,amount,this.transformDateJSToSol(date) )
        .then((newRequestAddress) => {

        // make new request
        this.populateRequestDataP(
          [ newRequestAddress,
            unpdateRequest.customer,
            unpdateRequest.bank,
            unpdateRequest.beneficiary,
            this.web3.fromUtf8(unpdateRequest.fullName),
            this.web3.fromUtf8(unpdateRequest.purpose),
            amount,
            this.transformDateJSToSol(unpdateRequest.StartDate),
            this.transformDateJSToSol(date),
            // new Date(unpdateRequest.StartDate).getTime()/1000,
            // new Date(date).getTime()/1000,
            unpdateRequest.indexType,
            unpdateRequest.indexDate,
            RequestState.waitingtobank,
            true,
            requestId
          ]
        ).then((newItem) => {


          this.mockRequests = [...this.mockRequests, newItem];
          this.msgService.add({severity: 'success', summary: 'שינוי ערבות', detail: 'בקשה לשינוי הערבות  נשלחה בהצלחה'});

          resolve(newItem);



        }).catch((error)=> {
          console.error('error',error);
          this.msgService.add({
            severity: 'error',
            summary: 'ערבות חדשה',
            detail: 'בקשה לביטול ערבות  נכשלה'
          });
          reject(error);


        })
      }).catch((error)=> {
        console.error('error',error);
        this.msgService.add({
          severity: 'error',
          summary: 'ערבות חדשה',
          detail: 'בקשה לביטול ערבות  נכשלה'
        });
        reject(error);


      })
    });
  };


  getRequestHistory = (requestAddress):any => {
    console.log('getRequestHistory');
    return new Promise((resolve, reject)=> {
      this.getRequestHistoryEt(requestAddress).then((history)=>
      {
        console.log(history);
        resolve(history);
      }).catch((error)=> {
        console.error('error',error);
        this.msgService.add({
          severity: 'error',
          summary: 'ערבות חדשה',
          detail: 'בקשה לקבלת פירוט נכשלה'
        });
        reject(error);


      })

    });
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
          detail: 'בקשה לקבלת פירוט נכשלה'
        });
        reject(error);


      })

    });
  };






  getGuarantyStateEt =( userAccount , guaranteeInstance) =>{
    return guaranteeInstance.getGuaranteeState.call({from: userAccount});
  };



  guaranteeAddressFromRequestEt = (requestId) => {

    var guaranteeRequest = GuaranteeRequest.at(requestId);
    return guaranteeRequest.getGuaranteeAddress.call();


  };


  guaranteeSignCompliteEt = (requestId,guaranteeIPFSHash,account) => {
    // אישור של
    // if  (hashcode) {
    var guaranteeIPFSHashEt='0x'.concat(guaranteeIPFSHash);
    const hashcodeBug='0xe04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f0fdc2';


    return Regulator.deployed()
      .then( (instance)=> {
        console.log("guaranteeSignCompliteEt + this.account", requestId, guaranteeIPFSHash, account);
        // requestId='0x7e228709e104d55932bc61de79bac564724d0a89';
        // console.log("new in testguaranteeSignCompliteEt + this.account", requestId, guaranteeIPFSHash, account);
        return instance.GuaranteeSignComplite(requestId, hashcodeBug, {gas: 5700000 ,from: account});
      }).then( (tx)=> {
        console.log("testguaranteeSignCompliteEt  resault", tx);
        return this.guaranteeAddressFromRequestEt(requestId);
      }).catch(function (error) {
        console.error('error',error);
        throw error;
      })

  };


  terminateGuaranteeEt = (userAccount,garantyId) => {

    return Regulator.deployed()
      .then( (instance) =>{
        console.log("terminateGuaranteeEt garantyId",garantyId);
        return instance.terminateGuarantee(garantyId,{from:userAccount});
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
          let line=this.populateHistoryLineData(cur_result.event, cur_result.args);
          if (!isNullOrUndefined(line))
            requestevents.push(line);
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

   populateHistoryLineData =(event:any, args:any) => {
    console.log("populateHistoryLineData",event, args);
     if (!isNullOrUndefined(event) && !isNullOrUndefined(args))
       {

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

       }

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
        return this.populateRequestDataP(result);
      })
      .catch(function(e)  {
        console.log(e);
      });
  };



  // getBeneficiaryData = (id) => {
  //   return mockbeneficiaries[0];
  // };




  populateRequestDataP=(resultArr)=>  {
   return  new Promise((resolve,reject) =>
    {

      const startDate = this.transformDateSolToJS(resultArr[7].valueOf());
      const endDate = this.transformDateSolToJS(resultArr[8].valueOf());

      // const startDate = (new Date(resultArr[6] * 1000) ).toDateString();
      // const endDate = (new Date(resultArr[7] * 1000) ).toDateString();
      //  console.log('startDate1',resultArr[7] * 1000,startDate,'endDate1',resultArr[8] * 1000,endDate);
      const proposal=this.web3.toUtf8( resultArr[5]);
      const full_name=this.web3.toUtf8( resultArr[4]);
      const ischangeRequest=(resultArr[12] === 'true' || resultArr[12] == true);
      const changeRequestId=((resultArr[12] == true && resultArr[13] !== undefined )? resultArr[13] : '') ;

      // console.log("populateRequestDataP",resultArr);

      this.getOneBeneficiaryDataP(resultArr[3]).then((beneficiary)=> {

        var ask = {
          GRequestID: resultArr[0],
          customer: resultArr[1],
          bank: resultArr[2],
          beneficiary: resultArr[3],
          beneficiaryName: beneficiary.Name,
          fullName: full_name,
          purpose: proposal,
          amount: parseInt(resultArr[6].valueOf()),
          StartDate: startDate,
          EndDate: endDate,
          indexType: parseInt(resultArr[9].valueOf()),
          indexDate: parseInt(resultArr[10].valueOf()),
          requestState: parseInt(resultArr[11].valueOf()),
          ischangeRequest: ischangeRequest,
          changeRequest: changeRequestId
          // ischangeRequest: (resultArr[12] === 'true')
        };
        // console.log("request data:", ask);


        resolve(ask) ;
      }).catch((error)=> {

        // this.msgService.add({
        //   severity: 'error',
        //   summary: 'תקלת בבלוקציין',
        //   detail: 'Etherium Fatal Error!!!'
        // });
        reject(error);
      });

  });
  };





  getAllUserRequestsEt=(useraccount) =>{
    // function getAllUserRequests() {
    /** Gets all guarantee requests for customer */
    // let customerGuarantie=[];
    return Regulator.deployed()
      .then( (instance)=> {
        return instance.getRequestAddressList.call({from: useraccount});
      }).then( (guaranteeAddresses)=> {
        console.log("guaranteeRequestAddresses[]:", guaranteeAddresses);
        return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
          return new Promise(resolve =>
            this.getOneRequest(guaranteeAddress).then((returneddata) => resolve(returneddata)));
        }));


      }).catch(function (error) {
        console.error(error);
        throw error;
      })
  };
  // });

  // getOneBeneficiary = (beneficiaryAddress) => {
  //   /** Gets one guarantee requests by id */
  //   /** parses the data and sends to UI */
  //   return Regulator.deployed()
  //     .then( (instance)=> {
  //       return instance.getBeneficiary.call(beneficiaryAddress);
  //     }).then((result) =>{
  //       console.log("getBeneficiary:", result);
  //       return this.populateBeneficiaryData(beneficiaryAddress,result);
  //     })
  //     .catch(function(e)  {
  //       console.log(e);
  //     });
  // };



  getOneGuarantee =(requestAddress) => {
    /** Gets one guarantee requests by id */
    /** parses the data and sends to UI */
    return GuaranteeExtender.at(requestAddress)
      .then((guaranteeExtenderInstance)=>  {
        // console.log("getOneGuarantee:get data");
        return guaranteeExtenderInstance.getGuaranteeData.call();
      }).then((result) =>{
        // console.log("getOneGuarantee:", result);
        return this.populateGuaranteeDataP(result);
      })
      .catch(function(e)  {
        console.log(e);
      });
  };







  populateGuaranteeDataP=(resultArr) => {

    return new Promise((resolve, reject)=> {

      const startDatet = this.transformDateSolToJS(resultArr[8].valueOf());
      const endDatet = this.transformDateSolToJS(resultArr[9].valueOf());

      // console.log("dates",resultArr[8].valueOf(),startDatet,resultArr[9].valueOf(),endDatet);
      // const startDate = (new Date(resultArr[8].valueOf() * 1000) ).toDateString();
      // const endDate = (new Date(resultArr[9].valueOf() * 1000) ).toDateString();
      const indexDate = resultArr[11].valueOf();
      const proposal = this.web3.toUtf8(resultArr[6]);
      const full_name = this.web3.toUtf8(resultArr[5]);
      const state = resultArr[12].valueOf();
      // console.log("state",state,resultArr);

      this.getOneCustomerDataP(resultArr[2]).then((customer)=> {


        var ask = {
          GuaranteeID: resultArr[0],
          GRequestID: resultArr[1],
          customer: resultArr[2],
          beneficiary: resultArr[4],
          bank: resultArr[3],
          customerName: customer.Name,
          StartDate: startDatet,
          EndDate: endDatet,
          amount: parseInt(resultArr[7].valueOf()),
          fullName: full_name,
          purpose: proposal,
          indexType: parseInt(resultArr[10].valueOf()),
          indexDate: parseInt(indexDate.valueOf()),
          guaranteeState: parseInt(state.valueOf())
        };


        // console.log("populateGuaranteeData:", ask);

        resolve(ask);
      }).catch((error)=> {

        this.msgService.add({
          severity: 'error',
          summary: 'תקלת בבלוקציין',
          detail: 'Etherium Fatal Error!!!'
        });
        reject(error);
      });
    });
  };


  changeGuaranteeEt = (userAccount ,guaranteeId , amount,  EndDate) => {

    // var EndDateEt=Math.floor((EndDate/1000));
    var Regulator_instance,ChangeGuaranteeRequestinstanceAddress;

    return Regulator.deployed()
      .then( (instance) => {
        Regulator_instance=instance;
        console.log("change  guaranteeId", guaranteeId)
        return ChangeGuaranteeRequest.new(guaranteeId, amount, EndDate,{gas:5700000,from: userAccount});
      })
      .then( (ChangeGuaranteeRequestinstance) => {
        console.log("change  guaranteeId ChangeGuaranteeRequestinstance", ChangeGuaranteeRequestinstance.address,ChangeGuaranteeRequestinstance)
        ChangeGuaranteeRequestinstanceAddress=ChangeGuaranteeRequestinstance.address;
        return Regulator_instance.changeGuarantee(ChangeGuaranteeRequestinstanceAddress,guaranteeId,{from: userAccount});
      })
      .then( (tx) =>{
        return new Promise((resolve)=> {
          resolve(ChangeGuaranteeRequestinstanceAddress);
        })
      }).catch( (error) =>{
        console.error(error);
        throw error;
      })

  };


  /** ***********************/
  /**  Watcher Functions ****/
  /** ***********************/

  startCreateListener = (callback) => {
    callback('success!!!!');
    // return GuaranteeRequest.deployed()
    //   .then((instance) => {
    //     watcherSign = instance.GuaranteeRequestCreated({}, {
    //       fromBlock: 0,
    //       toBlock: 'latest'
    //     });
    //
    //
    //     watcherSign.watch(function (error, event) {
    //
    //       if (!error) {
    //         console.log("in watcher sig",event.args);
    //
    //       } else {
    //         console.log("Unable to watch events; see log.",error);
    //
    //       }
    //       //once the event has been detected, take actions as desired
    //       //   var data = 'from: ' + response.args._from+"<br>candidateName: "+web3.toUtf8(response.args._candidateName) +"<br>";
    //       //  assert.equal(response, 1 , "Event number should be 1");
    //
    //     })
    //
    //   }).catch(function (error) {
    //     self.setRegisterStatus("Unable to watch events; see log.",error);
    //
    //   });
  };

  stopCreateListener = () => {
    //   if (watcherSign != null)
    //     watcherSign.stopWatching();
  };





}
