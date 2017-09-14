import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeUserViewComponent } from './guarantee-user-view.component';

// import {RequestState, GuaranteeState} from "../../interfaces/enum";



describe('GuaranteeUserViewComponent', () => {
  let component: GuaranteeViewComponent;
  let fixture: ComponentFixture<GuaranteeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuaranteeUserViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
