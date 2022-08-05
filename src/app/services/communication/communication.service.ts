import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  public _subject = new Subject<object>();
  private latestDialogId: Date;

  public showLoading(showStatus: boolean): void {
    this._subject.next({notifyComponent: 'app-loading', show: showStatus});
  }

  public setLatestDialogId(date): void {
    this.latestDialogId = date;
  }

  public getLatestDialogId(): Date {
    return this.latestDialogId;
  }

  public notifyComponent(component, action, data = null): void {
    this._subject.next({notifyComponent: component, action, data});
  }

  public getData(): Observable<object> {
    return this._subject.asObservable();
  }
}
