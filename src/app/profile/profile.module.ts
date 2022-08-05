import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import {profileRouting} from './profile.routing';
import {SharedModule} from '../modules/shared/shared.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    profileRouting,
    SharedModule
  ]
})
export class ProfileModule { }
