import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {variables} from '../app.variables';
import {ApiService} from '../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _apiService: ApiService) {
  }

  public getDashboard(sort) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      let url = environment.url + variables.dashboard.getDashboard;
      if (sort) {
        url += '?sort=' + sort;
      }
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

  public verifyPurchase(params) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      let url = environment.url + variables.dashboard.verifyPurchase;
      for (const key in params) {
        if (key !== 'success') {
          if (url.indexOf('?') < 0) {
            url += '?';
          } else {
            url += '&';
          }
          url += key + '=' + params[key];
        }
      }
      this._apiService.sendApi('get', url,
        {}, true, false)
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

  public getCountriesByShow(showID) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.plays.getCountriesByShow + '?_id=' + showID;
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
