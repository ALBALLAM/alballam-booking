import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-show-detail',
  templateUrl: './show-detail.component.html',
  styleUrls: ['./show-detail.component.scss']
})
export class ShowDetailComponent implements OnInit {

  @Input() public image: string;
  @Input() public title: string;
  @Input() public currentLang: string;
  @Input() public date: string;
  @Input() public time: string;
  @Input() public timezone: string;
  @Input() public ticketNumber: number;
  @Input() public status: string;
  @Input() public statusName: string;
  @Input() public showCalendarButton = false;
  @Input() public showRefund = false;
  @Input() public showViewDetails = true;
  @Input() public amountRefunded;
  @Output() public viewReceipt = new EventEmitter();
  @Output() public refundTickets = new EventEmitter();
  @Output() public openCalendarPopUp = new EventEmitter();
  public timeDisplay = '';
  public dateDisplay = '';

  public ngOnInit() {
    if (this.timezone) {
      this.timeDisplay = moment.tz(this.time, this.timezone).locale('en').format('hh:mm A');
      this.dateDisplay = moment.tz(this.date, this.timezone).locale('en').format('dddd MMMM DD');
    }
  }

  public viewDetails() {
    this.viewReceipt.emit();
  }

  public refundPlay() {
    this.refundTickets.emit();
  }

  public openCalendar() {
    this.openCalendarPopUp.emit();
  }
}
