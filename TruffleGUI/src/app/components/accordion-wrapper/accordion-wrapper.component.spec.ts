import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionWrapperComponent } from './accordion-wrapper.component';

describe('AccordionWrapperComponent', () => {
  let component: AccordionWrapperComponent;
  let fixture: ComponentFixture<AccordionWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccordionWrapperComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
