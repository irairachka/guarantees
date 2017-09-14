import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from '@angular/core';

@Component({
  selector: 'accordion-content',
  templateUrl: './accordion-content.component.html',
  styleUrls: ['./accordion-content.component.scss']
})
export class AccordionContentComponent implements OnChanges{
  @Input() userType: any[];
  @Input() todel_state: any;
  @Input() data: any;
  @Input() request: any;
  @Output() updateRequest: EventEmitter<any> = new EventEmitter();
  statusGraph: string;
  updateRequestsender(data){
    console.log('accordion');
    this.updateRequest.emit(data);
  }



  ngOnChanges(){
     console.log('-----' , this.todel_state ,this.userType);
    if(this.todel_state==1)
      this.statusGraph="../../../assets/images/progress1.png";
      else
      this.statusGraph="../../../assets/images/progress2.png";

  }


}
