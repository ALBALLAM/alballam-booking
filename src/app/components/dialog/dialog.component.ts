import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {CommunicationService} from '../../services/communication/communication.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  public currentLang;
  public direction;

  constructor(@Inject(MAT_DIALOG_DATA) public data, private _communicationService: CommunicationService,
              private _translate: TranslateService) {
    this.currentLang = this._translate.currentLang;
    this.direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  public confirmation(): void {
    this._communicationService.notifyComponent(this.data.notifyComponent, this.data.action, null);
  }
}
