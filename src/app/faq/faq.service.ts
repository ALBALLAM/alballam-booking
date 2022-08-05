import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {variables} from '../app.variables';
import {ApiService} from '../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private _apiService: ApiService) {
  }

  public getFaqs() {
    return new Observable(observable => {
      let apiResponse;
      this._apiService.sendApi('get', environment.url + variables.faq.getFaqs,
        null, false, false)
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
