import {Component, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  @Input() userType: any[];
  @Input() data: any;
  @Output() updateRequest: EventEmitter<any> = new EventEmitter();
  // @Output() updateGuarantee: EventEmitter<any> = new EventEmitter();

  private cancelReason: string;
  private terminateReason: string;
  private newDate: string;
  private newValue: string;


  changeRequest(type) {
    console.log('this.data', this.data ,'type',type);
    let eventData = {
      type,
      requestId: this.data.GRequestID,
      guaranteeId: '',
      details: '',
      update: {}
    };

    switch (type) {
      case 'updateBank1':
        eventData.type='updateBank';
        eventData.details ='העברה למנהל קשרי לקוחותן';
        break;
      case 'updateBank2':
        eventData.type='updateBank';
        eventData.details ='העברה למח׳ המשפטית';
        break;
      case 'withdrawal':
        break;
      // case 'updateBank':
      //   eventData.details = this.selectedRequestsStates;
      //   break;
      case 'accept':
        break;
      case 'reject':
        eventData.details = this.cancelReason;
        break;
      case 'terminate':
        eventData.details = this.terminateReason;
        eventData.guaranteeId = this.data.GuaranteeID;
        break;
      case 'guaranteeUpdate':
        eventData.guaranteeId = this.data.GuaranteeID;
        eventData.update = {
          date: this.newDate || '',
          amount: this.newValue || ''
        };
        break;
    }

    this.updateRequest.emit(eventData);
  }
}
