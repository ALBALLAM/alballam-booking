import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CommunicationService} from '../../services/communication/communication.service';
import {environment} from '../../../environments/environment';

declare var gapi;

@Injectable({
  providedIn: 'root'
})

export class TasksCalendarService {

  constructor(private _communicationService: CommunicationService) {
    // this.googleInitClient();
  }

  // google client initialization
  public googleInitClient() {
    // const _self = this;
    // return new Promise(function(resolve, reject){
    gapi.load('client', () => {
      gapi.client.init(environment.googleCalendarObj);
      gapi.client.load('calendar', 'v3', () => {
        // resolve();
      });
    });
    // });

  }

  // google sign in
  public getGoogleCalendarSignIn(PARAMS) {
    return new Observable(userInfoObservable => {
      gapi.load('client', () => {
        gapi.client.init(environment.googleCalendarObj);
        gapi.client.load('calendar', 'v3', () => {
          const googleAuth = gapi.auth2.getAuthInstance();
          googleAuth.signIn({
            prompt: 'select_account'
          }).then(googleUserSignedin => {
            const endDateDuration = new Date(PARAMS.date);
            endDateDuration.setMinutes(endDateDuration.getMinutes() + PARAMS.duration);
            const event = {
              summary: PARAMS.showName,
              location: PARAMS.theaterAddress,
              description: PARAMS.description,
              start: {
                dateTime: new Date(PARAMS.date),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
              },
              end: {
                dateTime: endDateDuration,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
              },
              attendees: [],
              reminders: {
                useDefault: false,
                overrides: [{
                  method: 'email',
                  // minutes: '1440'
                  minutes: '60'
                }]
              }
            };
            const request = gapi.client.calendar.events.insert({
              calendarId: 'primary',
              resource: event
            });
            this._communicationService.showLoading(true);
            request.execute(function (eventObj) {  // tslint:disable-line
              PARAMS['calendar'] = {  // tslint:disable-line
                id: eventObj.id,
                calendar_type: 'GOOGLE'
              };
            });
            userInfoObservable.next();
            userInfoObservable.complete();
          });
        });
      });
      // userInfoObservable.error();
    });
  }

}
