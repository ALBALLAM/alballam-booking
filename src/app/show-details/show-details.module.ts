import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowDetailsComponent } from './show-details.component';
import {SharedModule} from '../modules/shared/shared.module';
import {showDetailsRouting} from './show-details.routing';
import { SeatsioAngularModule } from '@seatsio/seatsio-angular';
@NgModule({
  declarations: [ShowDetailsComponent],
  imports: [
    CommonModule,
    showDetailsRouting,
    SharedModule,
    SeatsioAngularModule
  ]
})
export class ShowDetailsModule { }
