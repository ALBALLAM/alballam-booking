import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() public show: boolean;
  @Input() public diameter: number;
  @Input() public absolutePosition: boolean;
  @Input() public transparent: boolean;
}
