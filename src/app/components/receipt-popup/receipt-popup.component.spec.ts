import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptPopupComponent } from './receipt-popup.component';

describe('ReceiptPopupComponent', () => {
  let component: ReceiptPopupComponent;
  let fixture: ComponentFixture<ReceiptPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
