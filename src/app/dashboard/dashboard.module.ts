import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {dashboardRouting} from './dashboard.routing';
import {SharedModule} from '../modules/shared/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    dashboardRouting,
    SharedModule
  ]
})
export class DashboardModule { }
