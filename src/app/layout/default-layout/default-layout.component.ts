import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {CommunicationService} from '../../services/communication/communication.service';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {

  constructor(public _router: Router, private _communicationService: CommunicationService) {
  }

  public ngOnInit() {
    let currentRoute = this._router.url.split('?')[0];
    this._communicationService.notifyComponent('app-top-bar', 'changeRoute', {currentRoute});
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        currentRoute = this._router.url.split('?')[0];
        this._communicationService.notifyComponent('app-top-bar', 'changeRoute', {currentRoute});
      }
    });
  }

  public onActivate(component) {
    window.scroll(0, 0);
  }
}
