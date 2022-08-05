import {Injectable} from '@angular/core';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';

import {variables} from '../../app.variables';
import {environment} from '../../../environments/environment';
import {StorageService} from '../storage/storage.service';
import {IRefreshTokenParams} from './refresh-token.interface';
import {UtilitiesService} from '../utilities.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  constructor(private _apiService: ApiService, private _utilitiesService: UtilitiesService) {
  }

  public refreshToken() {
    return new Observable(observable => {
      let apiResponse;
      const params: IRefreshTokenParams = {
        refresh_token: StorageService.getItem(variables.storageVariables.RefreshToken)
      };
      this._apiService.sendApi('post', environment.url + variables.AuthenticationUri.refreshToken,
        params, false, true,
        {Authorization: StorageService.getItem(variables.storageVariables.RefreshTokenHeader)})
        .subscribe(response => {
            apiResponse = response;
          },
          error => {
            observable.error(error);
          },
          () => {
            StorageService.storeAuthenticationData(apiResponse.body.data.result);
            if (apiResponse.body.data.result.language) {
              StorageService.storeLanguageData(apiResponse.body.data.result.language);
            }
            this._utilitiesService.changeLanguage();
            observable.next(apiResponse.body.data.result.access_token);
            observable.complete();
          }
        );
    });
  }
}
