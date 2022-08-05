import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSelectModule,
  MatOptionModule,
  MatGridListModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatProgressBarModule,
  MatTabsModule,
  MatCheckboxModule,
  MatAutocompleteModule
} from '@angular/material';

@NgModule({
  exports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatGridListModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTabsModule,
    MatCheckboxModule,
    MatAutocompleteModule
  ]
})
export class MaterialModule {
}
