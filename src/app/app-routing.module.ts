import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService as canActivate} from './services/permission/auth-guard.service';
import {CanDeactivateGuardService as CanDeactivateGuard } from './services/permission/can-deactivate-guard.service';
import {DefaultLayoutComponent} from './layout/default-layout/default-layout.component';
import {variables} from './app.variables';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: variables.routes.dashboard,
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: variables.routes.dashboard_full,
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: variables.routes.authentication + '/:screen',
        loadChildren: './authentication/authentication.module#AuthenticationModule',
        canActivate: [canActivate]
      },
      {
        path: variables.routes.authentication + '/:screen/:id',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
      },
      {
        path: variables.routes.contactUs,
        loadChildren: './contact-us/contact-us.module#ContactUsModule'
      },
      {
        path: variables.routes.faqs,
        loadChildren: './faq/faq.module#FaqModule'
      },
      {
        path: variables.routes.terms,
        loadChildren: './terms/terms.module#TermsModule'
      },
      {
        path: variables.routes.aboutUs,
        loadChildren: './terms/terms.module#TermsModule'
      },
      {
        path: variables.routes.howItWorks,
        loadChildren: './terms/terms.module#TermsModule'
      },
      {
        path: variables.routes.plays,
        loadChildren: './plays/plays.module#PlaysModule'
      },
      {
        path: variables.routes.show + '/:screen',
        loadChildren: './show-details/show-details.module#ShowDetailsModule',
        canActivate: [canActivate]
      },
      {
        path: variables.routes.profile,
        loadChildren: './profile/profile.module#ProfileModule',
        canActivate: [canActivate]
      }
    ]
  },
  {path: '**', redirectTo: '/' + variables.routes.dashboard}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule],
  providers: [CanDeactivateGuard]
})
export class AppRoutingModule {
}
