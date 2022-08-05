import {Injectable} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor(
    private _iconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer
  ) {
  }

  public initializeCustomIcons() {
    this._iconRegistry.addSvgIcon(
      'menu',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg'));
    this._iconRegistry.addSvgIcon(
      'arrow-down',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow-down.svg'));
    this._iconRegistry.addSvgIcon(
      'checkbox',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/check.svg'));
    this._iconRegistry.addSvgIcon(
      'checkbox-red',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/checkbox-red.svg'));
    this._iconRegistry.addSvgIcon(
      'back',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/back.svg'));
    this._iconRegistry.addSvgIcon(
      'close-icon',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic-close.svg'));
    this._iconRegistry.addSvgIcon(
      'edit-icon',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/profile/edit-icon.svg'));
    this._iconRegistry.addSvgIcon(
      'search-icon',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/search.svg'));
    this._iconRegistry.addSvgIcon(
      'wallet-icon',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/profile/wallet.svg'));
  }

  public initializeShowIcons() {
    this._iconRegistry.addSvgIcon(
      'calendar',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/show/calendar.svg'));
    this._iconRegistry.addSvgIcon(
      'cast',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/show/cast.svg'));
    this._iconRegistry.addSvgIcon(
      'authors',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/show/authors.svg'));
    this._iconRegistry.addSvgIcon(
      'director',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/show/director.svg'));
    this._iconRegistry.addSvgIcon(
      'event',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/show/event.svg'));
    this._iconRegistry.addSvgIcon(
      'prices',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/show/prices.svg'));
    this._iconRegistry.addSvgIcon(
      'time',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/show/time.svg'));
    this._iconRegistry.addSvgIcon(
      'venue',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/show/venue.svg'));
    this._iconRegistry.addSvgIcon(
      'prices-grey',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/show/prices-grey.svg'));
    this._iconRegistry.addSvgIcon(
      'duration',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/show/duration.svg'));
    this._iconRegistry.addSvgIcon(
      'calendar-profile',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/profile/add-to-calendar.svg'));
    this._iconRegistry.addSvgIcon(
      'google',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/profile/google.svg'));
    this._iconRegistry.addSvgIcon(
      'outlook',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/profile/outlook.svg'));
    this._iconRegistry.addSvgIcon(
      'facebook',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/footer/facebook.svg'));
    this._iconRegistry.addSvgIcon(
      'google-plus',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/footer/google-plus.svg'));
    this._iconRegistry.addSvgIcon(
      'insta',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/footer/insta.svg'));
    this._iconRegistry.addSvgIcon(
      'link',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/footer/link.svg'));
    this._iconRegistry.addSvgIcon(
      'twitter',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/footer/twitter.svg'));
  }
}
