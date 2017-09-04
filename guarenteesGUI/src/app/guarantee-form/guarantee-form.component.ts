import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'guarantee-form',
  templateUrl: './guarantee-form.component.html',
  styleUrls: ['./guarantee-form.component.scss']
})
export class GuaranteeFormComponent implements OnInit {
  state: any[] = [
    {
      label: "המבקש",
      value: "המבקש",
    },
    {
      label: "הבנק",
      value: "הבנק",
    },
    {
      label: "המוטב",
      value: "המוטב",
    },
  ];
  selectedState: string = null;
  constructor() { }

  ngOnInit() {
  }

  onBasicUploadAuto(e) {
    console.log('e', e);
    console.log('File Uploaded');
  }
}
