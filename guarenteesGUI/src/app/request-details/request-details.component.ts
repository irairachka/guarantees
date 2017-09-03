import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent implements OnInit {
  @Input() request: any;
  constructor() { }

  ngOnInit() {
  }

}
