import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeViewComponent } from './guarantee-view.component';

describe('GuaranteeViewComponent', () => {
  let component: GuaranteeViewComponent;
  let fixture: ComponentFixture<GuaranteeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuaranteeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
