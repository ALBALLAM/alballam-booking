import {ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommunicationService} from '../../services/communication/communication.service';
import {DialogComponent} from '../dialog/dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {TasksCalendarService} from './tasks-calendar.service';
import {TasksOutlookService} from './tasks-outlook.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-calendar-popup',
  templateUrl: './calendar-popup.component.html',
  styleUrls: ['./calendar-popup.component.scss']
})
export class CalendarPopupComponent implements OnDestroy {

  public translation;
  public subscription: Subscription;
  public subscriptionData;
  public showConfirmation = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialogRef: MatDialogRef<CalendarPopupComponent>,
              private _communicationService: CommunicationService,
              private _tasksGmailService: TasksCalendarService,
              private _dialog: MatDialog,
              private _translate: TranslateService,
              private _tasksOutlookService: TasksOutlookService,
              private _ref: ChangeDetectorRef) {
    this.subscription = this._communicationService.getData().subscribe(response => {
      this.subscriptionData = response;
      this._subscriptionCallback();
    });
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation);
  }

  public closePopup() {
    location.reload();
    this.dialogRef.close();
    this._ref.detectChanges();
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public addEventToCalendar(type) {
    switch (type) {
      case 'gmail':
        this.addCalendarToGmail();
        break;
      case 'outlook':
        this.addCalendarToOutlook();
        break;
      default:
        break;
    }
  }

  public addCalendarToGmail(): void {
    this._tasksGmailService.getGoogleCalendarSignIn(this.data).subscribe(gmailResponse => {
        this._ref.detectChanges();
        this.showConfirmation = true;
      },
      err => {
        this._handleErrors(err);
        this._ref.detectChanges();
        this._communicationService.showLoading(false);
      },
      () => {
        this._ref.detectChanges();
        this.showConfirmation = true;
        this._communicationService.showLoading(false);
      }
    );
  }

  public addCalendarToOutlook(): void {
    this._tasksOutlookService.microsoftInitialLogin(this.data);
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

  private _handleErrors(error) {
    switch (error.status) {
      default:
        this.showAlert(this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TITLE, this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TEXT);
        break;
    }
  }

  private _subscriptionCallback(): void {
    if (this.subscriptionData && typeof this.subscriptionData) {
      if (this.subscriptionData.notifyComponent === 'app-calendar-popup') {
        switch (this.subscriptionData.action) {
          case 'addEventError':
            this._handleErrors(this.subscriptionData.data);
            break;
          case 'addEventSuccessful':
            this.showAlert(this.translation.COMMON.SUCCESS, this.translation.PROFILE.EVENT_SUCCESS);
            break;
          default:
            break;
        }
      }
    }
  }

}
