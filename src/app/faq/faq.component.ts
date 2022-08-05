import {Component, OnInit} from '@angular/core';
import {CommunicationService} from '../services/communication/communication.service';
import {FaqService} from './faq.service';
import {TranslateService} from '@ngx-translate/core';
import {DialogComponent} from '../components/dialog/dialog.component';
import {MatDialog} from '@angular/material';
import {UtilitiesService} from "../services/utilities.service";

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public faqs;
  public currentLang;
  public direction;
  public translation;

  constructor(private _communicationService: CommunicationService,
              private _utilitiesService: UtilitiesService,
              private _faqService: FaqService,
              private _translate: TranslateService, private _dialog: MatDialog) {
    this.currentLang = this._translate.currentLang;
    this.direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  public ngOnInit() {
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation,
      err => null, () => {
        this._utilitiesService.setPageTitle(this.translation.TOP_BAR.FAQs);
        this._getFaqs();
      });
  }

  public back(): void {
    history.back();
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

  private _getFaqs(): void {
    this._communicationService.showLoading(true);
    this._faqService.getFaqs().subscribe(response => {
        this.faqs = response;
      },
      (err) => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        this._communicationService.showLoading(false);
      }
    );
  }

  private _handleErrors(error) {
    switch (error.status) {
      default:
        this.showAlert(this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TITLE, this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TEXT);
        break;
    }
  }
}
