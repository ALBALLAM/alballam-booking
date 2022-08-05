import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TermsComponent} from './terms.component';

const routes: Routes = [
  {path: '', component: TermsComponent}
];

export const termsRouting: ModuleWithProviders = RouterModule.forChild(routes);
