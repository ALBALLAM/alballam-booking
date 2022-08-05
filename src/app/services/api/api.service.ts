import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {httpRequestTypes} from './api.config';
import {catchError, map} from 'rxjs/operators';
import {StorageService} from '../storage/storage.service';
import {variables} from '../../app.variables';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private _http: HttpClient,
    public _translate: TranslateService
  ) {
  }

  public sendApi(type: string, url: string, params, withAuthorisation: boolean, urlEncoded: boolean,
                 additionalHeaders = null, multipartData = false, addCurrencyInHeader = false): Observable<object> {
    if (httpRequestTypes.indexOf(type) > -1 && url !== '') {

      const header = this._prepareHeaders(withAuthorisation, urlEncoded, additionalHeaders, multipartData,
        this._translate.currentLang, addCurrencyInHeader);

      switch (type) {
        case 'get':
          return this._http.get(url, {headers: header})
            .pipe(
              map((response) => response),
              catchError(ApiService._handleError)
            );
        case 'put':
          let reqParams2;
          if (urlEncoded) {
            let httpParams = new HttpParams();
            Object.keys(params).forEach((key) => {
              if (typeof (params[key]) === 'object') {
                if (params[key] instanceof Array) {
                  for (const item of params[key]) {
                    httpParams = httpParams.append(key + '[]', item);
                  }
                }
              } else {
                httpParams = httpParams.append(key, params[key]);
              }

            });
            reqParams2 = httpParams.toString();
          } else {
            reqParams2 = params;
          }
          return this._http.put(url, reqParams2, {headers: header})
            .pipe(
              map((response) => response),
              catchError(ApiService._handleError)
            );
        case 'post':
          let reqParams;
          if (urlEncoded) {
            let httpParams = new HttpParams();
            Object.keys(params).forEach((key) => {
              if (typeof (params[key]) === 'object') {
                for (const item of params[key]) {
                  httpParams = httpParams.append(key + '[]', item);
                }
              } else {
                httpParams = httpParams.append(key, params[key]);
              }

            });
            reqParams = httpParams.toString();
          } else {
            reqParams = params;
          }
          return this._http.post(url, reqParams, {headers: header, observe: 'response'})
            .pipe(
              map((response) => response),
              catchError(ApiService._handleError)
            );
        case 'delete':
          return this._http.delete(url, {headers: header})
            .pipe(
              map((response) => response),
              catchError(ApiService._handleError)
            );
        default:
          break;
      }
    }
  }

  private _prepareHeaders(withAuthorisation, urlEncoded, additionalHeaders, multipartData, currentLanguage, addCurrencyInHeader):
    HttpHeaders {
    const headersParams = {
      'Content-Type': 'application/json',
      'Accept-Language': currentLanguage,
      'Authorization': '' // tslint:disable-line:object-literal-key-quotes
    };
    if (urlEncoded) {
      headersParams['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (multipartData) {
      delete headersParams['Content-Type'];
    }
    if (withAuthorisation) {
      headersParams.Authorization = StorageService.getItem(variables.storageVariables.AccessToken).toString();
    }

    for (const item in additionalHeaders) {
      if (additionalHeaders.hasOwnProperty(item)) {
        headersParams[item] = additionalHeaders[item];
      }
    }
    return new HttpHeaders(headersParams);
  }

  private static _handleError(error) {
    const objectError = {
      status: error.status,
      data: error.error
    };
    return throwError(objectError);
  }
}
