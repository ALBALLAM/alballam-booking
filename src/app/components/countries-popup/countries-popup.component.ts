import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SuccessBookingComponent} from '../success-booking/success-booking.component';
import {StorageService} from '../../services/storage/storage.service';
import {UtilitiesService} from '../../services/utilities.service';

@Component({
  selector: 'app-countries-popup',
  templateUrl: './countries-popup.component.html',
  styleUrls: ['./countries-popup.component.scss']
})
export class CountriesPopupComponent {

  public countrySelectedIndex;
  public selectedCountry;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialogRef: MatDialogRef<SuccessBookingComponent>,
              private _utilitiesService: UtilitiesService) {
  }

  public closePopup() {
    this.dialogRef.close();
  }

  public selectCountry(index, country) {
    this.countrySelectedIndex = index;
    this.selectedCountry = country;
  }

  public chooseCountry() {
    if (this.selectedCountry) {
      this.data.show.country = this.selectedCountry;
      StorageService.setItem('showDetails', this.data.show);
      this.dialogRef.close();
      this._utilitiesService.clearShowData();
      setTimeout(() => {
        this._utilitiesService.routeToShowDetails();
      }, 100);
    }
  }
}
