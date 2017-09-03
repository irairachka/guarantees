import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeItemComponent } from './guarantee-item.component';

describe('GuaranteeItemComponent', () => {
  let component: GuaranteeItemComponent;
  let fixture: ComponentFixture<GuaranteeItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuaranteeItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
