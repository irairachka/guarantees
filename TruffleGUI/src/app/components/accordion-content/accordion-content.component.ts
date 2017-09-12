import {Component , Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'accordion-content',
  templateUrl: './accordion-content.component.html',
  styleUrls: ['./accordion-content.component.scss']
})
export class AccordionContentComponent {
  @Input() userType: any[];
  @Input() data: any;
  @Input() request: any;
  @Output() updateRequest: EventEmitter<any> = new EventEmitter();

  updateRequestsender(data){
    console.log('accordion');
    this.updateRequest.emit(data);
  }
}
