import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {variables} from '../app.variables';
import {ApiService} from '../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlaysService {

  constructor(private _apiService: ApiService) {
  }

  public getPlays(params) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.plays.getPlays + '?' + params;
      this._apiService.sendApi('get', url,
        {}, false, false)
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
