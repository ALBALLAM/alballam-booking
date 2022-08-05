import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommunicationService} from '../services/communication/communication.service';
import {Router} from '@angular/router';
import {StorageService} from '../services/storage/storage.service';
import {variables} from '../app.variables';
import {Subscription} from 'rxjs';
import {UtilitiesService} from '../services/utilities.service';
import {TranslateService} from '@ngx-translate/core';
import {DialogComponent} from '../components/dialog/dialog.component';
import {MatDialog, MatMenuTrigger} from '@angular/material';
import {PermissionService} from '../services/permission/permission.service';
import {DefaultLayoutService} from '../layout/default-layout/default-layout.service';
import {ChangePasswordComponent} from '../change-password/change-password.component';

@Component({
  selector: 'app-top-bar-content',
  templateUrl: './top-bar-content.component.html',
  styleUrls: ['./top-bar-content.component.scss']
})
export class TopBarContentComponent implements OnInit, OnDestroy {

  public isAuthenticated = true;
  public defaultLanguage;
  public logoutResponse;
  public subscription: Subscription;
  public subscriptionData;
  public translation;
  public languages = [];
  public currentLang;
  public isResponsive;
  public profileImage;
  public profileName;
  public wallet;
  public direction;
  public currentRoute;
  public routeVariables = variables.routes;
  @ViewChild(MatMenuTrigger, null) public trigger: MatMenuTrigger;

  constructor(private _communicationService: CommunicationService, private _router: Router,
              private _utilitiesService: UtilitiesService, private _translate: TranslateService,
              private _dialog: MatDialog, private _permissionService: PermissionService,
              private _defaultLayoutService: DefaultLayoutService) {
    this.isAuthenticated = this._permissionService.checkUserLoggedIn();
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation);
    this.subscription = this._communicationService.getData().subscribe(response => {
      this.subscriptionData = response;
      this._subscriptionCallback();
    });
  }

  public ngOnInit() {
    if (this.isAuthenticated) {
      this.updateProfile();
    }
    this.isResponsive = window.innerWidth < 600;
    window.onresize = () => {
      this.isResponsive = window.innerWidth < 600;
    };
    this.currentLang = this._translate.currentLang;
    this.direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.languages = this._utilitiesService.getLanguageArray();
    this.initializeArray();
  }

  public initializeArray() {
    for (const lang of this.languages) {
      if (lang.id === this.currentLang) {
        this.defaultLanguage = lang;
      }
    }
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public openProfileScreen() {
    this._router.navigate(['/' + this.routeVariables.profile]);
  }

  public changeLanguage(language) {
    StorageService.storeLanguageData(language.id);
    this._utilitiesService.changeLanguage();
    window.location.reload();
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

  public logoutUserDialog(): void {
    const dialogId = new Date();
    this._communicationService.setLatestDialogId(dialogId);
    this._dialog.open(DialogComponent, {
      data: {
        title: this.translation.CONFIRMATION.LOGOUT,
        isConfirmationPopUp: true,
        action: 'logout',
        notifyComponent: 'app-top-bar'
      }
    });
  }

  public changePasswordDialog(event): void {
    this.trigger.closeMenu();
    this._dialog.open(ChangePasswordComponent, {
      disableClose: true,
      panelClass: 'change-password-dialog',
      data: {
        language: this.currentLang
      }
    });
  }

  public logoutUser() {
    const platformID = StorageService.getItem('platformID');
    this._communicationService.showLoading(true);
    this._defaultLayoutService.logout({deviceID: platformID}).subscribe(response => this.logoutResponse = response,
      () => {
        StorageService.deleteAuthenticationData();
        this._communicationService.notifyComponent('app-footer', 'logout');
        this._utilitiesService.routeToLogin();
        this._communicationService.showLoading(false);
        this.isAuthenticated = false;
      },
      () => {
        StorageService.deleteAuthenticationData();
        this._communicationService.notifyComponent('app-footer', 'logout');
        this._communicationService.showLoading(false);
        this.isAuthenticated = false;
        this._communicationService.notifyComponent('app-dashboard', 'updateAuthentication', null);
        this._utilitiesService.routeToDashboard();
      }
    );
  }

  private updateProfile() {
    this.isAuthenticated = true;
    this.profileName = StorageService.getItem(variables.storageVariables.Name);
    this.wallet = StorageService.getItem(variables.storageVariables.Wallet);
    if (StorageService.getItem(variables.storageVariables.Image)) {
      this.profileImage = StorageService.getItem(variables.storageVariables.Image);
    } else {
      this.profileImage = null;
    }
  }

  private _subscriptionCallback(): void {
    if (this.subscriptionData && typeof this.subscriptionData) {
      if (this.subscriptionData.notifyComponent === 'app-top-bar') {
        switch (this.subscriptionData.action) {
          case 'logout':
            this.logoutUser();
            break;
          case 'updateProfile':
            this.updateProfile();
            break;
          case 'removeAuthentication':
            this.isAuthenticated = false;
            break;
          case 'changeRoute':
            this.currentRoute = this.subscriptionData.data.currentRoute;
            break;
          case 'changeWallet':
            this.wallet = this.subscriptionData.data.wallet;
            StorageService.setItem(variables.storageVariables.Wallet, this.wallet);
            break;
          default:
            break;
        }
      }
    }
  }
}
