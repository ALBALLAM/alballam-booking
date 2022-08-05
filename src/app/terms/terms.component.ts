import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TermsService} from './terms.service';
import {CommunicationService} from '../services/communication/communication.service';
import {DialogComponent} from '../components/dialog/dialog.component';
import {MatDialog} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {variables} from '../app.variables';
import {UtilitiesService} from "../services/utilities.service";

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  public type: string;
  public termsResponse;
  public translation;
  public routeVariables = variables.routes;
  public currentLang;
  public direction;

  constructor(private _router: Router, private _termsService: TermsService,
              private _utilitiesService: UtilitiesService,
              private _communicationService: CommunicationService,
              private _dialog: MatDialog, private _translate: TranslateService) {
    this.currentLang = this._translate.currentLang;
    this.direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  public ngOnInit() {
    const currentRoute = this._router.url.split('?')[0];
    if (currentRoute.indexOf(this.routeVariables.terms) > -1) {
      this.type = 'Terms';
    } else if (currentRoute.indexOf(this.routeVariables.aboutUs) > -1) {
      this.type = 'aboutUs';
    } else if (currentRoute.indexOf(this.routeVariables.howItWorks) > -1) {
      this.type = 'howItWorks';
    }
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation,
      err => null, () => {

        if (currentRoute.indexOf(this.routeVariables.terms) > -1) {
          this._utilitiesService.setPageTitle(this.translation.TOP_BAR.TERMS);
        } else if (currentRoute.indexOf(this.routeVariables.aboutUs) > -1) {
          this._utilitiesService.setPageTitle(this.translation.TOP_BAR.ABOUT_US);
        } else if (currentRoute.indexOf(this.routeVariables.howItWorks) > -1) {
          this._utilitiesService.setPageTitle(this.translation.TOP_BAR.HOW_IT_WORKS);
        }
        this.getStaticPages();
      });
  }

  public back(): void {
    history.back();
  }

  public getStaticPages(): void {
    this._communicationService.showLoading(true);
    this._termsService.getStaticPages(this.type).subscribe(response => {
        this.termsResponse = response;
      },
      err => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        this._communicationService.showLoading(false);
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

  private _handleErrors(error) {
    switch (error.status) {
      default:
        this.showAlert(this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TITLE, this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TEXT);
        break;
    }
  }

}
