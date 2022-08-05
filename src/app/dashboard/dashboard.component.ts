import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';
import { TranslateService } from '@ngx-translate/core';
import { IPlatform, UtilitiesService } from '../services/utilities.service';
import { CommunicationService } from '../services/communication/communication.service';
import { DashboardService } from './dashboard.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../components/dialog/dialog.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { variables } from '../app.variables';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from '../services/permission/permission.service';
import { SuccessBookingComponent } from '../components/success-booking/success-booking.component';
import { Subscription } from 'rxjs/index';
import { CountriesPopupComponent } from '../components/countries-popup/countries-popup.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  public carousselData;
  public selectedShow;
  public recentPlays;
  public featuredActors;
  public carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    speed: 250,
    point: {
      visible: true,
      hideOnSingleSlide: true
    },
    load: 1,
    velocity: 0,
    touch: false,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    loop: true,
    interval: {
      timing: 4000,
      initialDelay: 0
    }
  };
  public carouselTile2: NguCarouselConfig = {
    grid: { xs: 1, sm: 3, md: 4, lg: 6, all: 0 },
    speed: 250,
    point: {
      visible: true,
      hideOnSingleSlide: true
    },
    load: 1,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };
  public currentLang;
  public dashboardResponse;
  public verifyPurchaseResponse;
  public countries: any = []; // tslint:disable-line
  public platform: IPlatform;
  public translation;
  public routeVariables = variables.routes;
  public direction;
  public isAuthenticated;
  public params;
  public subscription: Subscription;
  public subscriptionData;
  @ViewChild(CdkVirtualScrollViewport, null) public virtualScrollViewport?: CdkVirtualScrollViewport;

  constructor(private _translate: TranslateService, private _utilitiesService: UtilitiesService,
    private _changeDetectorRef: ChangeDetectorRef, private _communicationService: CommunicationService,
    private _dashboardService: DashboardService, private _dialog: MatDialog,
    private _permissionService: PermissionService,
    private _activatedRoute: ActivatedRoute) {
    this.isAuthenticated = this._permissionService.checkUserLoggedIn();
    this.subscription = this._communicationService.getData().subscribe(response => {
      this.subscriptionData = response;
      this._subscriptionCallback();
    });
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation,
      () => null,
      () => '');
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.handleResponsiveScroll();
  }

  public ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public ngOnInit() {
    this.currentLang = this._translate.currentLang;
    this.direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if (this.currentLang === 'ar') {
      this.carouselTile.RTL = true;
      this.carouselTile2.RTL = true;
    } else {
      this.carouselTile.RTL = false;
      this.carouselTile2.RTL = false;
    }

    if (this.recentPlays && this.recentPlays.length < 3) {
      this.carouselTile2.grid.sm = this.recentPlays.length;
    }
    if (this.recentPlays && this.recentPlays.length < 4) {
      this.carouselTile2.grid.md = this.recentPlays.length;
    }
    if (this.recentPlays && this.recentPlays.length < 6) {
      this.carouselTile2.grid.lg = this.recentPlays.length;
    }
    this.handleResponsiveScroll();
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation,
      () => null, () => {
        this._utilitiesService.setPageTitle(this.translation.TOP_BAR.HOME);
        this._activatedRoute.queryParams.subscribe(params => {
          this.params = params;
        });
        this.getDashboard();
      });
  }

  public handleResponsiveScroll() {
    this.platform = this._utilitiesService.getPlatform();
    if ((this.platform.isMobile || this.platform.isTablet) && (this.currentLang === 'ar')) {
      setTimeout(() => {
        this.virtualScrollViewport.scrollTo({ right: 0 });
      }, 1);
    }
  }

  public successBookingDialog(fromWallet = false, price = null): void {
    this._dialog.open(SuccessBookingComponent, {
      panelClass: 'success-booking-dialog',
      disableClose: true,
      data: {
        direction: this.direction,
        fromWallet,
        price
      }
    });
  }

  // public getDashboardBySort() {
  //   this.getDashboard(this.sortBy);
  // }

  public getDashboard(sort = null): void {
    this._communicationService.showLoading(true);
    this._dashboardService.getDashboard(sort).subscribe(response => {
      this.dashboardResponse = response;
    },
      err => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        this.carousselData = this.dashboardResponse.carousel;
        this.recentPlays = this.dashboardResponse.recentPlays;
        this.featuredActors = this.dashboardResponse.featuredActors;
        if (this.featuredActors && this.featuredActors.length && this.featuredActors.length > 0) {
          this.featuredActors.forEach(element => {
            if (element.isActor === true) {
              element.label = this.translation.DASHBOARD.ACTOR;
              if (element.isDirector === true) {
                element.label = element.label + ' - ' + this.translation.DASHBOARD.DIRECTOR;
              }
              if (element.isAuthor === true) {
                element.label = element.label + ' - ' + this.translation.DASHBOARD.AUTHOR;
              }
            } else if (element.isDirector === true) {
              element.label = this.translation.DASHBOARD.DIRECTOR;
              if (element.isAuthor === true) {
                element.label = element.label + ' - ' + this.translation.DASHBOARD.AUTHOR;
              }
            } else if (element.isAuthor === true) {
              element.label = this.translation.DASHBOARD.AUTHOR;
            }
          });
        }

        this._communicationService.showLoading(false);
        if (this.params && this.params.success) {
          if (this.params.fromWallet) {
            this.successBookingDialog(true, this.params.price);
          } else {
            this.verifyPurshase();
          }
        }
      });
  }

  public verifyPurshase(): void {
    this._communicationService.showLoading(true);
    this._dashboardService.verifyPurchase(this.params).subscribe(response => {
      this.verifyPurchaseResponse = response;
    },
      err => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        this._communicationService.showLoading(false);
        if (this.verifyPurchaseResponse.fromWallet) {
          this._communicationService.notifyComponent('app-top-bar', 'changeWallet', { wallet: this.verifyPurchaseResponse.wallet });
        }
        this.successBookingDialog();
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

  private _subscriptionCallback(): void {
    if (this.subscriptionData && typeof this.subscriptionData) {
      if (this.subscriptionData.notifyComponent === 'app-dashboard') {
        switch (this.subscriptionData.action) {
          case 'route':
            this._utilitiesService.routeToDashboardFull();
            break;
          case 'updateAuthentication':
            this.isAuthenticated = false;
            break;
          default:
            break;
        }
      }
    }
  }

  private _handleErrors(error) {
    switch (error.status) {
      case 403:
        this._dialog.open(DialogComponent, {
          data: {
            title: error.data.message.data.message[this.currentLang],
            isConfirmationPopUp: false,
            action: 'route',
            actionCallback: true,
            notifyComponent: 'app-dashboard'
          }
        });
        break;
      default:
        this.showAlert(this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TITLE, this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TEXT);
        break;
    }
  }

}
