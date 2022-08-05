import {Injectable} from '@angular/core';
import {ApiService} from '../services/api/api.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {variables} from '../app.variables';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private _apiService: ApiService) {
  }

  // public resetPassword(params) {
  //   return new Observable(observable => {
  //     let apiResponse;
  //     this._apiService.sendApi('post', environment.url + variables.AuthenticationUri.forgotPassword,
  //       params, true, false)
  //       .subscribe(response => (apiResponse = response),
  //         error => {
  //           observable.error(error);
  //         },
  //         () => {
  //           observable.next(apiResponse);
  //           observable.complete();
  //         }
  //       );
  //   });
  // }

  public changePassword(params) {
    return new Observable(observable => {
      let apiResponse;
      this._apiService.sendApi('post', environment.url + variables.AuthenticationUri.changePassword,
        params, true, false)
        .subscribe(response => (apiResponse = response),
          error => {
            observable.error(error);
          },
          () => {
            observable.next(apiResponse);
            observable.complete();
          }
        );
    });
  }
}
