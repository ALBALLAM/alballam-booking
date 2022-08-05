import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IconService} from './services/icon/icon.service';
import {Subscription} from 'rxjs';
import {CommunicationService} from './services/communication/communication.service';
import {LoggerService} from './logger/logger.service';
import {MatDialog} from '@angular/material';
import {UtilitiesService} from './services/utilities.service';
import {variables} from './app.variables';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public subscription: Subscription;
  public subscriptionData;
  public showLoading = false;
  public routeGoogleAnalytics;
  public routeVariables = variables.routes;

  constructor(private _communicationService: CommunicationService,
              private _translate: TranslateService,
              private _iconsService: IconService,
              private _loggerService: LoggerService,
              private _dialog: MatDialog,
              private _utilitiesService: UtilitiesService,
              private _router: Router,
              private _ref: ChangeDetectorRef) { // tslint:disable-line
    this._translate.setDefaultLang('en');
    this._utilitiesService.changeLanguage();
    this._initializeIcons();
    this._communicationService.showLoading(false);
    // this._oneSignalService.init();
    this.subscription = this._communicationService.getData().subscribe(
      response => {
        this.subscriptionData = response;
        this.subscriptionCallback();
      }, (err) => {
        this._loggerService.log(err);
      });
    this.handleGoogleAnalytics();
  }

  public handleGoogleAnalytics() {
    this.routeGoogleAnalytics = {
      ['/' + this.routeVariables.signUp]: variables.googleAnalytics.register_screen,
      ['/' + this.routeVariables.signIn]: variables.googleAnalytics.login_screen,
      ['/' + this.routeVariables.forgotPassword]: variables.googleAnalytics.forgot_password_screen,
      ['/' + this.routeVariables.contactUs]: variables.googleAnalytics.contactUs_screen,
      ['/' + this.routeVariables.howItWorks]: variables.googleAnalytics.howItWorks_screen,
      ['/' + this.routeVariables.aboutUs]: variables.googleAnalytics.aboutUs_screen,
      ['/' + this.routeVariables.terms]: variables.googleAnalytics.terms_screen,
      ['/' + this.routeVariables.dashboard_full]: variables.googleAnalytics.dashboard_screen,
      ['/' + this.routeVariables.plays]: variables.googleAnalytics.plays_screen,
      ['/' + this.routeVariables.show]: variables.googleAnalytics.show_details_screen,
      ['/' + this.routeVariables.profile]: variables.googleAnalytics.profile_screen,
      ['/' + this.routeVariables.faqs]: variables.googleAnalytics.faqs_screen
    };
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const eventRoute = event.urlAfterRedirects.split('?')[0];
        let found = false;
        for (const key in this.routeGoogleAnalytics) {
          if (eventRoute.indexOf(key) > -1) {
            found = true;
            this._utilitiesService.emitScreen(key, this.routeGoogleAnalytics[key]);
            break;
          }
        }
        if (!found) {
          const key = '/' + this.routeVariables.dashboard_full;
          this._utilitiesService.emitScreen(key, this.routeGoogleAnalytics[key]);
        }
      }
    });
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public subscriptionCallback(): void {
    this._loggerService.log(this.subscriptionData, '_subscriptionCallback');
    if (this.subscriptionData && typeof (this.subscriptionData)) {
      if (this.subscriptionData.notifyComponent === 'app-loading') {
        setTimeout(function() {
          this.showLoading = this.subscriptionData.show;
          this._ref.detectChanges();
        }.bind(this), 1);
        // this.showLoading = this.subscriptionData.show;
      }
      if (this.subscriptionData.notifyComponent === 'app-root' && this.subscriptionData.action === 'close-dialog') {
        this._dialog.closeAll();
      }
    }
  }

  private _initializeIcons() {
    this._iconsService.initializeCustomIcons();
    this._iconsService.initializeShowIcons();
  }
}


