import {Injectable} from '@angular/core';
import {Cache} from './utils/storage.provider';
// import {Observable} from 'rxjs';
// import {variables} from '../../app.variables';
// import {ApiService} from '../api/api.service';
// import {StorageService} from '../storage/storage.service';
import {environment} from '../../../environments/environment';
// import {Router} from '@angular/router';
// import {CommunicationService} from '../communication/communication.service';
// import {UtilitiesService} from '../utilities.service';

let OneSignal; // tslint:disable-line:variable-name

@Injectable()
export class OneSignalService {
  // public routeVariables = variables.routes;
  @Cache({pool: 'OneSignal'}) public oneSignalInit; // to check if OneSignal is already initialized.
  @Cache({pool: 'OneSignal'}) public oneSignalId; // store OneSignalId in localStorage
  @Cache({pool: 'Token'}) public userSession; // User Session management token

  // constructor(private _apiService: ApiService, private _router: Router, private utilitiesService: UtilitiesService) {
  //   // to do
  // }

  public init() {
    this.initOneSignal();
  }

  public initOneSignal() {
    OneSignal = window['OneSignal'] || []; // tslint:disable-line:no-string-literal
    OneSignal.push(['init', {
      appId: environment.oneSignalAppId,
      autoRegister: true,
      autoResubscribe: true,
      notifyButton: {
        enable: true
      },
      notificationClickHandlerMatch: 'origin',
      notificationClickHandlerAction: 'focus'
    }]);
    this.addClickEventListener();
    this.addEventListeners();
    this.checkIfSubscribed();
  }

  public subscribe() {
    OneSignal.push(() => {
      OneSignal.push(['registerForPushNotifications']);
      OneSignal.on('subscriptionChange', (isSubscribed) => {
        this.getUserID();
      });
    });
  }

  public unsubscribe() {
    OneSignal.setSubscription(false);
  }

  public getUserID() {
    OneSignal.getUserId().then((userId) => {
      this.oneSignalId = userId;
    });
  }

  public checkIfSubscribed() {
    OneSignal.push(() => {
      OneSignal.isPushNotificationsEnabled((isEnabled) => {
        if (isEnabled) {
          this.getUserID();
        } else {
          this.subscribe();
        }
      });
    });
  }

  public addClickEventListener() {
    OneSignal.push(['addListenerForNotificationOpened', (event) => {
      this.addClickEventListener();
    }]);
  }

  public addEventListeners() {
    OneSignal.push(() => {
      OneSignal.on('notificationPermissionChange', (permissionChange) => {
        const currentPermission = permissionChange.to;
        if (currentPermission === 'granted') {
          if (this.oneSignalId) {
            OneSignal.setSubscription(true);
          } else {
            this.subscribe();
          }
        } else {
          this.unsubscribe();
        }
      });

      OneSignal.on('notificationDisplay', (event) => {
        // todo here
      });
    });

    /*OneSignal.push(() => {
      OneSignal.on('notificationDismiss', (event) => {
      });
    });*/
  }

  // public registerNotification() {
  //   if (this.oneSignalId !== undefined) {
  //     const platformID = window.navigator.platform.trim() + '_' + StorageService.getItem(variables.storageVariables.ID)
  //       + '_' + this.utilitiesService.generateRandomString(12);
  //     StorageService.setItem('platformID', platformID);
  //     const params = {
  //       playerId: this.oneSignalId,
  //       deviceId: platformID,
  //       web: true
  //     };
  //     return new Observable(userInfoObservable => {
  //       let apiResponse;
  //       userInfoObservable.next();
  //       userInfoObservable.complete();
  //       this._apiService.sendApi('post', environment.url + variables.AuthenticationUri.registerNotification,
  //         params, true, true)
  //         .subscribe(response => (apiResponse = response),
  //           error => {
  //             userInfoObservable.error(error);
  //           },
  //           () => {
  //             userInfoObservable.next(apiResponse);
  //             userInfoObservable.complete();
  //           }
  //         );
  //     });
  //   }
  // }
}
