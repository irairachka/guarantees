import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeFormComponent } from './guarantee-form.component';

describe('GuaranteeFormComponent', () => {
  let component: GuaranteeFormComponent;
  let fixture: ComponentFixture<GuaranteeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuaranteeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
