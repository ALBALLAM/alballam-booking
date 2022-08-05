import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FaqComponent} from './faq.component';

const routes: Routes = [
  {path: '', component: FaqComponent}
];

export const faqRouting: ModuleWithProviders = RouterModule.forChild(routes);
