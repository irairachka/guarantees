import {Component, Input, OnChanges, Output, OnDestroy, OnInit, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {isNullOrUndefined} from "util";
import {userData,beneficiaryData} from "../../../../tempData/mockData";
import {Http} from "@angular/http";
import {Beneficiary, Customer} from "../../interfaces/request";

@Component({
  selector: 'guarantee-form',
  templateUrl: './guarantee-form.component.html',
  styleUrls: ['./guarantee-form.component.scss']
})
export class GuaranteeFormComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() modalType: string;
  @Input() beneficiaries: any = [];
  // @Input() userDetails: any ;
  @Input() userDetails: Customer;
  @Output() postNewRequest: EventEmitter<any> = new EventEmitter();
  // @Output() updateRequest: EventEmitter<any> = new EventEmitter();

  newGuarantee: FormGroup;
  uploadurl:string='http://35.158.139.208:9080/uploadpdfwhash';
  // state: any[] = [
  //   {
  //     label: "המבקש",
  //     selected: false,
  //   },
  //   {
  //     label: "הבנק",
  //     selected: true,
  //   },
  //   {
  //     label: "המוטב",
  //     selected: false,
  //   },
  // ];
  displayActions: boolean = false;

  // beneficiary: Beneficiary ;

  // bank dropdown options
  requestsStates: any[];
  // selectedRequestsStates: string;
  // cancelReason: string;
  // terminateReason: string;
  // newValue: number;
  // newDate: string;


  constructor(private fb: FormBuilder,
              private http: Http) {
    // this.createForm();
    // this.requestsStates = [
    //   {
    //     label: 'בחר גורם מטפל',
    //     value: null
    //   },
    //   {
    //     label: 'יעוץ משפטי',
    //     value: 'יעוץ משפטי'
    //   },
    //   {
    //     label: 'ניהול אשראי שוטף',
    //     value: 'ניהול אשראי שוטף'
    //   },
    //   {
    //     label: 'מנהל קשרי לרקוחות',
    //     value: 'מנהל קשרי לרקוחות'
    //   }
    // ];
  }

  ngOnInit() {
    // console.log("garanti ngOnInit",this.userDetails ,this.beneficiaries);
    // this.beneficiary = this.beneficiaries[1];
  }

  // testDisplayAction() {
  //   if(isNullOrUndefined(this.data)) {
  //     return false;
  //   }
  //   if(this.modalType === 'beneficiary') {
  //     return true;
  //   } else if (this.data.hasOwnProperty('GuaranteeID')) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  createForm() {
    console.log("garanti createForm")
    this.newGuarantee = this.fb.group({
      userName: this.userDetails.Name,
      userId: this.userDetails.customerID,
      userAddress: this.userDetails.Address,
      beneficiary: ['', Validators.required],
      // beneficiaryAddress: ['', Validators.required],
      purpose: ['', Validators.required],
      amount: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      // hash: ['', Validators.required]
      hash:''
    })
  }

  onBasicUploadAuto(e) {
    console.log('e', e);
    console.log('File Uploaded');
    console.log('e.xhr.response', e.xhr.response);
    this.newGuarantee.controls.hash.setValue(e.xhr.response);
    console.log('this.newGuarantee', this.newGuarantee);
  }

  submitGuarantee() {
    
    let formValues = Object.assign({}, this.newGuarantee.value);
    console.log('this.newGuarantee', formValues);
    this.postNewRequest.emit(formValues);
    this.newGuarantee.reset();
    this.ngOnChanges();
  }

  ngOnChanges() {
    // this.newGuarantee.reset();
    this.createForm();
    // this.selectedRequestsStates = '';
    // this.cancelReason = '';
    // this.terminateReason = '';
    // this.displayActions = this.testDisplayAction();
  }
}
