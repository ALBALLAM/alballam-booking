import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {variables} from '../../app.variables';
import {ApiService} from '../../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private _apiService: ApiService) { }

  public resetPassword(params) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      this._apiService.sendApi('post', environment.url + variables.AuthenticationUri.forgotPassword,
        params, false, true)
        .subscribe(response => (apiResponse = response),
          error => {
            userInfoObservable.error(error);
          },
          () => {
            userInfoObservable.next(apiResponse);
            userInfoObservable.complete();
          }
        );
    });
  }

  public submitOTP(params) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      this._apiService.sendApi('post', environment.url + variables.AuthenticationUri.resetPasswordCheckToken,
        params, false, false)
        .subscribe(response => (apiResponse = response),
          error => {
            userInfoObservable.error(error);
          },
          () => {
            userInfoObservable.next(apiResponse);
            userInfoObservable.complete();
          }
        );
    });
  }

  public resendOTP(params) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      this._apiService.sendApi('post', environment.url + variables.AuthenticationUri.resetPasswordResendOTP,
        params, false, false)
        .subscribe(response => (apiResponse = response),
          error => {
            userInfoObservable.error(error);
          },
          () => {
            userInfoObservable.next(apiResponse);
            userInfoObservable.complete();
          }
        );
    });
  }
}
