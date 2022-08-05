import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {CustomTranslationLoader} from './services/translation/translation-loader';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {SharedModule} from './modules/shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommunicationService} from './services/communication/communication.service';
import {ApiService} from './services/api/api.service';
import {ErrorInterceptor} from './services/httpInterceptor/error-interceptor.service';
import {DefaultLayoutComponent} from './layout/default-layout/default-layout.component';
import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faFacebookF, faLinkedinIn, faTwitter, faWhatsapp} from '@fortawesome/free-brands-svg-icons';
import {faCheck, faEnvelope, faLink} from '@fortawesome/free-solid-svg-icons';
import {OneSignalService} from './services/oneSignal/one-signal-service';
import {TasksOutlookService} from './components/calendar-popup/tasks-outlook.service';
import {TasksCalendarService} from './components/calendar-popup/tasks-calendar.service';

export class CustomHammerConfig extends HammerGestureConfig {
  public overrides = <any>{ // tslint:disable-line:no-any no-angle-bracket-type-assertion
    pinch: {enable: false},
    rotate: {enable: false}
  };
}

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (CustomTranslationLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    ApiService,
    OneSignalService,
    TasksCalendarService,
    TasksOutlookService,
    CommunicationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faFacebookF, faTwitter, faLinkedinIn, faWhatsapp, faLink, faEnvelope, faCheck);
  }
}
