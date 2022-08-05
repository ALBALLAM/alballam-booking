import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {UtilitiesService} from '../services/utilities.service';
import {variables} from '../app.variables';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, OnDestroy {
  public component: string;
  public routeVariables = variables.routes;
  private _routeSubscription: Subscription;

  constructor(private _route: ActivatedRoute, private _utilitiesService: UtilitiesService) {
  }

  public ngOnInit() {
    this._routeSubscription = this._route.params.subscribe(params => {
      switch (params.screen) {
        case this.routeVariables.signUpAuth:
          this.component = 'signUp';
          break;
        case this.routeVariables.signInAuth:
          this.component = 'signIn';
          break;
        case this.routeVariables.forgotPasswordAuth:
          this.component = 'forgotPassword';
          break;
        default:
          this._utilitiesService.routeToLanding();
          break;
      }
    });
  }

  public ngOnDestroy(): void {
    this._routeSubscription.unsubscribe();
  }
}
