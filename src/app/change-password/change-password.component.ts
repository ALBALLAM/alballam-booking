import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {CommunicationService} from '../services/communication/communication.service';
import {ChangePasswordService} from './change-password.service';
import {DialogComponent} from '../components/dialog/dialog.component';
import {TranslateService} from '@ngx-translate/core';

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
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {

  public form: FormGroup;
  public showErrorMessage = false;
  public errorMessage;
  public translation;
  public showForm = true;
  public showSuccess = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialogRef: MatDialogRef<ChangePasswordComponent>,
              private _formBuilder: FormBuilder,
              private _communicationService: CommunicationService,
              private _changePasswordService: ChangePasswordService,
              private _dialog: MatDialog,
              private _translate: TranslateService) {
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation);
  }

  public ngOnInit() {
    this._initializePasswordForm();
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public onChangePassword() {
    this.showErrorMessage = false;
    this.errorMessage = '';
    const formData = this.form.getRawValue();
    const params = {
      oldPassword: formData.old_password,
      newPassword: formData.password
    };
    let changePasswordResponse;
    this._communicationService.showLoading(true);
    this._changePasswordService.changePassword(params).subscribe(response => changePasswordResponse = response,
      (err) => {
        this._handleErrors(err);
        this._communicationService.showLoading(false);
      },
      () => {
        this.showForm = false;
        this.showSuccess = true;
        this._communicationService.showLoading(false);
      }
    );
  }

  // public resetPassword() {
  //   let resetPasswordResponse;
  //   this._communicationService.showLoading(true);
  //   this._changePasswordService.resetPassword({email: this.data.email}).subscribe(response => resetPasswordResponse = response,
  //     (err) => {
  //       this._handleErrors(err);
  //       this._communicationService.showLoading(false);
  //     },
  //     () => {
  //       this.showForm = false;
  //       this._communicationService.showLoading(false);
  //     }
  //   );
  // }

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

  public removeErrorMessage(): void {
    this.showErrorMessage = false;
  }

  private _initializePasswordForm(): void {
    this.form = this._formBuilder.group(
      {
        old_password: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', Validators.required]
      },
      {validator: [matchingConfirmPasswords]});
  }

  private _handleErrors(error) {
    switch (error.status) {
      case 409: {
        this.showErrorMessage = true;
        this.errorMessage = this.translation.GENERAL_ERRORS.WRONG_OLD_PASSWORD;
        break;
      }
      case 500: {
        this.showAlert(this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TITLE, this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TEXT);
        break;
      }
      default:
        this.showAlert(this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TITLE, this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TEXT);
        break;
    }
  }

}
