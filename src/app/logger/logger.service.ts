import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  public log(data, text: string = null): void {
    if (!environment.production) {
    }
  }
}
