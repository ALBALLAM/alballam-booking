import {Injectable} from '@angular/core';
import {ApiService} from '../services/api/api.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {variables} from '../app.variables';

@Injectable({
  providedIn: 'root'
})
export class TermsService {

  constructor(private _apiService: ApiService) {
  }

  public getStaticPages(type: string) {
    return new Observable(observable => {
      let apiResponse;
      const url = environment.url + variables.staticPages.getStaticPages + '?type=' + type;
      this._apiService.sendApi('get', url, {}, false, false)
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
