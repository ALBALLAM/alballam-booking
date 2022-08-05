import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatFormFieldAppearance} from '@angular/material';
import {countries} from './countries';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss']
})
export class PhoneNumberComponent implements OnInit {
  @Input() public label: string;
  @Input() public title: string;
  @Input() public value: string;
  @Input() public required: boolean;
  @Input() public disabled: boolean;
  @Input() public getFullValue: boolean;
  @Input() public matPrefix: boolean;
  @Input() public group: FormGroup;
  @Input() public name: string;
  @Input() public maxLength: string;
  @Input() public maxLengthNumber: number;
  @Input() public icon: string;
  @Input() public svgIcon: string;
  @Input() public defaultValue: string;
  @Input() public appearance: MatFormFieldAppearance;
  @Input() public patternErrorMessage: string;
  @Input() public hint: string;
  @Input() public currentLang: string;
  @Output() public keyUpEvent = new EventEmitter();
  @Output() public changeValueEvent = new EventEmitter();
  public countryCode: string;
  public line: string;
  public selectedOptions = [];
  public countries = countries;
  public disabledOptions: boolean;

  public triggerKeyUp(event) {
    this.keyUpEvent.emit(event);
  }

  public ngOnInit() {
    for (const item of this.countries) {
      const text = item.name + ' ( ' + item.dial_code + ' ) ';
      this.selectedOptions.push({text, value: item.code});
    }
    this.countryCode = this.name + 'CountryCode';
    this.line = this.name + 'Line';
    this.disabledOptions = false;
  }

  public onKeyPress(event) {
    this.keyUpEvent.emit(event);
    return this._allowCharacter(event);
  }

  public changeValue(event) {
    this.group.controls[this.countryCode].setValue(event.value);
    if (this.getFullValue) {
      this.countries.map((country) => {
        if (country.code === event.value) {
          this.changeValueEvent.emit(country);
        }
      });
    }
  }

  public search(query: string) {
    this.selectedOptions = this.select(query);
    if (this.selectedOptions.length === 0) {
      this.selectedOptions.push({text: 'No match found', value: 'noMatchFound'});
      this.disabledOptions = true;
      this.group.controls[this.countryCode].setValue('');
    } else {
      this.disabledOptions = false;
    }
  }

  public select(query: string): string[] {
    const result = [];
    for (const a of this.countries) {
      if (a.name.indexOf(query) > -1 || a.name.toLowerCase().indexOf(query) > -1 || a.dial_code.toLowerCase().indexOf(query) > -1) {
        const text = a.name + ' ( ' + a.dial_code + ' ) ';
        result.push({text, value: a.code});
      }
    }
    return result;
  }

  private _allowCharacter(event): boolean {
    const allowedInputs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'];
    const inputValue = this._getValue();
    let allowInput = false;
    if (allowedInputs.indexOf(event.key) > -1) {
      allowInput = !(
        (inputValue === '' && event.key === '.') ||
        (inputValue.indexOf('.') > -1 && event.key === '.') ||
        (event.key !== '.' && inputValue.indexOf('.') > -1 && inputValue.split('.')[1].length === 2)
      );
    }
    return allowInput;
  }

  private _getValue(): string {
    return this.group.get(this.line).value ? this.group.get(this.line).value.toString() : '';
  }

}
