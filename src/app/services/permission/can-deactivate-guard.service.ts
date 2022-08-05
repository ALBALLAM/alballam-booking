import {Injectable} from '@angular/core';
import {PermissionService} from './permission.service';
import {RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuardService {

  constructor(
    private _PermissionService: PermissionService
  ) {
  }

  public canDeactivate(): boolean {
    return this._PermissionService.checkUserAllowedToRoute();
  }
}
