import {Component, OnInit} from '@angular/core';
import {variables} from '../../app.variables';
import {FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {CommunicationService} from '../../services/communication/communication.service';
import {TranslateService} from '@ngx-translate/core';
import {SignUpService} from './sign-up.service';
import {countries} from '../../modules/form/phone-number/countries';
import {UtilitiesService} from '../../services/utilities.service';

export const matchingConfirmPasswords: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const formValues = control.value;

  if (formValues.confirm_password === '') {
    control.get('confirm_password').setErrors({required: true});
  } else if (formValues.password && formValues.confirm_password && formValues.password !== formValues.confirm_password) {
    control.get('confirm_password').setErrors({passwordsMismatch: true});
  } else {
    control.get('confirm_password').setErrors(null);
  }
  return null;
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../authentication.component.scss']
})

export class SignUpComponent implements OnInit {

  public currentLang;
  public signUpResponse;
  public submitUserOtpResponse;
  public resendOtpResponse;
  public form: FormGroup;
  public formOTP: FormGroup;
  public emailRegex = variables.emailRegex;
  public emailPatternErrorMessage;
  public translation;
  public errorMessage: string;
  public countries = countries;
  public showOtp = false;
  public otpDisabled = false;
  public signUpData;

  constructor(private _translate: TranslateService, private _formBuilder: FormBuilder,
              private _communicationService: CommunicationService,
              private _signUpService: SignUpService, private _utilitiesService: UtilitiesService) {
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation, () => null, () => {
      this.emailPatternErrorMessage = this.translation.GENERAL_ERRORS.INVALID_EMAIL;
      this._initializeForm();
    });
  }

  public ngOnInit() {
    this.currentLang = this._translate.currentLang;
  }

  public onSubmit() {
    this.errorMessage = '';
    const formData = this.form.getRawValue();
    let chosenCountry;
    if (formData.numberCountryCode) {
      for (const item of this.countries) {
        if (item.code === formData.numberCountryCode) {
          chosenCountry = item;
          break;
        }
      }
    }
    const loginData = {
      email: formData.email.toLowerCase().replace('+', '%2B'),
      name: formData.name,
      password: formData.password
    };
    if (formData.numberCountryCode && formData.numberLine) {
      loginData['phoneCode'] = chosenCountry.dial_code.replace('+', ''); // tslint:disable-line:no-string-literal
      loginData['number'] = formData.numberLine; // tslint:disable-line:no-string-literal
    }
    this._communicationService.showLoading(true);
    this._signUpService.signUp(loginData).subscribe(response => this.signUpResponse = response,
      (err) => {
        this.errorMessage = err.data.data.message[this.currentLang];
        this._communicationService.showLoading(false);
      },
      () => {
        this.signUpData = loginData;
        this._communicationService.showLoading(false);
        this._initializeOTPForm();
        this.showOtp = true;
      }
    );
  }

  public back() {
    this.errorMessage = '';
    this.showOtp = false;
  }

  public removeErrorMessage(): void {
    this.errorMessage = '';
  }

  public switchOtpField(event, otpField) {
    this.errorMessage = '';
    const allowed = this._allowCharacter(event, otpField);
    if (allowed) {
      if (this.formOTP.valid) {
        this.onSubmitOTP();
      } else {
        let idToMoveFocus;
        if (event.code === 'Backspace') {
          idToMoveFocus = 'otp' + (otpField - 1);
        } else {
          idToMoveFocus = 'otp' + (otpField + 1);
        }
        if (idToMoveFocus !== 'otp5' && idToMoveFocus !== 'otp0') {
          setTimeout(() => document.getElementById(idToMoveFocus).focus(), 0);
        }
      }
    }
  }

  public resendOtp() {
    if (!this.otpDisabled) {
      this.otpDisabled = true;
      this.errorMessage = '';
      this._initializeOTPForm();
      const resendOtpParams = {
        username: this.signUpData.email,
        isEmail: true
      };
      this._communicationService.showLoading(true);
      this._signUpService.resendOTP(resendOtpParams).subscribe(response => this.resendOtpResponse = response,
        (err) => {
          this.errorMessage = err.data.data.message[this.currentLang];
          this.formOTP.reset();
          document.getElementById('otp1').focus();
          this._communicationService.showLoading(false);
        },
        () => {
          this.formOTP.reset();
          document.getElementById('otp1').focus();
          this._communicationService.showLoading(false);
        }
      );
    }
  }

  public onSubmitOTP() {
    this.errorMessage = '';
    const formData = this.formOTP.getRawValue();
    let fullOtp = '';
    for (const data in formData) {
      fullOtp += formData[data];
    }
    const checkUserOtpParams = {
      username: this.signUpData.email,
      otp: fullOtp,
      isEmail: true

    };
    this._communicationService.showLoading(true);
    this._signUpService.checkOTP(checkUserOtpParams).subscribe(response => this.submitUserOtpResponse = response,
      (err) => {
        this.errorMessage = err.data.data.message[this.currentLang];
        this.formOTP.reset();
        document.getElementById('otp1').focus();
        this._communicationService.showLoading(false);
      },
      () => {
        this._utilitiesService.routeToLogin();
        this._communicationService.showLoading(false);
      }
    );
  }

  public checkNumber(event, number) { // tslint:disable-line
    return this._allowCharacter(event, number);
  }

  private _allowCharacter(event, number): boolean { // tslint:disable-line
    const allowedInputs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'];
    const inputValue = this.formOTP.controls['otp' + number].value;
    let allowInput = false;
    if (allowedInputs.indexOf(event.key) > -1) {
      allowInput = !(
        (inputValue === '' && event.key === '.') ||
        (inputValue && inputValue.indexOf('.') > -1 && event.key === '.') ||
        (inputValue && event.key !== '.' && inputValue.indexOf('.') > -1 && inputValue.split('.')[1].length === 2)
      );
    }
    return allowInput;
  }

  private _initializeForm(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
      numberCountryCode: [''],
      numberLine: ['']
    }, {validator: [matchingConfirmPasswords]});
  }

  private _initializeOTPForm(): void {
    setTimeout(() => {
      this.otpDisabled = false;
    }, 60000);
    this.formOTP = this._formBuilder.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required]
    });
  }
}
