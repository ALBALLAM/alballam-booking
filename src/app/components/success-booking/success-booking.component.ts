import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UtilitiesService} from '../../services/utilities.service';

@Component({
  selector: 'app-success-booking',
  templateUrl: './success-booking.component.html',
  styleUrls: ['./success-booking.component.scss']
})
export class SuccessBookingComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialogRef: MatDialogRef<SuccessBookingComponent>,
              private _utilitiesService: UtilitiesService) {
  }

  public closePopup() {
    this.dialogRef.close();
    this._utilitiesService.routeToDashboardFull();
  }

}
