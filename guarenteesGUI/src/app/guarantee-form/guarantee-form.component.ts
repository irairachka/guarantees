import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'guarantee-form',
  templateUrl: './guarantee-form.component.html',
  styleUrls: ['./guarantee-form.component.scss']
})
export class GuaranteeFormComponent implements OnInit, OnChanges {
  @Input() data: any;
  newGuarantee: FormGroup;
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
  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    if(isNullOrUndefined(this.data)){
      this.newGuarantee = this.fb.group({
        userName: '',
        userId: '',
        userAddress: '',
        beneficiary: '',
        beneficiaryAddress: '',
        purpose: '',
        amount: '',
        startDate: '',
        endDate: ''
      })
    }
  }

  onBasicUploadAuto(e) {
    console.log('e', e);
    console.log('File Uploaded');
  }

  submitGuarantee() {
    console.log('this.newGuarantee.value', this.newGuarantee.value);
  }

  ngOnChanges() {
    console.log('destroy');
    this.newGuarantee.reset();
  }
}
