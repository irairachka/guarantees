import { Injectable } from '@angular/core';
import {MessageService} from "primeng/components/common/messageservice";
import {MockService} from "./mock-etherium.service";
import {Http} from "@angular/http";
import 'rxjs/add/operator/map'
import {GuaranteeState, RequestState} from "../interfaces/enum";


@Injectable()
export class RemoteService extends MockService {
  web3:any;

  accounts:any;
  account:any;

  private api: string = '/api';


  constructor(public msgService:MessageService, private http: Http) {
    super(msgService);
  }
  /************************/
  /**  Get User Data   ****/
  /************************/

  getAllGuaranties = () => {
    return this.http.get(`${this.api}/getAllGuarantees`).map(res => {
        res = res.json();
        super.setMockGuarantee(res);
        return res;
      }).toPromise();
  };

  terminateGuatanty = (guaranteeId, requestId, comment , hashcode) => {
    return this.http.post(`${this.api}/terminateGuarantees`, {
        guaranteeId,
        requestId
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
        }
      }).toPromise();
  };

  guaranteeUpdate = (guatantyId, requestId, comment, amount, date) => {
    return this.http.post(`${this.api}/updateGuarantees`, {
      guatantyId,
      requestId
    }).map(res => {
      res = res.json();
      console.log('res', res);
      // update mock
      if (res) {
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
        return {
          guarantee: updatedGuarantee,
          request: unpdatedRequest
        };
      }
    }).toPromise();
  };
}
