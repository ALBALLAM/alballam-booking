import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {
  @Input() public image: string;
  @Input() public title: string;
  @Input() public label: string;
  @Input() public currentLang: string;
  @Input() public showBookButton = true;
  @Output() public bookShowEvent = new EventEmitter();
  public isHover = false;

  public ngOnInit() {
    if (this.title && this.title.length > 40) {
      this.title = this.title.substring(0, 40);
      this.title += '...';
    }
  }

  public changeHover(isHover) {
    this.isHover = isHover;
  }

  public bookShow() {
    this.bookShowEvent.emit();
  }

}
