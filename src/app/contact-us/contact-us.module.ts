import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContactUsComponent} from './contact-us.component';
import {contactUsRouting} from './contact-us.routing';
import {SharedModule} from '../modules/shared/shared.module';

@NgModule({
  declarations: [ContactUsComponent],
  imports: [
    CommonModule,
    SharedModule,
    contactUsRouting
  ]
})
export class ContactUsModule {
}
