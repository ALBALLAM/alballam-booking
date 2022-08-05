import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommunicationService} from '../services/communication/communication.service';
import {variables} from '../app.variables';
import {environment} from '../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {StorageService} from '../services/storage/storage.service';
import {ContactUsService} from './contact-us.service';
import {DialogComponent} from '../components/dialog/dialog.component';
import {MatDialog} from '@angular/material';
import {ReCaptchaComponent} from 'angular2-recaptcha';
import {countries} from '../modules/form/phone-number/countries';
import {UtilitiesService} from "../services/utilities.service";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  public form: FormGroup;
  public translation;
  public emailRegex = variables.emailRegex;
  public emailPatternErrorMessage;
  public currentLang;
  public direction;
  public validCaptcha: boolean;
  public countries = countries;
  public isResponsive: boolean;
  public title = 'Contact Us'
  public siteKey: string = environment.captchaSiteKey;
  @ViewChild(ReCaptchaComponent, null) public captcha: ReCaptchaComponent;

  constructor(private _formBuilder: FormBuilder,
              private _utilitiesService: UtilitiesService,
              private _communicationService: CommunicationService,
              private _translate: TranslateService, private _contactUsService: ContactUsService, private _dialog: MatDialog) {
    this.isResponsive = window.innerWidth < 600;
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.isResponsive = window.innerWidth < 600;
  }

  public ngOnInit() {
    this.currentLang = this._translate.currentLang;
    this.direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation, () => null, () => {
      this.emailPatternErrorMessage = this.translation.GENERAL_ERRORS.INVALID_EMAIL;
      this._utilitiesService.setPageTitle(this.translation.CONTACT_US.TITLE);
      this._initializeForm();
    });
  }

  public back(): void {
    history.back();
  }

  public handleCorrectCaptcha(event) {
    this.validCaptcha = true;
  }

  public submitForm() {
    this._communicationService.showLoading(true);
    const formData = this.form.getRawValue();
    const params = {
      name: formData.name,
      email: formData.email,
      phoneNumber: '',
      message: formData.message
    };
    if (formData.numberCountryCode) {
      let chosenCountry;
      for (const item of this.countries) {
        if (item.code === formData.numberCountryCode) {
          chosenCountry = item;
          break;
        }
      }
      params.phoneNumber = chosenCountry.dial_code + formData.numberLine;
    }
    this._contactUsService.submitContactUs(params).subscribe(response => null,
      err => {
        this._handleErrors(err);
        this._communicationService.showLoading(false);
      },
      () => {
        this._communicationService.showLoading(false);
        this.showAlert(this.translation.CONTACT_US.THANK_YOU, '');
        this._initializeForm();
        this.captcha.reset();
      });
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

  private _initializeForm(): void {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      numberCountryCode: [''],
      numberLine: [''],
      message: ['', [Validators.required]]
    });
    const name = StorageService.getItem(variables.storageVariables.Name);
    const email = StorageService.getItem(variables.storageVariables.Email);
    const phoneCode = StorageService.getItem(variables.storageVariables.PhoneCode);
    const phoneNumber = StorageService.getItem(variables.storageVariables.Number);
    if (name) {
      this.form.controls.name.setValue(name);
    }
    if (email) {
      this.form.controls.email.setValue(email);
    }
    if (phoneCode) {
      for (const item of this.countries) {
        if (item.dial_code === phoneCode) {
          this.form.controls.numberCountryCode.setValue(item.code);
          break;
        }
      }
    }
    if (phoneNumber) {
      this.form.controls.numberLine.setValue(phoneNumber);
    }
  }

  private _handleErrors(error) {
    switch (error.status) {
      default:
        this.showAlert(this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TITLE, this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TEXT);
        break;
    }
  }
}
