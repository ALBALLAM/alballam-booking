import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {variables} from '../app.variables';
import {ApiService} from '../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ShowDetailsService {

  constructor(private _apiService: ApiService) {
  }

  public getShowByID(showID) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.showDetails.getShowByID + '?_id=' + showID;
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

  public getShowByIDAndCountry(showID, country) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.showDetails.getShowByIDAndCountry + '?_id=' + showID + '&country=' + country;
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

  public getZones(playID) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.showDetails.getZones + '?_id=' + playID;
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

  public getSeatingsByZone(zoneID, playID,country) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.showDetails.getSeats + '?_id=' + zoneID + '&play=' + playID+ '&country='+country;
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

  public finishPayment(params) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.showDetails.bookSeats;
      this._apiService.sendApi('post', url,
        params, true, false)
        .subscribe(response => (apiResponse = response),
          error => {
            userInfoObservable.error(error);
          },
          () => {
            userInfoObservable.next(apiResponse.body);
            userInfoObservable.complete();
          }
        );
    });
  }

  public getPaymentMethod(params) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.showDetails.paymentMethods;
      this._apiService.sendApi('post', url,
        params, true, false)
        .subscribe(response => (apiResponse = response),
          error => {
            userInfoObservable.error(error);
          },
          () => {
            userInfoObservable.next(apiResponse.body);
            userInfoObservable.complete();
          }
        );
    });
  }
}
