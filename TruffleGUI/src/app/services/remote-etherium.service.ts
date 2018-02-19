import { Injectable } from '@angular/core';
import {MessageService} from "primeng/components/common/messageservice";
import {MockService} from "./mock-etherium.service";
import {Http, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/map'
import {GuaranteeState, RequestState} from "../interfaces/enum";
import 'rxjs/add/operator/toPromise';
import {RealService} from "./real-etheriumwork.service";
import {environment} from "../../environments/environment";
import {throws} from "assert";
import {Beneficiary} from "../interfaces/request";
const Web3 = require('web3');

@Injectable()

export class RemoteService  extends MockService {
  // web3:any;


  realRequests =[];
  realGuarantees =[];
  realCustomers =[];
  realBeneficiaries:any=[];
  realIssuers=[];

  // accounts:any;
  // account:any;

  private api:string =environment.apiserver+"/api";
  // private  server: string =environment.server;
  // private api: string =  '/api';
  // private api: string =  'http://localhost:3000/api';

  constructor(public msgService:MessageService, private http: Http) {
    super(msgService);
    this.getAllBeneficiaries();
    this.getCustomerData(this.account);
    this.getBeneficiaryData(this.account);
    // this.getBankData(this.account);
  }


  /************************/
  /**  Get User Data   ****/
  /************************/


  getAllRequests = (customerAddress:string=this.account)=> {
    console.log('getAllRequests send to server');
    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/getAllRequests`;
      let params: URLSearchParams = new URLSearchParams();
      params.set('customerAddress', customerAddress);
      this.http.get(apiURL,{
        search: params
      })
        .toPromise()
        .then(
          res => { // Success
            res = res.json();
            if(res) {
              super.setMockRequests(res);
              resolve(this.mockRequests);
            }

          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };



  getAllUserRequests(customerAddress=this.account){
    console.log('getAllUserRequests send to server' );

    return  new Promise((resolve, reject) => {
    let apiURL = `${this.api}/getAllUserRequests`;
    let params: URLSearchParams = new URLSearchParams();
        params.set('customerAddress', customerAddress);
    this.http.get(apiURL,{
          search: params
        })
      .toPromise()
      .then(
        res => { // Success
          res = res.json();
          resolve(res);
        },
        err => { // Error
          this.msgService.add({
                        severity: 'error',
                        summary: 'תקלת תקשורת',
                        detail: err.statusText
                      });
           reject(err.statusText);
        }
      );
  });
    };





  getAllBankRequests( bankAddress=this.account)
  {

      return this.getAllRequests();
  };



  getAllGuaranties = (customerAddress:string=this.account) => {
    console.log('getAllGuaranties send to server');

    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/getAllGuarantees`;
      let params: URLSearchParams = new URLSearchParams();
      params.set('customerAddress', customerAddress);

      this.http.get(apiURL,{
        search: params
      })
        .toPromise()
        .then(
          res => { // Success
            res = res.json();
            // if(res) {
              super.setMockGuarantee(res);
              resolve(this.mockGuarantees);
            // }

          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };




    getAllCustomerGuaranties(customerAddress=this.account) {
      console.log('getAllCustomerGuaranties send to server');

      return  new Promise((resolve, reject) => {
        let apiURL = `${this.api}/getAllCustomerGuaranties`;
        let params: URLSearchParams = new URLSearchParams();
        params.set('customerAddress', customerAddress);

        this.http.get(apiURL,{
          search: params
        })
          .toPromise()
          .then(
            res => { // Success
              res = res.json();
              if(res) {
                resolve(res);
              }

            },
            err => { // Error
              this.msgService.add({
                severity: 'error',
                summary: 'תקלת תקשורת',
                detail: err.statusText
              });
              reject(err.statusText);
            }
          );
      });
    };





    getAllBeneficiaryGuarantees(beneficiaryAddress=this.account) {
      console.log('getAllBeneficiaryGuarantees send to server');

      return  new Promise((resolve, reject) => {
          let apiURL = `${this.api}/getAllBeneficiaryGuarantees`;
          let params: URLSearchParams = new URLSearchParams();
          params.set('beneficiaryAddress', beneficiaryAddress);

          this.http.get(apiURL,{
            search: params
          })
            .toPromise()
            .then(
              res => { // Success
                res = res.json();
                if(res) {
                  resolve(res);
                }

              },
              err => { // Error
                this.msgService.add({
                  severity: 'error',
                  summary: 'תקלת תקשורת',
                  detail: err.statusText
                });
                reject(err.statusText);
              }
            );
        });
    };


  getAllBankGuaranties(bankAddress=this.account) {
    return this.getAllGuaranties();
  }


    // getAllBankGuaranties(bankAddress=this.account) {
    //   return  new Promise((resolve, reject) => {
    //     let apiURL = `${this.api}/getAllBankGuaranties`;
    //     let params: URLSearchParams = new URLSearchParams();
    //     params.set('bankAddress', bankAddress);
    //
    //     this.http.get(apiURL,{
    //       search: params
    //     })
    //       .toPromise()
    //       .then(
    //         res => { // Success
    //           res = res.json();
    //           if(res) {
    //             resolve(res);
    //           }
    //
    //         },
    //         err => { // Error
    //           this.msgService.add({
    //             severity: 'error',
    //             summary: 'תקלת תקשורת',
    //             detail: err.statusText
    //           });
    //           reject(err.statusText);
    //         }
    //       );
    //   });
    // };




  terminateGuatanty = (guaranteeId, requestId, comment , hashcode,customerAddress=this.account):any => {
    console.log('terminateGuatanty send to server',guaranteeId, requestId);

    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/terminateGuarantees`;

      this.http.post(apiURL,{
        guaranteeId,
        requestId ,
        comment ,
        hashcode ,
        customerAddress
      })
        .toPromise()
        .then(
          res => { // Success
            // this.msgService.add({severity: 'success', summary: 'ביטול ערבות', detail: 'בקשה לביטול הערבות  נשלחה בהצלחה'});
            res = res.json();
            console.log('res', res ,this.mockRequests,this.mockGuarantees);

            // find and change state of selected request
            let terminatedRequest = this.mockRequests.find((item) => {
              return item.GRequestID === requestId;
            });
            terminatedRequest.requestState = RequestState.terminationRequest;

            let terminatedGuarantee = this.mockGuarantees.find((item) => {
              return item.GuaranteeID === guaranteeId;
            });
            terminatedGuarantee.guaranteeState = GuaranteeState.Terminated;

            resolve( {
              guarantee: terminatedGuarantee,
              request: terminatedRequest
            });

          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };





  guaranteeUpdate = (guaranteeId, requestId, comment, amount, date,customerAddress=this.account):any => {

    console.log('guaranteeUpdate send to server',guaranteeId, requestId);



    // find and change state of selected request
    let unpdateRequest = this.mockRequests.find((item) => {
      return item.GRequestID === requestId;
    });


    if (date ==='undefined' || date =='')
      date=unpdateRequest.EndDate;

    console.log('call update by url ',guaranteeId, requestId, comment, amount, date,customerAddress)



    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/updateGuarantees`;

      this.http.post(apiURL,{
        guaranteeId,
        requestId,
        comment,
        amount,
        date,
        customerAddress
      })
        .toPromise()
        .then(
          res => { // Success
            console.log('res is',res);
            let reqid = res.text();
            // update mock

              // make new request
              this.populateRequestDataP(
                [reqid,
                  unpdateRequest.customer,
                  unpdateRequest.bank,
                  unpdateRequest.beneficiary,
                  unpdateRequest.fullName,
                  unpdateRequest.purpose,
                  amount,
                  this.transformDateJSToSol(unpdateRequest.StartDate),
                  this.transformDateJSToSol(date),
                  unpdateRequest.indexType,
                  unpdateRequest.indexDate,
                  RequestState.waitingtobank,
                  true,
                  requestId
                ]
              ).then((newItem)=>{
                console.log('guaranteeUpdate add',newItem);
                this.mockRequests = [...this.mockRequests, newItem];
                this.msgService.add({severity: 'success', summary: 'שינוי ערבות', detail: 'בקשה לשינוי הערבות  נשלחה בהצלחה'});
                resolve(newItem);
              });
          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };




  guaranteeSignComplite =  (requestId, comment , hashcode,customerAddress=this.account):any => {
    console.log('guaranteeSignComplite send to server');

    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/guaranteeSignComplite`;

      this.http.post(apiURL,{
        requestId,
        comment ,
        hashcode,
        customerAddress
      })
        .toPromise()
        .then(
          res => { // Success
            console.log('res is', res);
            let result2 = res.text();
            // update mock
            if (result2) {

// find and change state of selected request
              let acceptedItem = this.mockRequests.find((item) => {
                return item.GRequestID === requestId;
              });
              acceptedItem.requestState = RequestState.accepted;


              const startDatet = this.transformDateJSToSol(acceptedItem.StartDate);
              // new Date(newstartDate).getTime()/1000;
              const endDatet = this.transformDateJSToSol(acceptedItem.EndDate);
              // new Date(newsendDate).getTime()/1000;
              // console.log("guaranteeSignComplite ",acceptedItem.StartDate,startDatet,acceptedItem.EndDate,endDatet);

              this.getOneCustomerDataP(acceptedItem.customer).then((customer)=> {
                console.log(" the customer is:",acceptedItem,customer)

                // generate new guarantee
                let guarantee = this.populateGuaranteeDataP(
                  [result2,
                    requestId,
                    acceptedItem.customer,
                    acceptedItem.bank,
                    acceptedItem.beneficiary,
                    customer.Name,
                    acceptedItem.purpose,
                    acceptedItem.amount,
                    startDatet,
                    endDatet,
                    acceptedItem.indexType,
                    acceptedItem.indexDate,
                    GuaranteeState.Valid
                  ]
                ).then((guarantee)=> {
                  this.mockGuarantees = [...this.mockGuarantees, guarantee];
                  this.msgService.add({
                    severity: 'success',
                    summary: 'ערבות חדשה',
                    detail: 'בוצע חשיפה לערבות חדשה בהצלחה'
                  });
                  resolve(guarantee);
                });
              })
            }
          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };



  /************************/
  /**  Get User Data   ****/
  /************************/


  getCustomerData = (customerAddress:string=this.account) => {


    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/getCustomer`;
      let params: URLSearchParams = new URLSearchParams();
      params.set('customerAddress', customerAddress);

      for (var i in this.realCustomers) {
        if (this.realCustomers[i].customerID == customerAddress) {
            resolve(this.realCustomers[i]);
        }
      }

      console.log('getCustomerData send to server' ,this.realCustomers);

      this.http.get(apiURL,{
        search: params
      })
        .toPromise()
        .then(
          res => { // Success
            res = res.json();
            if(res) {
              this.realCustomers = [...this.realCustomers, res];
              resolve( res);
            }
          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };


  /** ****************** **/
  /**  Get Bank Data     **/
  /** ****************** **/



  getBankData = (customerAddress:string=this.account) => {
    console.log('getBankData send to server');

    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/getBankData`;
      let params: URLSearchParams = new URLSearchParams();
      params.set('customerAddress', customerAddress);

      for (var i in this.realIssuers) {
        if (this.realIssuers[i].bankID == customerAddress) {
           console.log(this.realIssuers[i]);
            resolve(this.realIssuers[i]);

        }
      }

      this.http.get(apiURL,{
        search: params
      })
        .toPromise()
        .then(
          res => { // Success
            res = res.json();
            if(res) {

              this.realIssuers = [...this.realIssuers, res];
              resolve( res);
            }

          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };




  /** ************************* **/
  /**  Get Beneficiary Data     **/
  /** ************************* **/

  getAllBeneficiaries = () => {
    console.log('getAllBeneficiaries send to server');


    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/getAllBeneficiaries`;
      // let params: URLSearchParams = new URLSearchParams();
      // params.set('customerAddress', customerAddress);

      this.http.get(apiURL)
        .toPromise()
        .then(
          res => { // Success
            res = res.json();
            if(res) {
              // this.realBeneficiaries = [... res];
              this.realBeneficiaries = res;
              // console.log("this.realBeneficiaries",this.realBeneficiaries);
              resolve(this.realBeneficiaries);
            }
          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };


  getAllBeneficiaryGuaranties = () => {
    return this.getAllGuaranties();
  };


  getBeneficiaryData = (BeneficiaryAddress?) => {


    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/getBeneficiaryData` ;
      let params: URLSearchParams = new URLSearchParams();
      params.set('beneficiaryAddress', BeneficiaryAddress);

      // for (var i in this.realBeneficiaries) {

        let beneficioryItem = this.realBeneficiaries.find((item) => {
          return item.beneficiaryID === BeneficiaryAddress;
        });

        if (beneficioryItem !== undefined )
        {
          resolve( beneficioryItem);
        }

        // if (this.realBeneficiaries[i].beneficiaryID === BeneficiaryAddress) {
        //    resolve(this.realBeneficiaries[i]);
        // }
      // }

      console.log('getBeneficiaryData send to server',beneficioryItem,BeneficiaryAddress ,this.realBeneficiaries ,apiURL);

      this.http.get(apiURL)
        .toPromise()
        .then(
          res => { // Success
            res = res.json();
            if(res) {
              this.realBeneficiaries.push(res);
              console.log("this.realBeneficiaries",this.realBeneficiaries);

              // this.realBeneficiaries= [...this.realBeneficiaries, res];
              resolve (res);
            }
          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };



  /** ************************* **/
  /**  request operations       **/
  /** ************************* **/



  createRequest( userAccount , bankAccount, beneficiaryAccount , purpose,
                 amount, StartDate, EndDate, indexType, indexDate ) {

    console.log('createRequest send to server',userAccount , bankAccount, beneficiaryAccount , purpose,
      amount, StartDate, EndDate, indexType, indexDate);


    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/createRequest`;
      const thestartDate = this.transformDateJSToSol(StartDate);
      const theendDate = this.transformDateJSToSol(EndDate);
      let fullName = "full_name";
      let hashcode = 'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f0fdc2';
      console.log('createRequest send to server', userAccount, bankAccount, beneficiaryAccount, purpose, fullName,
        amount, StartDate, EndDate, indexType, indexDate, hashcode);


      // let headers = new HttpHeaders ();
      // headers.append('Content-Type', 'application/json');
      // let options = new RequestOptions({ headers: this.headers });


      this.http.post(apiURL,{
        userAccount,
        bankAccount,
        beneficiaryAccount,
        purpose,
        fullName,
        amount,
        StartDate,
        EndDate,
        indexType,
        indexDate,
        hashcode
      } )
        .toPromise()
        .then(
          res => { // Success
            console.log('res recived ',res);

            // res = res.json();
            // console.log('res is', res);
            let addressOfIns = res.text();
            console.log("update mock with address:",addressOfIns);
            // update mock
            // if (addressOfIns) {

              let newItem = this.populateRequestDataP(
                [addressOfIns,
                  userAccount,
                  bankAccount,
                  beneficiaryAccount,
                  fullName,
                  purpose,
                  amount,
                  thestartDate,
                  theendDate,
                  indexType,
                  indexDate,
                  RequestState.waitingtobank,
                  false,
                  ''
                ]
              ).then(newItem=>{
                this.msgService.add({
                  severity: 'success',
                  summary: 'ערבות חדשה',
                  detail: 'בקשה לערבות חדשה נשלחה בהצלחה'
                });
                console.log("newItem", newItem);
                this.mockRequests = [...this.mockRequests, newItem];
                resolve (newItem);
              });

            // }

          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };


  populateRequestDataP=(resultArr)=>  {

    return  new Promise((resolve,reject) =>
    {

      const startDate = this.transformDateSolToJS(resultArr[7].valueOf());
      const endDate = this.transformDateSolToJS(resultArr[8].valueOf());

      // const startDate = (new Date(resultArr[6] * 1000) ).toDateString();
      // const endDate = (new Date(resultArr[7] * 1000) ).toDateString();
      //  console.log('startDate1',resultArr[7] * 1000,startDate,'endDate1',resultArr[8] * 1000,endDate);
      const proposal= resultArr[5];
      const full_name= resultArr[4];
      const ischangeRequest=(resultArr[12] === 'true' || resultArr[12] == true);
      const changeRequestId=((resultArr[12] == true && resultArr[13] !== undefined )? resultArr[13] : '') ;

      // console.log("populateRequestDataP",resultArr);

      this.getBeneficiaryData(resultArr[3]).then((beneficiary:Beneficiary)=> {

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






  withdrawalRequest = (requestId, comment):any => {
    console.log('withdrawalRequest send to server', requestId, comment );

    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/withdrawalRequest`;
      // let params: URLSearchParams = new URLSearchParams();
      // params.set('bankAddress', bankAddress);

      this.http.post(apiURL,{
        requestId ,
        comment
      })
        .toPromise()
        .then(
          res => { // Success
            res = res.json();
            console.log('res', res);
            // update mock

            if(res) {

              let updatedItem = this.mockRequests.find((item) => {
                return item.GRequestID === requestId;
              });
              updatedItem.requestState = RequestState.withdrawed;
              // console.log('updatedItem',updatedItem);

              this.msgService.add({
                severity: 'success',
                summary: 'ערבות חדשה',
                detail: 'בקשה לערבות בוטלה בהצלחה'
              });
              resolve (updatedItem);
            };

          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };





  updateRequest = (requestId, comment):any => {
   console.log('updateRequest send to server', requestId, comment );
    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/updateRequest`;
      // let params: URLSearchParams = new URLSearchParams();
      // params.set('bankAddress', bankAddress);

      this.http.post(apiURL,{
        requestId ,
        comment
      })
        .toPromise()
        .then(
          res => {
            // Success

            this.msgService.add({
              severity: 'success',
              summary: 'ערבות עודכנה',
              detail: 'בקשה לערבות עודכנה בהצלחה'
            });
            // res = res.text();
            console.log('res', res);
            // update mock




            let updatedItem = this.mockRequests.find((item) => {
              return item.GRequestID === requestId;
            });
            updatedItem.requestState = RequestState.handling;

            resolve(updatedItem);

            // }

          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };





  rejectRequest = (requestId, comment) => {
    console.log('rejectRequest send to server', requestId,comment);

    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/rejectRequest`;
      // let params: URLSearchParams = new URLSearchParams();
      // params.set('customerAddress', customerAddress);

      this.http.post(apiURL,{
        requestId ,
        comment
      })
        .toPromise()
        .then(
          res => { // Success
            this.msgService.add({
              severity: 'success',
              summary: 'ביטול ערבות ',
              detail: 'בקשה לביטול ערבות עודכנה בהצלחה'
            });
            res = res.json();
            console.log('res', res);
            // update mock

            if(res) {

              let rejectedItem = this.mockRequests.find((item) => {
                return item.GRequestID === requestId;
              });
              rejectedItem.requestState = RequestState.rejected;

              resolve(rejectedItem);
            };
          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };




  acceptRequest = (requestId, comment , hashcode):any => {

    console.log('acceptRequest send to server', requestId, comment , hashcode ,this.mockRequests ,this.mockGuarantees);

    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/acceptRequest`;
      // let params: URLSearchParams = new URLSearchParams();
      // params.set('customerAddress', customerAddress);

      this.http.post(apiURL, {
        requestId ,
        comment ,
        hashcode
      })
        .toPromise()
        .then(
          res => { // Success

            // this.msgService.add({
            //   severity: 'success',
            //   summary: 'ערבות חדשה',
            //   detail: 'בקשה לערבות עודכנה בהצלחה'
            // });
            res = res.json();
            console.log('res', res);
            // update mock

            if(res) {

              let acceptedItem = this.mockRequests.find((item) => {
                return item.GRequestID === requestId;
              });
              acceptedItem.requestState = RequestState.accepted;



              if (acceptedItem.ischangeRequest)
              {
                console.log('ischangeRequest true' , acceptedItem.ischangeRequest ,acceptedItem);
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
                console.log('ischangeRequest false' , acceptedItem.ischangeRequest ,acceptedItem);

                // console.log('acceptRequest',acceptedItem.ischangeRequest,null,acceptedItem);

                resolve({
                  terminatedguarantee: null,
                  request: acceptedItem
                });
              }

            }
          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };





  getGuarantyHistory = (guaranteeId):any => {
    console.log('getGuarantyHistory send to server');

    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/getGuarantyHistory?guaranteeId=`+guaranteeId;
      let params: URLSearchParams = new URLSearchParams();
      params.set('guarantyId', guaranteeId);

      this.http.get(apiURL,{
        search: params
      })
        .toPromise()
        .then(
          res => { // Success
            res = res.json();
            if(res) {
              resolve(res);
            }

          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };




  getRequestHistory = (requestAddress):any => {
    console.log('getRequestHistory send to server');

    return  new Promise((resolve, reject) => {
      let apiURL = `${this.api}/getRequestHistory?requestId=`+requestAddress;
      let params: URLSearchParams = new URLSearchParams();
      params.set('appid', 'id123');
      params.set('cnt', '42');
      params.set('requestId', requestAddress);

      console.log('getRequestHistory send to server', params );

      this.http.get(apiURL,{
        search: params
      })
        .toPromise()
        .then(
          res => { // Success
            res = res.json();
            if(res) {
              resolve(res);
            }

          },
          err => { // Error
            this.msgService.add({
              severity: 'error',
              summary: 'תקלת תקשורת',
              detail: err.statusText
            });
            reject(err.statusText);
          }
        );
    });
  };



}
