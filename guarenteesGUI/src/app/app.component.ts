import { Component } from '@angular/core';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //TODO change user to ENUM
  selected: number;
  showCard: boolean = false;
  modalType: string = 'user';
  data: any;

  openModal(e) {
    console.log('e', e);
    this.modalType = e.user;
    if(!isNullOrUndefined(e.request)) {
      this.data = e.request
    }
    this.showCard = true;

  }

  clearData() {
    this.data = null;
  }

}
