import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShowDetailsComponent} from './show-details.component';

const routes: Routes = [
  {path: '', component: ShowDetailsComponent}
];

export const showDetailsRouting: ModuleWithProviders = RouterModule.forChild(routes);
