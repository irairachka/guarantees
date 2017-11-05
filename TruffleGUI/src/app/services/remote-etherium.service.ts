import { Injectable } from '@angular/core';
import {MessageService} from "primeng/components/common/messageservice";
import {MockService} from "./mock-etherium.service";
import {Http} from "@angular/http";
import 'rxjs/add/operator/map'
import {GuaranteeState, RequestState} from "../interfaces/enum";
import 'rxjs/add/operator/toPromise';
import {RealService} from "./real-etheriumwork.service";

@Injectable()

export class RemoteService extends RealService {
  web3:any;

  accounts:any;
  account:any;

  private api: string = '/api';
  // private api: string =  'http://localhost:3000/api';


  constructor(public msgService:MessageService, private http: Http) {
    super(msgService);
  }
  /************************/
  /**  Get User Data   ****/
  /************************/

  getAllGuaranties = () => {
    return this.http.get(`${this.api}/getAllGuarantees`).map(res => {
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


  terminateGuatanty = (guaranteeId, requestId, comment , hashcode):any => {
    return this.http.post(`${this.api}/terminateGuarantees`, {
        guaranteeId,
        requestId ,
        comment ,
        hashcode
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


  guaranteeUpdate = (guatantyId, requestId, comment, amount, date):any => {










    return this.http.post(`${this.api}/updateGuarantees`, {
      guatantyId,
      requestId,
      comment,
      amount,
      date
    }).map(res => {
      res = res.json();
      console.log('res', res);
      // update mock
      if (res) {
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

        return({
          request: unpdatedRequest,
          guarantee: updatedGuarantee
        });
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
}
