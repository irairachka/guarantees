import {Component, EventEmitter, Input, Output, } from '@angular/core';
import {RequestState, GuaranteeState} from "../../interfaces/enum";


@Component({
  selector: 'status-icon',
  templateUrl: './status-icon.component.html',
  styleUrls: ['./status-icon.component.scss']
})
export class StatusIconComponent {
  @Input() state: any;
  @Input() isRequest: boolean;
  @Input() useState: boolean;
  statusIcon: string;

  ngOnInit(){
    // console.log('-----' , this.state);
    if(this.isRequest) {
      this.getRequestIcon(this.state);
    } else {
      this.getGuaranteeIcon(this.state);
    }
  }

  getRequestIcon(state) {
    switch (state) {
      case RequestState.accepted:
        this.statusIcon ='fa-check-circle';
            break;
      case RequestState.waitingtobank:
      case RequestState.waitingtocustomer:
      case RequestState.waitingtobeneficiery:
         if (!this.useState)
           this.statusIcon ='fa-hourglass-half';
         else
           this.statusIcon ='fa-exclamation-triangle';
            // this.statusIcon ='fa-info-circle';
        break;
      case RequestState.withdrawed:
      case RequestState.rejected:
      case RequestState.terminationRequest:
        this.statusIcon ='fa-times-circle';
        break;
      case RequestState.handling:
        this.statusIcon ='fa-hourglass-half';
        break;
      default:
        this.statusIcon ='';
        break;
    }
  }

  getGuaranteeIcon(state) {
    switch (state) {
      case GuaranteeState.Valid:
        this.statusIcon ='fa-check-circle';
        break;
      case GuaranteeState.Terminated:
        this.statusIcon ='fa-times-circle';
        break;
      default:
        break;
    }
  }
}

