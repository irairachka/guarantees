import {Component, Input, OnInit} from '@angular/core';
import {GRequest} from "../../interfaces/request";
import {mockexpandedRequest} from "../../../../tempData/mockData";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @Input() history?: any[];
  @Input() request?: GRequest;
  myHistory: any[];

  ngOnInit() {
    if(this.request){
      this.myHistory = this.getHistory(this.request.GRequestID)
    } else {
      this.myHistory = [...this.history];
    }
  }

  getHistory(id): any[] {
    // TODO - add real function
    return mockexpandedRequest[1].log;
  }
}
