import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'request-item',
  templateUrl: './request-item.component.html',
  styleUrls: ['./request-item.component.scss']
})
export class RequestItemComponent implements OnInit {
  @Input() request: any;
  constructor() { }

  ngOnInit() {
  }

}
