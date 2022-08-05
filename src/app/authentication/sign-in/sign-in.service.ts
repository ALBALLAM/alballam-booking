import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {variables} from '../../app.variables';
import {ApiService} from '../../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(private _apiService: ApiService) { }

  public signIn(params) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      this._apiService.sendApi('post', environment.url + variables.AuthenticationUri.signIn,
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
}
