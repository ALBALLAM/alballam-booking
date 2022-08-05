import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {variables} from '../../app.variables';
import {ApiService} from '../../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private _apiService: ApiService) { }

  public signUp(params) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      this._apiService.sendApi('post', environment.url + variables.AuthenticationUri.userSignUp,
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

  public checkOTP(params) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      this._apiService.sendApi('post', environment.url + variables.AuthenticationUri.userCheckOtp,
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
      this._apiService.sendApi('post', environment.url + variables.AuthenticationUri.resendOtp,
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
