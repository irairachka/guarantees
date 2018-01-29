import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {EtheriumService} from "../../services/real-etherium.service";
import {ExpandedRequest, GRequest} from "../../interfaces/request";

@Component({
  selector: 'app-accordion-wrapper',
  templateUrl: './accordion-wrapper.component.html',
  styleUrls: ['./accordion-wrapper.component.scss']
})
export class AccordionWrapperComponent implements OnInit {
  @Input() title: string;
  @Input() allRequests;
  @Input() user;
  @Output() updateRequest: EventEmitter<any> = new EventEmitter();
  private requestHistory;

  constructor(@Inject(EtheriumService) private truffleSRV: EtheriumService) {
  }

  ngOnInit() {
  }

  getRequestHistory(req: GRequest) {
    this.truffleSRV.getRequestHistory(req.GRequestID).then((res: any[]) => {
      console.log('res', res);
      this.requestHistory = res;
      console.log('this.requestHistory', this.requestHistory);
    });
  }

  
  updateRequestsender(data){
    this.updateRequest.emit(data);
  }
}
