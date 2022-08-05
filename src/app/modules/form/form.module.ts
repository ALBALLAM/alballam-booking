import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {TextComponent} from './text/text.component';
import {TextAreaComponent} from './text-area/text-area.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {PasswordComponent} from './password/password.component';
import {NumberComponent} from './number/number.component';
import {TranslateModule} from '@ngx-translate/core';
import { PhoneNumberComponent } from './phone-number/phone-number.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { SelectComponent } from './select/select.component';
import {CheckboxComponent} from './checkbox/checkbox.component';

@NgModule({
  imports: [
    FlexLayoutModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    TranslateModule
  ],
  declarations: [
    TextComponent,
    PasswordComponent,
    NumberComponent,
    PhoneNumberComponent,
    TextAreaComponent,
    SelectComponent,
    CheckboxComponent
  ],
  exports: [
    TextComponent,
    PasswordComponent,
    NumberComponent,
    PhoneNumberComponent,
    ReactiveFormsModule,
    TextAreaComponent,
    SelectComponent,
    CheckboxComponent
  ],
  providers: [DecimalPipe]
})
export class FormModule {
}
