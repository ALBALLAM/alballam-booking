import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesPopupComponent } from './countries-popup.component';

describe('CountriesPopupComponent', () => {
  let component: CountriesPopupComponent;
  let fixture: ComponentFixture<CountriesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountriesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
