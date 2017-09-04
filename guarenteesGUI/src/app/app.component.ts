import { Component } from '@angular/core';

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

  openModal(e) {
    console.log('e', e);
    this.modalType = e;
    console.log('this.modalType', this.modalType);
    this.showCard = true;
  }
}
