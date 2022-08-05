import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {variables} from '../../app.variables';
import {ApiService} from '../../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptPopupService {

  constructor(private _apiService: ApiService) {
  }

  public getReceiptPdf(playID, timezone) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.receipt.getReceipt;
      this._apiService.sendApi('post', url,
        {play: playID}, true, false)
        .subscribe(response => (apiResponse = response),
          error => {
            userInfoObservable.error(error);
          },
          () => {
            userInfoObservable.next(apiResponse.body.result);
            userInfoObservable.complete();
          }
        );
    });
  }

  public refundTickets(tickets) {
    return new Observable(userInfoObservable => {
      let apiResponse;
      const url = environment.url + variables.receipt.refundTickets;
      this._apiService.sendApi('post', url,
        {tickets}, true, false)
        .subscribe(response => (apiResponse = response),
          error => {
            userInfoObservable.error(error);
          },
          () => {
            userInfoObservable.next(apiResponse.body);
            userInfoObservable.complete();
          }
        );
    });
  }
}
