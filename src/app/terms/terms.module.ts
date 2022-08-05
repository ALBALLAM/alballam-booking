import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
import {SharedModule} from '../modules/shared/shared.module';
import {termsRouting} from './terms.routing';

@NgModule({
  declarations: [TermsComponent],
  imports: [
    CommonModule,
    SharedModule,
    termsRouting
  ]
})
export class TermsModule { }
