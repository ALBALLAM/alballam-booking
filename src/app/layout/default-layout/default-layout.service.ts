import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {variables} from '../../app.variables';
import {ApiService} from '../../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DefaultLayoutService {

  constructor(private _apiService: ApiService) {
  }

  public logout(params) {
    return new Observable(observable => {
      let apiResponse;
      this._apiService.sendApi('put', environment.url + variables.AuthenticationUri.logout,
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
