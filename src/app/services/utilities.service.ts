import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {variables} from '../app.variables';
import {StorageService} from './storage/storage.service';
import {Router} from '@angular/router';
import {PermissionService} from './permission/permission.service';
import {MatDialog} from '@angular/material';
import imageCompression from 'browser-image-compression';
import {Meta, Title} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  public routeVariables = variables.routes;

  constructor(private _translate: TranslateService,
              private _router: Router,
              private metaService: Meta,
              private titleService: Title,
              private _permissionService: PermissionService, private dialogRef: MatDialog) {
  }

  public changeLanguage() {
    if (StorageService.getItem(variables.storageVariables.Language)) {
      if (StorageService.getItem(variables.storageVariables.Language) === 'en') {
        this._translate.use('en');
      } else {
        this._translate.use('ar');
      }
    } else {
      this._translate.use('en');
    }
  }

  public getLanguageArray() {
    return [
      {text: 'EN', id: 'en', fullText: 'English'},
      {text: 'ع', id: 'ar', fullText: 'Arabic'}
    ];
  }

  public getPlatform(): IPlatform {
    const mobile = window.innerWidth <= 425;
    const tablet = window.innerWidth <= 1024 && window.innerWidth > 425;
    const platforms = {
      isMobile: /Android|iPhone|BlackBerry/i.test(navigator.userAgent) && mobile,
      isTablet: tablet,
      isDesktop: !mobile && !tablet
    };
    return platforms;
  }

  public async onSelectFile(event) {
    try {
      const imageObject = {
        name: '',
        extension: '',
        compression: '',
        result: ''
      };
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read select as data url
        imageObject.name = event.target.files[0].name;
        imageObject.extension = event.target.files[0].type.substring(event.target.files[0].type.lastIndexOf('/') + 1);
        reader.onload = (eventReader) => { // called once readAsDataURL is completed
          imageObject.result = eventReader.target['result']; // tslint:disable-line:no-string-literal
        };
      }
      const imageFile = event.target.files[0];
      const options = {
        maxSizeMB: 0.09,
        maxWidthOrHeight: 800
      };
      const compressedFile = await imageCompression(imageFile, options);
      if (compressedFile.size / 1024 > 100) {
        const compressedSecondFile = await imageCompression(compressedFile, options);
        imageObject.compression = await imageCompression.getDataUrlFromFile(compressedSecondFile);
        return imageObject;
      } else {
        imageObject.compression = await imageCompression.getDataUrlFromFile(compressedFile);
        return imageObject;
      }
    } catch (e) {
      throw e;
    }
  }

  public generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public handleCacheClear() {
    const isAuthenticated = this._permissionService.checkUserLoggedIn();
    this.dialogRef.closeAll();
    if (isAuthenticated) {
      this.routeToDashboard();
    } else {
      this.routeToLanding();
    }
  }

  public convertMinutes(entryMinutes) {
    const hours = (entryMinutes / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    let flagHours = 'hours';
    let flagMinutes = 'mins';
    if (rhours === 1) {
      flagHours = 'hour';
    }
    if (rminutes === 1) {
      flagMinutes = 'min';
    }
    let text = '';
    if (rhours !== 0) {
      text += rhours + ' ' + flagHours;
      if (rminutes !== 0) {
        text += ' ' + rminutes + ' ' + flagMinutes;
      }
    } else {
      if (rminutes !== 0) {
        text += rminutes + ' ' + flagMinutes;
      }
    }
    return text;
  }

  public routeToDashboard() {
    this._router.navigate(['/' + this.routeVariables.dashboard]);
  }

  public routeToDashboardFull() {
    this._router.navigate(['/' + this.routeVariables.dashboard_full]);
  }

  public routeToShowDetails() {
    window.scroll(0, 0);
    this._router.navigate(['/' + this.routeVariables.showStepOne]);
  }

  public routeToLanding() {
    this._router.navigate(['/' + this.routeVariables.dashboard]);
  }

  public routeToLogin() {
    window.scroll(0, 0);
    this._router.navigate(['/' + this.routeVariables.signIn]);
  }

  public clearShowData() {
    StorageService.deleteItem('chosenPlay');
    StorageService.deleteItem('chosenZone');
    StorageService.deleteItem('selectSeatsObj');
    StorageService.deleteItem('bookSeatingsResponse');
    StorageService.deleteItem('times');
    StorageService.deleteItem('selectedTimeIndex');
    StorageService.deleteItem('selectedZoneIndex');
    StorageService.deleteItem('zonesResponse');
  }

  public emitScreen(key: string, name: string) {
    const analyticsObj = {
      key,
      screen_name: name,
      firebase_screen: name
    };
    (<any>window).firebase.analytics().logEvent('screen_view', analyticsObj); // tslint:disable-line
  }

  setPageTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
    this.setMetaServiceTitle(newTitle);
  }

  setMetaServiceTitle(newTitle) {
    let value = this.metaService.getTag('property=\'og:title\'');
    if (value) {
      this.metaService.updateTag({property: 'og:title', content: newTitle});
    } else {
      this.metaService.addTag({property: 'og:title', content: newTitle});
    }
    // if (callMetaDescription) {
    //   this.setMetaServiceDescription(null);
    // }
  }

  // setMetaServiceDescription(description = null) {
  //   if (description === null) {
  //     if (variables.ogDescription[this._router.url]) {
  //       description = variables.ogDescription[this._router.url];
  //     } else {
  //       description = this._translate.currentLang === 'en' ? variables.ogDescription['defaultEn'] : variables.ogDescription['defaultAr'];
  //     }
  //   }
  //   let value = this.metaService.getTag('property=\'og:description\'');
  //   if (value) {
  //     this.metaService.updateTag({property: 'og:description', content: description});
  //   } else {
  //     this.metaService.addTag({property: 'og:description', content: description});
  //   }
  // }
}

export interface IPlatform {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
