import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FaqComponent} from './faq.component';
import {SharedModule} from '../modules/shared/shared.module';
import {faqRouting} from './faq.routing';

@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    SharedModule,
    faqRouting
  ]
})
export class FaqModule {
}
