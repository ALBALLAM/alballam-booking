import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatFormFieldAppearance} from '@angular/material';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent {
  @Input() public label: string;
  @Input() public title: string;
  @Input() public value: string;
  @Input() public required: boolean;
  @Input() public disabled: boolean;
  @Input() public group: FormGroup;
  @Input() public name: string;
  @Input() public maxLength: string;
  @Input() public maxLengthNumber: number;
  @Input() public icon: string;
  @Input() public svgIcon: string;
  @Input() public appearance: MatFormFieldAppearance;
  @Input() public patternErrorMessage: string;
  @Input() public hint: string;
  @Input() public currentLang: string;
  @Input() public isIban: boolean;
  @Output() public keyUpEvent = new EventEmitter();

  public triggerKeyUp(event) {
    this.keyUpEvent.emit(event);
    if (this.isIban && this.group.controls[this.name].value !== '') {
      this.group.controls[this.name].patchValue(this.group.controls[this.name].value.toUpperCase());
    }
  }
}
