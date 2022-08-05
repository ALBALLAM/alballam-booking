import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {IOption} from './select.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnChanges {
  @Input() public label: string;
  @Input() public value: string;
  @Input() public title: string;
  @Input() public isBeneficiary = false;
  @Input() public disabled = false;
  @Input() public isSearch = false;
  @Input() public required: boolean;
  @Input() public group: FormGroup;
  @Input() public name: string;
  @Input() public currentLang: string;
  @Input() public options: IOption[];
  @Input() public skipOptions: string[];
  @Input() public appearance: string;
  public disabledOptions: boolean;
  @Output() public eventEmitter: EventEmitter<object> = new EventEmitter<object>();
  @ViewChild('myInput', null) public searchValue: ElementRef;
  public selectedOptions = [];

  public ngOnChanges(changes) {
    if ('options' in changes) {
      this.selectedOptions = [];
      if (Array.isArray(this.options)) {
        for (const item of this.options) {
          this.selectedOptions.push(item);
        }
        this.selectInitialValues();
      }
    }
  }

  public selectionChange(event): void {
    this.eventEmitter.emit({
      name: this.name, text: event.value.text ? event.value.text : '',
      value: event.value.value, data: event.value.data, selectionChange: true
    });
  }

  public openedChange(event): void {
    if (!event && this.isSearch) {
      this.selectedOptions = this.options;
      this.searchValue.nativeElement.value = '';
    }
  }

  public search(query: string) {
    this.selectedOptions = this.select(query);
    if (this.selectedOptions.length === 0) {
      this.selectedOptions.push({text: 'No match found', value: 'noMatchFound'});
      this.disabledOptions = true;
    } else {
      this.disabledOptions = false;
    }
  }

  public select(query: string): string[] {
    const result = [];
    for (const a of this.options) {
      if (a.text.toLowerCase().indexOf(query.toLowerCase()) > -1 || a.value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        result.push(a);
      }
    }
    return result;
  }

  public selectInitialValues(): void {
    if (this.group.controls[this.name].value && typeof (this.group.controls[this.name].value) === 'string') {
      for (const option of this.selectedOptions) {
        if (option.value === this.group.controls[this.name].value) {
          this.group.controls[this.name].setValue(option);
          this.eventEmitter.emit({name: this.name, value: option.value, data: option.data, selectionChange: false});
          break;
        }
      }
    }
  }
}
