import {Component, Input, OnInit} from '@angular/core';
import {GRequest} from "../../interfaces/request";

@Component({
  selector: 'request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent implements OnInit {
  @Input() request: GRequest;
  constructor() { }

  ngOnInit() {
  }

}
