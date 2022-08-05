import {Injectable} from '@angular/core';
import {IAccessToken} from './storage.interface';
import {variables} from '../../app.variables';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public static setItem(key: string, val: object | string): void {
    if (typeof (val) === 'object') {
      localStorage.setItem(key, JSON.stringify(val));
    } else {
      localStorage.setItem(key, val);
    }
  }

  public static getItem(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return localStorage.getItem(key);
    }
  }

  public static deleteItem(key: string): void {
    localStorage.removeItem(key);
  }

  public static clearAll() {
    localStorage.clear();
  }

  public static storeAuthenticationData(data: IAccessToken): void {
    try {
      this.setItem(variables.storageVariables.AccessToken, data.access_token);
      this.setItem(variables.storageVariables.RefreshToken, data.refresh_token);
      if (data.refresh_token_header) {
        this.setItem(variables.storageVariables.RefreshTokenHeader, data.refresh_token_header);
      }
      this.setItem(variables.storageVariables.TokenExpiry, data.expires_in.toString());
      this.setItem(variables.storageVariables.ID, data[variables.storageVariables.ID]);
      this.setItem(variables.storageVariables.Name, data[variables.storageVariables.Name]);
      this.setItem(variables.storageVariables.IsEmail, data[variables.storageVariables.IsEmail]);
      this.setItem(variables.storageVariables.Email, data[variables.storageVariables.Email]);
      this.setItem(variables.storageVariables.PhoneNumber, data[variables.storageVariables.PhoneNumber]);
      if (data[variables.storageVariables.Number]) {
        this.setItem(variables.storageVariables.Number, data[variables.storageVariables.Number]);
      }
      this.setItem(variables.storageVariables.PhoneCode, data[variables.storageVariables.PhoneCode]);
      this.setItem(variables.storageVariables.Wallet, data[variables.storageVariables.Wallet]);
      if (data[variables.storageVariables.Image]) {
        this.setItem(variables.storageVariables.Image, data[variables.storageVariables.Image]);
      }
    } catch (e) {
      throw e;
    }
  }

  public static deleteAuthenticationData(): void {
    try {
      this.deleteItem(variables.storageVariables.AccessToken);
      this.deleteItem(variables.storageVariables.RefreshToken);
      this.deleteItem(variables.storageVariables.RefreshTokenHeader);
      this.deleteItem(variables.storageVariables.TokenExpiry);
      this.deleteItem(variables.storageVariables.ID);
      this.deleteItem(variables.storageVariables.Name);
      this.deleteItem(variables.storageVariables.Image);
      // this.deleteItem(variables.storageVariables.IsEmail);
      // this.deleteItem(variables.storageVariables.Email);
      this.deleteItem(variables.storageVariables.PhoneNumber);
      this.deleteItem(variables.storageVariables.Wallet);
      this.deleteItem(variables.storageVariables.Number);
      this.deleteItem(variables.storageVariables.PhoneCode);
      this.deleteItem('showDetails');
    } catch (e) {
      throw e;
    }
  }

  public static storeLanguageData(data): void {
    try {
      if (data) {
        this.setItem(variables.storageVariables.Language, data);
      }
    } catch (e) {
      throw e;
    }
  }
}
