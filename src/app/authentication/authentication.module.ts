import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {authenticateRouting} from './authentication-routing.module';
import {AuthenticationComponent} from './authentication.component';
import {AuthenticationDirective} from './authentication.directive';
import {SharedModule} from '../modules/shared/shared.module';
import {SignInComponent} from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

@NgModule({
  declarations: [
    AuthenticationComponent,
    AuthenticationDirective,
    SignInComponent,
    SignUpComponent,
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule,
    authenticateRouting,
    SharedModule
  ],
  exports: [AuthenticationComponent],
  entryComponents: [
    SignInComponent, SignUpComponent, ForgetPasswordComponent]
})
export class AuthenticationModule {
}
