import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent {
  @Input() public label: string;
  @Input() public title: string;
  @Input() public value: string;
  @Input() public required: boolean;
  @Input() public disabled: boolean;
  @Input() public group: FormGroup;
  @Input() public name: string;
  @Input() public currentLang: string;
  @Input() public icon: string;
  @Input() public svgIcon: string;
  @Input() public appearance: string;
  @Input() public hint: string;
  @Input() public patternErrorMessage: string;
  @Input() public maxLength: number;
  @Input() public rows = 8;
}
