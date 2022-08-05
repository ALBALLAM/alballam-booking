import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { variables } from '../../app.variables';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public checkUserLoggedIn() {
    return !!StorageService.getItem(variables.storageVariables.AccessToken);
  }

  public checkUserAllowedToRoute() {
    if (StorageService.getItem(variables.storageVariables.allowedToRoute) === false
      || StorageService.getItem(variables.storageVariables.allowedToRoute) === 'false') {
      return false;
    }
    return true;
  }
}
