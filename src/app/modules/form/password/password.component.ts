import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatFormFieldAppearance} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {
  @Input() public label: string;
  @Input() public title: string;
  @Input() public required: boolean;
  @Input() public disabled: boolean;
  @Input() public group: FormGroup;
  @Input() public name: string;
  @Input() public icon: string;
  @Input() public svgIcon: string;
  @Input() public meter: boolean;
  @Input() public minLength: boolean;
  @Input() public appearance: MatFormFieldAppearance;
  @Input() public patternErrorMessage: string;
  @Input() public hint: string;
  @Input() public currentLang: string;
  public percentage = 0;
  public password_title: string;
  public password_class: string;
  public value: string;
  public color = '';
  public translation;
  @Output() public keyUpEvent = new EventEmitter();

  constructor(private _translate: TranslateService) {
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation);
  }

  public triggerKeyUp(event) {
    this.keyUpEvent.emit(event);
  }

  public getPasswordStrength() {
    if (this.meter) {
      const expressionUpperCase = new RegExp('[A-Z]');
      const expressionNumber = new RegExp('[0-9]');
      const expressionSpecialCharacters = new RegExp('[!@#$%^&*(),.?\":{}|<>]');
      const value = this.group.controls[this.name].value;

      if (value === '') {
        this.percentage = 0;
        this.password_title = '';
      } else if (value.length < 8) {
        this.percentage = 33.33;
        this.password_title = this.translation.AUTHENTICATION.PASSWORD_METER_WEAK;
        this.password_class = 'weak';
      } else if (value.length >= 8) {
        if ((expressionUpperCase.test(value) === true && expressionNumber.test(value) === true)
          || (expressionNumber.test(value) === true && expressionSpecialCharacters.test(value) === true)
          || (expressionSpecialCharacters.test(value) === true && expressionUpperCase.test(value) === true)) {
          this.percentage = 100;
          this.password_title = this.translation.AUTHENTICATION.PASSWORD_METER_STRONG;
          this.password_class = 'strong';
        } else {
          this.percentage = 66.66;
          this.password_title = this.translation.AUTHENTICATION.PASSWORD_METER_MEDIUM;
          this.password_class = 'medium';
        }
      }
    }
  }
}
