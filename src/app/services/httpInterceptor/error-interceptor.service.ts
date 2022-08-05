import {throwError as observableThrowError, Observable, BehaviorSubject} from 'rxjs';

import {take, filter, catchError, switchMap, finalize} from 'rxjs/operators';
import {Injectable, Injector} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
  HttpErrorResponse
} from '@angular/common/http';

import {RefreshTokenService} from '../refresh-token/refresh-token.service';
import {StorageService} from '../storage/storage.service';
import {variables} from '../../app.variables';
import {DialogComponent} from '../../components/dialog/dialog.component';
import {MatDialog} from '@angular/material';
import {CommunicationService} from '../communication/communication.service';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from '../utilities.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  public isRefreshingToken = false;
  public tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public translation;

  constructor(
    private injector: Injector,
    private _dialog: MatDialog,
    private _communicationService: CommunicationService,
    private _translate: TranslateService,
    private _utilitiesService: UtilitiesService
  ) {
  }

  public addToken(req: HttpRequest<{}>): HttpRequest<{}> {
    if (req.headers.get('authorization') && !req.url.endsWith('/authentication/authenticate') &&
      !req.url.endsWith('/authentication/refreshToken') && !req.url.endsWith('graph.microsoft.com/v1.0/me/calendar/events')) {
      return req.clone({setHeaders: {Authorization: StorageService.getItem(variables.storageVariables.AccessToken)}});
    } else {
      return req;
    }
  }

  public intercept(req: HttpRequest<{}>, next: HttpHandler)
    : Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<{}> | HttpUserEvent<{}>> {
    return next.handle(this.addToken(req)).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) { // tslint:disable-line:no-angle-bracket-type-assertion
            case 401:
              if (req.url.endsWith('/authentication/authenticate') || req.url.endsWith('/authentication/refreshToken')
                || req.url.endsWith('/authentication/logout') || req.url.endsWith('graph.microsoft.com/v1.0/me/calendar/events')) {
                return observableThrowError(error);
              } else {
                return this.handle401Error(req, next);
              }
            default:
              return observableThrowError(error);
          }
        } else {
          return observableThrowError(error);
        }
      }));
  }

  public handle401Error(req: HttpRequest<{}>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
      const authService = this.injector.get(RefreshTokenService);

      return authService.refreshToken().pipe(
        switchMap((newToken: string) => {
          if (newToken) {
            this.tokenSubject.next(newToken);
            return next.handle(this.addToken(req));
          }

          // If we don't get a new token, we are in trouble so logout.
          return this._authError();
        }),
        catchError(() => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          return this._authError();
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        }));
    } else {
      return this.tokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => {
          return next.handle(this.addToken(req));
        }));
    }
  }

  private _authError() {
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation,
      () => null, () => {
        StorageService.clearAll();
        const dialogId = new Date();
        this._communicationService.setLatestDialogId(dialogId);
        this._dialog.closeAll();
        const dialogRef = this._dialog.open(DialogComponent, {
            data: {
              title: this.translation.GENERAL_ERRORS.AUTHENTICATION_ERROR_TITLE,
              content: this.translation.GENERAL_ERRORS.AUTHENTICATION_ERROR_TEXT
            }
          }
        );
        dialogRef.afterClosed().subscribe(() => {
          if (this._communicationService.getLatestDialogId() === dialogId) {
            this._communicationService.notifyComponent('app-top-bar', 'removeAuthentication', null);
            this._utilitiesService.routeToDashboard();
          }
        });
      });
    return observableThrowError({
      status: 401,
      data: null
    });
  }
}
