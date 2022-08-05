import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessBookingComponent } from './success-booking.component';

describe('SuccessBookingComponent', () => {
  let component: SuccessBookingComponent;
  let fixture: ComponentFixture<SuccessBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
