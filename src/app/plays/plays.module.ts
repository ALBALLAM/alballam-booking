import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaysComponent } from './plays.component';
import {SharedModule} from '../modules/shared/shared.module';
import {playsRouting} from './plays.routing';

@NgModule({
  declarations: [PlaysComponent],
  imports: [
    CommonModule,
    playsRouting,
    SharedModule
  ]
})
export class PlaysModule { }
