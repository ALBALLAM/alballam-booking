import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommunicationService} from '../services/communication/communication.service';
import {ProfileService} from './profile.service';
import {DialogComponent} from '../components/dialog/dialog.component';
import {MatDialog, MatMenuTrigger} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {variables} from '../app.variables';
import {countries} from '../modules/form/phone-number/countries';
import {UtilitiesService} from '../services/utilities.service';
import {StorageService} from '../services/storage/storage.service';
import {ImageDialogComponent} from '../components/image-dialog/image-dialog.component';
import {ReceiptPopupComponent} from '../components/receipt-popup/receipt-popup.component';
import {CalendarPopupComponent} from '../components/calendar-popup/calendar-popup.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileResponse;
  public eventsResponse;
  public upcomingEvents = [];
  public pastEvents = [];
  public refundedEvents = [];
  public translation;
  public currentLang;
  public direction;
  public addElement;
  public emailPatternErrorMessage;
  public form: FormGroup;
  public emailRegex = variables.emailRegex;
  public countries = countries;
  public selectedTab = 0;
  public isLoading = true;
  public currentUpcomingPage = 1;
  public currentPastPage = 1;
  public currentRefundedPage = 1;
  @ViewChild(MatMenuTrigger, null) public trigger: MatMenuTrigger;
  @ViewChild('fileInput', null) public fileInput: ElementRef;

  constructor(private _communicationService: CommunicationService, private _profileService: ProfileService,
              private _dialog: MatDialog, private _translate: TranslateService, private _formBuilder: FormBuilder,
              private _utilitiesService: UtilitiesService) {
  }

  @HostListener('window:scroll', ['$event'])
  public onScroll(event) {
    if ((this._isElementInViewport(this.addElement)) || (Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
      if (this.upcomingEvents.length > 0 && this.isLoading === false && this.selectedTab === 0) {
        this.getEventsByType('upcoming');
      }
      if (this.pastEvents.length > 0 && this.isLoading === false && this.selectedTab === 1) {
        this.getEventsByType('past');
      }
      if (this.refundedEvents.length > 0 && this.isLoading === false && this.selectedTab === 2) {
        this.getEventsByType('refunded');
      }
    }
  }

  public ngOnInit() {
    this.addElement = document.getElementById('get-additional');
    this.currentLang = this._translate.currentLang;
    this.direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation,
      () => null, () => {
        this._utilitiesService.setPageTitle(this.translation.TOP_BAR.PROFILE);
        this.emailPatternErrorMessage = this.translation.GENERAL_ERRORS.INVALID_EMAIL;
        this.getProfile(true);
      });
  }

  public getProfile(isInitial = false): void {
    this._communicationService.showLoading(true);
    this._profileService.getProfile().subscribe(response => {
        this.profileResponse = response;
      },
      err => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        if (isInitial) {
          this.getEvents();
        } else {
          this._communicationService.showLoading(false);
        }
        this.updateTopBar();
        this._initializeForm();
      });
  }

  public getEvents(): void {
    this._communicationService.showLoading(true);
    this._profileService.getEvents().subscribe(response => {
        this.eventsResponse = response;
      },
      err => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        this.upcomingEvents = this.eventsResponse.upcoming.data;
        this.pastEvents = this.eventsResponse.past.data;
        this.refundedEvents = this.eventsResponse.refunded.data;
        this.isLoading = false;
        this._communicationService.showLoading(false);
      });
  }

  public getEventsByType(type): void {
    let pageToGet;
    if (type === 'upcoming') { // tslint:disable-line
      this.currentUpcomingPage = this.currentUpcomingPage + 1;
      pageToGet = this.currentUpcomingPage;
    } else if (type === 'past') {
      this.currentPastPage = this.currentPastPage + 1;
      pageToGet = this.currentPastPage;
    } else {
      this.currentRefundedPage = this.currentRefundedPage + 1;
      pageToGet = this.currentRefundedPage;
    }
    if ((this.currentUpcomingPage < (this.eventsResponse.upcoming.totalPages + 1) && type === 'upcoming') ||
      (this.currentPastPage < (this.eventsResponse.past.totalPages + 1) && type === 'past') ||
      (this.currentRefundedPage < (this.eventsResponse.refunded.totalPages + 1) && type === 'refunded')) {
      this._profileService.getEvents(pageToGet).subscribe(response => {
          this.isLoading = true;
          this.eventsResponse = response;
        },
        err => {
          this._communicationService.showLoading(false);
          this._handleErrors(err);
        },
        () => {
          if (type === 'upcoming') { // tslint:disable-line
            this.upcomingEvents = this.upcomingEvents.concat(this.eventsResponse.upcoming.data);
          } else if (type === 'past') {
            this.pastEvents = this.pastEvents.concat(this.eventsResponse.past.data);
          } else {
            this.refundedEvents = this.refundedEvents.concat(this.eventsResponse.refunded.data);
          }
          this.isLoading = false;
          this._communicationService.showLoading(false);
        });
    }
  }

  public saveProfile(): void {
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
    const params = {
      isEmail: this.profileResponse.isEmail,
      name: formData.name,
      email: formData.email
    };
    if (formData.numberCountryCode && formData.numberLine) {
      params['phoneCode'] = chosenCountry.dial_code.replace('+', ''); // tslint:disable-line:no-string-literal
      params['number'] = formData.numberLine; // tslint:disable-line:no-string-literal
    }
    this._communicationService.showLoading(true);
    this._profileService.saveProfile(params).subscribe(response => {
        this.profileResponse = response;
      },
      err => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        this._communicationService.showLoading(false);
        this.getProfile();
      });
  }

  public deleteProfileImage() {
    if (this.profileResponse.image) {
      this._communicationService.showLoading(true);
      let deleteProfileImageResponse;
      this._profileService.deleteProfileImage()
        .subscribe(response => deleteProfileImageResponse = response,
          error => {
            this._handleErrors(error);
            this._communicationService.showLoading(false);
          },
          () => {
            this._communicationService.showLoading(false);
            this.getProfile();
          }
        );
    }
  }

  public updateTopBar() {
    if (this.profileResponse.image) {
      StorageService.setItem(variables.storageVariables.Image, this.profileResponse.image);
    } else {
      StorageService.deleteItem(variables.storageVariables.Image);
    }
    StorageService.setItem(variables.storageVariables.Name, this.profileResponse.name);
    if (this.profileResponse.phoneCode) {
     StorageService.setItem(variables.storageVariables.PhoneCode, this.profileResponse.phoneCode);
    }
    if (this.profileResponse.number) {
      StorageService.setItem(variables.storageVariables.Number, this.profileResponse.number);
    }
    this._communicationService.notifyComponent('app-footer', 'refresh');
    this._communicationService.notifyComponent('app-top-bar', 'updateProfile', null);
  }

  public triggerFileInput(event) {
    this.trigger.closeMenu();
    this.fileInput.nativeElement.click();
  }

  public openImage(event, src) {
    if (src && src !== '') {
      event.stopPropagation();
      this._dialog.open(ImageDialogComponent, {
        data: {
          src
        }
      });
    }
  }

  public async handleSingleImageUpload(event) {
    try {
      this.profileResponse.image = '';
      this._communicationService.showLoading(true);
      const profileImage = await this._utilitiesService.onSelectFile(event);
      const params = {
        image: {data: String(profileImage['compression']).split('base64,')[1]} // tslint:disable-line:no-string-literal
      };
      let changeProfileImageResponse;
      this._profileService.changeProfileImage(params)
        .subscribe(response => changeProfileImageResponse = response,
          error => {
            this._handleErrors(error);
            this._communicationService.showLoading(false);
          },
          () => {
            this._communicationService.showLoading(false);
            this.getProfile();
          }
        );
    } catch (error) {
      this._handleErrors(error);
      this._communicationService.showLoading(false);
    }
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

  public stopPropagation(event) {
    event.stopPropagation();
  }

  public viewReceiptPopup(record) {
    record.direction = this.direction;
    record.currentLang = this.currentLang;
    if (Number.isInteger(record.duration)) {
      record.durationText = this._utilitiesService.convertMinutes(record.duration);
    }
    record.showRefund = false;
    this._dialog.open(ReceiptPopupComponent, {
      panelClass: 'receipt-popup-dialog',
      disableClose: true,
      data: record
    });
  }

  public viewRefundPopup(record) {
    record.direction = this.direction;
    record.currentLang = this.currentLang;
    if (Number.isInteger(record.duration)) {
      record.durationText = this._utilitiesService.convertMinutes(record.duration);
    }
    record.showRefund = true;
    const dialog = this._dialog.open(ReceiptPopupComponent, {
      panelClass: 'receipt-popup-dialog',
      disableClose: true,
      data: record
    });
    dialog.afterClosed().subscribe(result => {
      if (result && result.showWalletUpdate) {
        this.profileResponse.wallet = result.wallet;
        this._communicationService.notifyComponent('app-top-bar', 'changeWallet', {wallet: result.wallet});
        const dialogRef = this._dialog.open(DialogComponent, {
          data: {
            title: this.translation.PROFILE.SUCCESS_REFUND
          }
        });
        dialogRef.afterClosed().subscribe(() => {
          this.getEvents();
        });
      }
    });
  }

  public openCalendarPopUp(record) {
    this._dialog.open(CalendarPopupComponent, {
      panelClass: 'receipt-popup-dialog',
      disableClose: true,
      data: record
    });
  }

  private _initializeForm(): void {
    const fillingData = this.profileResponse;
    this.form = this._formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      numberCountryCode: [''],
      numberLine: ['']
    });
    this.form.controls.name.setValue(fillingData.name);
    this.form.controls.email.setValue(fillingData.email);
    if (fillingData.number) {
      this.form.controls.numberLine.setValue(fillingData.number);
    }
    if (fillingData.phoneCode) {
      for (const item of this.countries) {
        if (item.dial_code === fillingData.phoneCode) {
          this.form.controls.numberCountryCode.setValue(item.code);
          break;
        }
      }
    }
  }

  private _isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  private _handleErrors(error) {
    switch (error.status) {
      case 409:
        this.showAlert(error.data.data.message[this.currentLang], '');
        break;
      default:
        this.showAlert(this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TITLE, this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TEXT);
        break;
    }
  }

}
