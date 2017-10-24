import { Injectable } from '@angular/core';
import {MessageService} from "primeng/components/common/messageservice";
import {MockService} from "./mock-etherium.service";
import {Http} from "@angular/http";


@Injectable()
export class RemoteService extends MockService {
  web3:any;

  accounts:any;
  account:any;

  constructor(public msgService:MessageService, private http: Http) {
    super(msgService);
  }
  /************************/
  /**  Get User Data   ****/
  /************************/

  getAllGuaranties = () => {
    return this.http.get('https://api.icndb.com/jokes/random').toPromise();
  };
}
