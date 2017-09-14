import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeBankViewComponent } from './guarantee-bank-view.component';

// import {RequestState, GuaranteeState} from "../../interfaces/enum";



describe('GuaranteeBankViewComponent', () => {
  let component: GuaranteeBankViewComponent;
  let fixture: ComponentFixture<GuaranteeBankViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuaranteeBankViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeBankViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
