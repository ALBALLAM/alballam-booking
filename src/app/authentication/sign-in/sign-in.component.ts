import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {variables} from '../../app.variables';
import {CommunicationService} from '../../services/communication/communication.service';
import {StorageService} from '../../services/storage/storage.service';
import {SignInService} from './sign-in.service';
import {UtilitiesService} from '../../services/utilities.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss', '../authentication.component.scss']
})
export class SignInComponent implements OnInit {

  public currentLang;
  public loginResponse;
  public form: FormGroup;
  public emailRegex = variables.emailRegex;
  public emailPatternErrorMessage;
  public translation;
  public errorMessage: string;
  public routeVariables = variables.routes;

  public constructor(private _translate: TranslateService, private _formBuilder: FormBuilder,
                     private _communicationService: CommunicationService,
                     private _signInService: SignInService, private _utilitiesService: UtilitiesService,
                     private _router: Router) {
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation, () => null, () => {
      this.emailPatternErrorMessage = this.translation.GENERAL_ERRORS.INVALID_EMAIL;
      this.prefillForms();
    });
  }

  public ngOnInit() {
    this.currentLang = this._translate.currentLang;
  }

  public prefillForms() {
    const emailToFill = StorageService.getItem(variables.storageVariables.Email);
    if (emailToFill) {
      this._initializeForm(emailToFill);
    } else {
      this._initializeForm();
    }
  }

  public routeToForgetScreen() {
    const formData = this.form.getRawValue();
    if (formData.email && formData.email !== '') {
      StorageService.setItem('forgetPasswordEmail', formData.email);
    }
    this._router.navigate(['/' + this.routeVariables.forgotPassword]);
  }

  public onSubmit() {
    this.errorMessage = '';
    const formData = this.form.getRawValue();
    const loginData = {
      appUserEmail: formData.email.toLowerCase().replace('+', '%2B'),
      appUserPasscode: formData.password,
      loginType: 'app',
      isEmail: true
    };
    this._communicationService.showLoading(true);
    this._signInService.signIn(loginData).subscribe(response => this.loginResponse = response,
      (err) => {
        this.errorMessage = err.data.data.message[this.currentLang];
        this._communicationService.showLoading(false);
      },
      () => {
        StorageService.storeAuthenticationData(this.loginResponse.body.data.result);
        this._communicationService.notifyComponent('app-footer', 'refresh');
        if (this.loginResponse.body.data.result.language) {
          StorageService.storeLanguageData(this.loginResponse.body.data.result.language);
        }
        this._utilitiesService.changeLanguage();
        this._communicationService.showLoading(false);
        this._communicationService.notifyComponent('app-top-bar', 'updateProfile', null);
        if (StorageService.getItem('showDetailsAfterLogin')) {
          StorageService.deleteItem('showDetailsAfterLogin');
          this._utilitiesService.routeToShowDetails();
        } else {
          this._utilitiesService.routeToDashboard();
        }
      }
    );
  }

  public removeErrorMessage(): void {
    this.errorMessage = '';
  }

  private _initializeForm(email = ''): void {
    this.form = this._formBuilder.group({
      email: [email, [Validators.required, Validators.pattern(this.emailRegex)]],
      password: ['', Validators.required]
    });
  }

}
