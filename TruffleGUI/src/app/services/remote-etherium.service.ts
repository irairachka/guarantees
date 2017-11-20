import { Injectable } from '@angular/core';
import {MessageService} from "primeng/components/common/messageservice";
import {MockService} from "./mock-etherium.service";
import {Http} from "@angular/http";
import 'rxjs/add/operator/map'
import {GuaranteeState, RequestState} from "../interfaces/enum";
import 'rxjs/add/operator/toPromise';
import {RealService} from "./real-etheriumwork.service";
import {environment} from "../../environments/environment";

@Injectable()

export class RemoteService extends RealService {
  web3:any;

  accounts:any;
  account:any;

  private api:string =environment.apiserver+"/api";
  // private  server: string =environment.server;
  // private api: string =  '/api';
  // private api: string =  'http://localhost:3000/api';


  constructor(public msgService:MessageService, private http: Http) {
    super(msgService);
  }
  /************************/
  /**  Get User Data   ****/
  /************************/

  getAllGuaranties = (customerAddress:string=this.account) => {
    // Parameters obj-
    let params: URLSearchParams = new URLSearchParams();
    params.set('customerAddress', customerAddress);


    return this.http.get(`${this.api}/getAllGuarantees` ,{
      search: params
    }).map(res => {
      res = res.json();
      //todo check is it right
      if(res) {
        super.setMockGuarantee(res);
        return res;
      }
      else
      {
        this.msgService.add({
          severity: 'error',
          summary: 'תקלת תקשורת',
          detail: 'Etherium Fatal Error!!!'
        });
        return;
      }
    }).toPromise();
  };

  // getAllGuaranties = () => {
  //   return this.http.get(`${this.api}/getAllGuarantees`).map(res => {
  //     res = res.json();
  //     super.setMockGuarantee(res);
  //     return res;
  //   }).toPromise();
  // };


  terminateGuatanty = (guaranteeId, requestId, comment , hashcode,customerAddress=this.account):any => {

    console.log('terminateGuatanty send to server',guaranteeId, requestId, comment , hashcode,customerAddress);
    return this.http.post(`${this.api}/terminateGuarantees`, {
        guaranteeId,
        requestId ,
        comment ,
        hashcode ,
      customerAddress
      }).map(res => {
        res = res.json();
        console.log('res', res);
        // update mock
        if(res) {
          let terminatedRequest = this.mockRequests.find((item) => {
            return item.GRequestID === requestId;
          });
          terminatedRequest.requestState = RequestState.terminationRequest;
          let terminatedGuarantee = this.mockGuarantees.find((item) => {
            return item.GuaranteeID === guaranteeId;
          });
          terminatedGuarantee.guaranteeState = GuaranteeState.Terminated;
          return {
            guarantee: terminatedGuarantee,
            request: terminatedRequest
          };
        } else {
          this.msgService.add({
            severity: 'error',
            summary: 'תקלת תקשורת',
            detail: 'Etherium Fatal Error!!!'
          });
          return;
        }
      }).toPromise();
  };



  guaranteeUpdate = (guaranteeId, requestId, comment, amount, date,customerAddress=this.account):any => {

    // find and change state of selected request
    let unpdateRequest = this.mockRequests.find((item) => {
      return item.GRequestID === requestId;
    });


    if (date ==='undefined' || date =='')
      date=unpdateRequest.EndDate;

    console.log('call update by url ',guaranteeId, requestId, comment, amount, date,customerAddress)
    return new Promise((resolve, reject) => {
      this.http.post(`${this.api}/updateGuarantees`, {
        guaranteeId,
        requestId,
        comment,
        amount,
        date,
        customerAddress
      }).subscribe(res => {
        console.log('res is',res);
        let reqid = res.text();
        // update mock
        if (reqid) {
          // make new request
          this.populateRequestDataP(
            [reqid,
              unpdateRequest.customer,
              unpdateRequest.bank,
              unpdateRequest.beneficiary,
              this.web3.fromUtf8(unpdateRequest.fullName),
              this.web3.fromUtf8(unpdateRequest.purpose),
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
        } else {
          this.msgService.add({
            severity: 'error',
            summary: 'תקלת תקשורת',
            detail: 'Etherium Fatal Error!!!'
          });
          reject('error');
        }
      });
    });
  };


}
