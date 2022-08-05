import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent implements OnInit {
  @Input() public label: string;
  @Input() public title: string;
  @Input() public titleEmpty: boolean;
  @Input() public value: string;
  @Input() public required: boolean;
  @Input() public disabled: boolean;
  @Input() public filterTransaction = false;
  @Input() public group: FormGroup;
  @Input() public matPrefix: boolean;
  @Input() public name: string;
  @Input() public icon: string;
  @Input() public prefixText: string;
  @Input() public svgIcon: string;
  @Input() public appearance: string;
  @Input() public hint: string;
  @Input() public invalidPattern: string;
  @Input() public minError: string;
  @Input() public maxError: string;
  @Input() public maxLength: string;
  @Input() public minLength: string;
  @Input() public isInteger: boolean;
  @Input() public isPhoneNumber: boolean;
  @Input() public patternErrorMessage: string;
  @Output() public eventEmitter = new EventEmitter();
  @Output() public keyUpEvent = new EventEmitter();

  constructor(private _decimalPipe: DecimalPipe) {
  }

  public ngOnInit() {
    this.group.controls[this.name].setValue(this._formatNumber(this.group.controls[this.name].value));
  }

  public onChange(event) {
    this.keyUpEvent.emit(event);
    const inputValue = this._getValue();
    if (this._allowCharacter(event) && event.key !== '.') {
      this.group.controls[this.name].setValue(this._formatNumber(inputValue));
    }
  }

  public onKeyPress(event) {
    return this._allowCharacter(event);
  }

  public onBlur() {
    const inputValue = this._getValue();
    this.eventEmitter.emit(inputValue.replace(/\,/g, ''));
    if (inputValue.endsWith('.')) {
      this.group.controls[this.name].setValue(this._formatNumber(inputValue));
    }
  }

  private _allowCharacter(event): boolean {
    const allowedInputs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'];
    if (!this.isInteger) {
      allowedInputs.push('.');
    }
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
    return this.group.get(this.name).value ? this.group.get(this.name).value.toString() : '';
  }

  private _formatNumber(inputValue) {
    if (inputValue) {
      const value = inputValue.toString().replace(/\,/g, '');
      if (this.isPhoneNumber) {
        return value;
      } else {
        return this._decimalPipe.transform(value);
      }
    }
  }
}
