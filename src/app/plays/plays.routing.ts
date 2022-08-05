import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaysComponent } from './plays.component';

const routes: Routes = [
  { path: '', component: PlaysComponent }
];

export const playsRouting: ModuleWithProviders = RouterModule.forChild(routes);
