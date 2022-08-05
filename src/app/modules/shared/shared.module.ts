import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import {MomentModule} from 'angular2-moment';
import {MaterialModule} from '../material/material.module';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {NguCarouselModule} from '@ngu/carousel';
import {FormModule} from '../form/form.module';
import {LoadingComponent} from '../../components/loading/loading.component';
import {DialogComponent} from '../../components/dialog/dialog.component';
import {OwlModule} from 'ngx-owl-carousel';
import {TopBarContentComponent} from '../../top-bar-content/top-bar-content.component';
import {FooterComponent} from '../../footer/footer.component';
import {RouterModule} from '@angular/router';
import {ReCaptchaModule} from 'angular2-recaptcha';
import {CardNumberPipe} from './cardNumber.pipe';
import {ShowComponent} from '../../components/show/show.component';
import {SeatChartComponent} from '../../components/seat-chart/seat-chart.component';
import {TooltipModule} from 'ngx-bootstrap';
import {ChangePasswordComponent} from '../../change-password/change-password.component';
import {ImageDialogComponent} from '../../components/image-dialog/image-dialog.component';
import {SuccessBookingComponent} from '../../components/success-booking/success-booking.component';
import {ShowDetailComponent} from '../../components/show-detail/show-detail.component';
import {ReceiptPopupComponent} from '../../components/receipt-popup/receipt-popup.component';
import {CalendarPopupComponent} from '../../components/calendar-popup/calendar-popup.component';
import {CountriesPopupComponent} from '../../components/countries-popup/countries-popup.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    TranslateModule,
    MaterialModule,
    FormModule,
    MomentModule,
    OwlModule,
    FormsModule,
    RouterModule,
    ReCaptchaModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    LoadingComponent,
    DialogComponent,
    TopBarContentComponent,
    FooterComponent,
    CardNumberPipe,
    ShowComponent,
    SeatChartComponent,
    ChangePasswordComponent,
    ImageDialogComponent,
    SuccessBookingComponent,
    CountriesPopupComponent,
    ShowDetailComponent,
    ReceiptPopupComponent,
    CalendarPopupComponent
  ],
  exports: [
    FlexLayoutModule,
    TranslateModule,
    MaterialModule,
    FormModule,
    LoadingComponent,
    DialogComponent,
    MomentModule,
    OwlModule,
    FormsModule,
    FormsModule,
    ReCaptchaModule,
    TopBarContentComponent,
    FooterComponent,
    RouterModule,
    ScrollingModule,
    CardNumberPipe,
    NguCarouselModule,
    ShowComponent,
    SeatChartComponent,
    TooltipModule,
    ChangePasswordComponent,
    ImageDialogComponent,
    SuccessBookingComponent,
    ShowDetailComponent,
    ReceiptPopupComponent,
    CalendarPopupComponent,
    CountriesPopupComponent
  ],
  entryComponents: [
    DialogComponent,
    ShowComponent,
    ChangePasswordComponent,
    ImageDialogComponent,
    SuccessBookingComponent,
    ReceiptPopupComponent,
    CalendarPopupComponent,
    CountriesPopupComponent
  ]
})
export class SharedModule {
}
