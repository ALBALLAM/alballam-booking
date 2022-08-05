import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {variables} from '../../app.variables';
import {TranslateService} from '@ngx-translate/core';
import {CommunicationService} from '../../services/communication/communication.service';
import {UtilitiesService} from '../../services/utilities.service';
import {ForgotPasswordService} from './forget-password.service';
import {DialogComponent} from '../../components/dialog/dialog.component';
import {MatDialog} from '@angular/material';
import {StorageService} from '../../services/storage/storage.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss', '../authentication.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  public currentLang;
  public forgetPasswordResponse;
  public submitOtpResponse;
  public resendOtpResponse;
  public form: FormGroup;
  public formOTP: FormGroup;
  public emailRegex = variables.emailRegex;
  public emailPatternErrorMessage;
  public translation;
  public forgetPasswordData;
  public errorMessage: string;
  public showOtp = false;
  public otpDisabled = true;

  public constructor(private _translate: TranslateService, private _formBuilder: FormBuilder,
                     private _communicationService: CommunicationService,
                     private _forgetPasswordService: ForgotPasswordService, private _utilitiesService: UtilitiesService,
                     private _dialog: MatDialog) {
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation, () => null, () => {
      this.emailPatternErrorMessage = this.translation.GENERAL_ERRORS.INVALID_EMAIL;
      this.prefillForm();
    });
  }

  public prefillForm() {
    const email = StorageService.getItem('forgetPasswordEmail');
    this._initializeForm(email);
    StorageService.deleteItem('forgetPasswordEmail');
  }

  public ngOnInit() {
    this.currentLang = this._translate.currentLang;
  }

  public back() {
    this._utilitiesService.routeToLogin();
  }

  public backToForgotScreen() {
    this.errorMessage = '';
    this.showOtp = false;
  }

  public onSubmit() {
    this.errorMessage = '';
    const formData = this.form.getRawValue();
    this.forgetPasswordData = {
      username: formData.email.toLowerCase().replace('+', '%2B'),
      isEmail: true
    };
    this._communicationService.showLoading(true);
    this._forgetPasswordService.resetPassword(this.forgetPasswordData).subscribe(response => this.forgetPasswordResponse = response,
      (err) => {
        this.errorMessage = err.data.data.message[this.currentLang];
        this._communicationService.showLoading(false);
      },
      () => {
        this._initializeOTPForm();
        this.showOtp = true;
        this._communicationService.showLoading(false);
      }
    );
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

  public onSubmitOTP() {
    this.errorMessage = '';
    const formData = this.formOTP.getRawValue();
    let fullOtp = '';
    for (const data in formData) {
      fullOtp += formData[data];
    }
    const dataToSend = {
      username: this.forgetPasswordData.username,
      isEmail: true,
      otp: fullOtp
    };
    this._communicationService.showLoading(true);
    this._forgetPasswordService.submitOTP(dataToSend).subscribe(response => this.submitOtpResponse = response,
      (err) => {
        this.errorMessage = err.data.data.message[this.currentLang];
        this.formOTP.reset();
        document.getElementById('otp1').focus();
        this._communicationService.showLoading(false);
      },
      () => {
        this.showAlert(this.translation.AUTHENTICATION.FORGET_PASSWORD_SUCCESS, '');
        this._utilitiesService.routeToLogin();
        this._communicationService.showLoading(false);
      }
    );
  }

  public showAlert(title: string, content: string): void {
    const dialogId = new Date();
    this._communicationService.setLatestDialogId(dialogId);
    this._dialog.open(DialogComponent, {
      data: {
        title,
        content,
        isConfirmationPopUp: false
      }
    });
  }

  public resendOtp() {
    if (!this.otpDisabled) {
      this.otpDisabled = true;
      this.errorMessage = '';
      this._initializeOTPForm();
      this._communicationService.showLoading(true);
      this._forgetPasswordService.resendOTP(this.forgetPasswordData).subscribe(response => this.resendOtpResponse = response,
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

  public removeErrorMessage(): void {
    this.errorMessage = '';
  }

  public checkNumber(event, number) { // tslint:disable-line
    return this._allowCharacter(event, number);
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

  private _initializeForm(email = ''): void {
    this.form = this._formBuilder.group({
      email: [email, [Validators.required, Validators.pattern(this.emailRegex)]]
    });
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

}
