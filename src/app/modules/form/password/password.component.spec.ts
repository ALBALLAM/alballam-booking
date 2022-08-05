import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordComponent} from './password.component';
import {SharedModule} from '../../shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormBuilder} from '@angular/forms';

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, BrowserAnimationsModule],
      providers: [
        {provide: FormBuilder, useValue: formBuilder}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    component = fixture.componentInstance;
    component.name = 'name';
    component.label = 'Label';
    component.required = true;
    component.group = formBuilder.group({
      name: null
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create mat-form-field', () => {
    const matField = document.getElementsByTagName('mat-form-field');
    expect(matField.length !== 0).toBe(true);
  });
});
