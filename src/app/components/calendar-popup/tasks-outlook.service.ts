import { Injectable } from '@angular/core';
import * as Msal from 'msal';
import {CommunicationService} from '../../services/communication/communication.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksOutlookService {
  // applicationConfig = {
  //   clientID: 'e54f9592-30ec-47b7-bf92-43233450e3fc',
  //   authority: "https://login.microsoftonline.com/common",
  //   graphScopes: ["user.read", "Calendars.ReadWrite"],
  //   graphEndpoint: "https://graph.microsoft.com/v1.0/me",
  //   redirectUri: "https://alballambooking.eurisko.me",
  //   postLogoutRedirectUri: "https://alballambooking.eurisko.me"
  // };

  // B2CTodoAccessTokenKey = "b2c.access.token";
  //
  // tenantConfig = {
  //   tenant: "hellowrold.onmicrosoft.com",
  //   // Replace this with your client id
  //   clientID: 'e54f9592-30ec-47b7-bf92-43233450e3fc', //server --ok
  //   // clientID: '93349606-ddde-4ba5-b4c5-fb64d478353d', //local
  //   signInPolicy: "B2C_1_signin",
  //   signUpPolicy: "B2C_1_signup",
  //   // redirectUri:"http://localhost:4200",
  //   redirectUri: "https://alballambooking.eurisko.me",
  //   b2cScopes:["user.read", "Calendars.ReadWrite"],
  //   postLogoutRedirectUri: "http://localhost:4200/profile"
  // };

  // // Configure the authority for Azure AD B2C
  // authority = "https://login.microsoftonline.com/common";

  public msalConfig = {
    auth: {
      clientId: environment.outlookClientId
    }
  };

  public msalInstance = new Msal.UserAgentApplication(this.msalConfig);

  constructor(private _communicationService: CommunicationService,
              private http: HttpClient) {}

  public microsoftInitialLogin(event): void {
    const loginRequest = {
      scopes: ['user.read', 'mail.send', 'Calendars.ReadWrite'],
      prompt: 'select_account'
    };

    this.msalInstance.loginPopup(loginRequest)
      .then(response => {
        this.msalInstance.acquireTokenSilent(loginRequest)
          .then(responseTokenSilent => {
            this.createEvent(event, responseTokenSilent.accessToken);
          })
          .catch(err => {
            if (err.name === 'InteractionRequiredAuthError') {
              return this.msalInstance.acquireTokenPopup(loginRequest)
                .then(responseTokenPopUp => {
                  this.createEvent(event, responseTokenPopUp.accessToken);
                })
                .catch((error) => {
                  this._communicationService.notifyComponent('app-calendar-popup', 'addEventError', err);
                });
            }
          });
      })
      .catch(err => {
        this._communicationService.notifyComponent('app-calendar-popup', 'addEventError', err);
      });
  }

  public microsoftLogin(event): void {
    if (this.msalInstance.getAccount()) {
      const tokenRequest = {
        scopes: ['user.read', 'mail.send', 'Calendars.ReadWrite']
      };
      this.msalInstance.acquireTokenSilent(tokenRequest)
        .then(responseTokenSilent => {
          this.createEvent(event, responseTokenSilent.accessToken);
        })
        .catch(err => {
          if (err.name === 'InteractionRequiredAuthError') {
            return this.msalInstance.acquireTokenPopup(tokenRequest)
              .then(responseTokenPopup => {
                this.createEvent(event, responseTokenPopup.accessToken);
              })
              .catch(error => {
                this._communicationService.notifyComponent('app-calendar-popup', 'addEventError', error);
              });
          }
        });
    } else {
      this.microsoftInitialLogin(event);
    }
  }

  // microsoft create event
  public createEvent(PARAMS, token) {
    let responseEvents;
    const endDateDuration = new Date(PARAMS.date);
    endDateDuration.setMinutes(endDateDuration.getMinutes() + PARAMS.duration);
    const event = {
      subject: PARAMS.showName,
      body: {
        ContentType: 'HTML',
        Content: PARAMS.description
      },
      location: {displayName: PARAMS.theaterAddress},
      start: {
        dateTime: PARAMS.date,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endDateDuration,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      attendees: [],
      // ReminderMinutesBeforeStart: '1440',
      ReminderMinutesBeforeStart: '60',
      IsReminderOn: true
    };
    if (token !== null && token !== undefined) {
      this._communicationService.showLoading(true);
      const header = new HttpHeaders({
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      });
      this.http.post(`https://graph.microsoft.com/v1.0/me/calendar/events`, event, {
        headers: header
      }).subscribe(response => responseEvents = response,
          error => {
            this._communicationService.showLoading(false);
            this._communicationService.notifyComponent('app-calendar-popup', 'addEventError', '');
      }, () => {
          this._communicationService.showLoading(false);
          this._communicationService.notifyComponent('app-calendar-popup', 'addEventSuccessful', '');
      });
    } else {
      this.microsoftLogin(PARAMS);
    }
  }
}
