import {Component, HostListener, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CommunicationService} from '../services/communication/communication.service';
import {PlaysService} from './plays.service';
import {DialogComponent} from '../components/dialog/dialog.component';
import {MatDialog} from '@angular/material';
import {PermissionService} from '../services/permission/permission.service';
import {UtilitiesService} from '../services/utilities.service';
import {CountriesPopupComponent} from '../components/countries-popup/countries-popup.component';
import {DashboardService} from '../dashboard/dashboard.service';

@Component({
  selector: 'app-plays',
  templateUrl: './plays.component.html',
  styleUrls: ['./plays.component.scss']
})
export class PlaysComponent implements OnInit {

  public currentLang;
  public direction;
  public plays = [];
  public pageIndex = 0;
  public showResults: boolean;
  public isLoading = true;
  public playsResponse;
  public translation;
  public addElement;
  public searchParams;
  public sortByOptions = [];
  public sortBy;
  public countries:any = []; // tslint:disable-line
  public selectedShow;
  public search = '';
  public isAuthenticated: boolean;

  constructor(private _translate: TranslateService, private _communicationService: CommunicationService,
              private _playsService: PlaysService, private _dialog: MatDialog,
              private _permissionService: PermissionService, private _utilitiesService: UtilitiesService,
              private _dashboardService: DashboardService) {
    this.isAuthenticated = this._permissionService.checkUserLoggedIn();
    this.currentLang = this._translate.currentLang;
    this.direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  @HostListener('window:scroll', ['$event'])
  public onScroll(event) {
    if ((this._isElementInViewport(this.addElement)) || (Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
      if (this.plays.length > 0 && this.showResults && this.isLoading === false) {
        this._getPlays(this.searchParams);
      }
    }
  }

  public ngOnInit() {
    this.addElement = document.getElementById('get-additional');
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation,
      err => null, () => {
        this._utilitiesService.setPageTitle(this.translation.TOP_BAR.PLAYS);
        this.sortByOptions = [
          {text: this.translation.PLAYS.SORT_BY_NAME, value: 'showName'},
          {text: this.translation.PLAYS.SORT_BY_DATE, value: 'playDate'},
          {text: this.translation.PLAYS.SORT_BY_PRICE, value: 'minPrice'}
        ];
        this._getPlays(null, true);
      });
  }

  public clearFilter() {
    if (this.search === '') {
      delete this.searchParams.search;
      this._getPlays(this.searchParams, true);
    }
  }

  public enterFilter() {
    if (this.search !== '') {
      this.filterPlays();
    }
  }

  public filterPlays() {
    this.searchParams = {};
    if (this.search !== '') {
      this.searchParams.search = this.search;
    }
    if (this.sortBy) {
      this.searchParams.sortField = this.sortBy;
    }
    this._getPlays(this.searchParams, true);
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

  public bookShow(show) {
    if (this.isAuthenticated) {
      this.selectedShow = show;
      this.getCountriesByShow(show._id);
    } else {
      this._utilitiesService.routeToLogin();
    }
  }

  public getCountriesByShow(showID): void {
    this._communicationService.showLoading(true);
    this._dashboardService.getCountriesByShow(showID).subscribe(response => {
        this.countries = response;
      },
      err => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        this._communicationService.showLoading(false);
        this._dialog.open(CountriesPopupComponent, {
          panelClass: 'countries-popup-dialog',
          disableClose: true,
          data: {
            direction: this.direction,
            currentLang: this.currentLang,
            countries: this.countries,
            show: this.selectedShow
          }
        });
      });
  }

  public _getPlays(params, resetData = false): void {
    this.isLoading = true;
    if (resetData) {
      this.pageIndex = 0;
    }
    this.pageIndex = this.pageIndex + 1;
    if (this.pageIndex === 1 || this.pageIndex <= this.playsResponse.totalPages) {
      if (this.pageIndex === 1) {
        window.scroll(0, 0);
        this._communicationService.showLoading(true);
      }
      let queryParam = 'page=' + this.pageIndex;
      for (const key in params) {
        queryParam += '&' + key + '=' + params[key];
      }
      this._playsService.getPlays(queryParam).subscribe(response => {
          this.playsResponse = response;
        },
        err => {
          this._handleErrors(err);
          this._communicationService.showLoading(false);
        },
        () => {
          if (this.playsResponse.data) {
            if (resetData) {
              this.plays = [];
            }
            this.plays = this.plays.concat(this.playsResponse.data);
          }
          this.showResults = true;
          this.isLoading = false;
          this._communicationService.showLoading(false);
        }
      );
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
      default:
        this.showAlert(this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TITLE, this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TEXT);
        break;
    }
  }
}
