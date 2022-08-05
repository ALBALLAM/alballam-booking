import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationComponent} from './authentication.component';

const routes: Routes = [
  {path: '', component: AuthenticationComponent}
];

export const authenticateRouting: ModuleWithProviders = RouterModule.forChild(routes);
