import {Injectable} from '@angular/core';
import {ApiService} from '../services/api/api.service';
import {Observable} from 'rxjs';
import {variables} from '../app.variables';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private _apiService: ApiService) {
  }

  public submitContactUs(params) {
    return new Observable(observable => {
      let apiResponse;
      this._apiService.sendApi('post',
        environment.url + variables.contactUs.submit,
        params, false, false)
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
