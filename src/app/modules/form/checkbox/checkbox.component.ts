import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input() public label: string;
  @Input() public labelBefore: boolean;
  @Input() public value: boolean;
  @Input() public isArabic: boolean;
  @Input() public title: boolean;
  @Input() public required: boolean;
  @Input() public disabled: boolean;
  @Input() public group: FormGroup;
  @Input() public name: string;
  @Input() public icon: string;
  @Input() public svgIcon: string;
  @Input() public currentLang: string;
  @Input() public appearance: string;
  @Input() public patternErrorMessage: string;
  @Input() public hint: string;
  @Output() public eventEmitter: EventEmitter<object> = new EventEmitter<object>();

  public ngOnInit() {
    if (this.group.controls[this.name].value) {
      this.value = this.group.controls[this.name].value;
    } else {
      this.value = false;
    }
  }

  public checkboxChecked() {
    this.value = !this.value;
    this.group.controls[this.name].setValue(this.value);
    this.eventEmitter.emit({value: this.value});
  }
}
