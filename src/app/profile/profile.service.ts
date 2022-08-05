import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {variables} from '../app.variables';
import {ApiService} from '../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _apiService: ApiService) {
  }

  public getProfile() {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.profile.getProfile;
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

  public saveProfile(params) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.profile.saveProfile;
      this._apiService.sendApi('put', url,
        params, true, false)
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

  public changeProfileImage(params) {
    return new Observable(observable => {
      let apiResponse;
      this._apiService.sendApi('put', environment.url + variables.profile.uploadImage,
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

  public deleteProfileImage() {
    return new Observable(observable => {
      let apiResponse;
      this._apiService.sendApi('delete', environment.url + variables.profile.deleteImage,
        {}, true, false)
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

  public getEvents(page = 1) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.profile.getEvents + '?page=' + page;
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
}
