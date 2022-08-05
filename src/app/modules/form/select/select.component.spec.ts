import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
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
    fixture = TestBed.createComponent(SelectComponent);
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

  it('should create mat-select', () => {
    const matField = document.getElementsByTagName('mat-select');
    expect(matField.length !== 0).toBe(true);
  });
});
