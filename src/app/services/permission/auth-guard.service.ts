import {Injectable} from '@angular/core';
import {PermissionService} from './permission.service';
import {UtilitiesService} from '../utilities.service';
import {RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private _PermissionService: PermissionService,
    private _utilitiesService: UtilitiesService
  ) {
  }

  public canActivate(state: RouterStateSnapshot): boolean {
    if (state.url && state.url[0] && state.url[0]['path'] === 'a') { // tslint:disable-line
      if (state.url && state.url[1] && state.url[1]['path'] === 'sign-in') { // tslint:disable-line
        if (this._PermissionService.checkUserLoggedIn()) {
          return false;
        }
      }
    } else {
      if (!this._PermissionService.checkUserLoggedIn()) {
        this._utilitiesService.routeToDashboard();
        return false;
      }
    }
    return true;
  }
}
