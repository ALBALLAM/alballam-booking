import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CommunicationService} from '../../services/communication/communication.service';
import {ReceiptPopupService} from './receipt-popup.service';
import {DialogComponent} from '../dialog/dialog.component';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-receipt-popup',
  templateUrl: './receipt-popup.component.html',
  styleUrls: ['./receipt-popup.component.scss']
})
export class ReceiptPopupComponent implements OnInit {

  public translation;
  public selectedCount = 0;
  public timeDisplay = '';
  public dateDisplay = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialogRef: MatDialogRef<ReceiptPopupComponent>, private _communicationService: CommunicationService,
              private _receiptPopupService: ReceiptPopupService, private _dialog: MatDialog, private _translate: TranslateService) {
    this._translate.getTranslation(this._translate.currentLang).subscribe(translation => this.translation = translation);
  }

  public ngOnInit() {
    if (this.data.timezone) {
      this.timeDisplay = moment.tz(this.data.time, this.data.timezone).locale('en').format('hh:mm A');
      this.dateDisplay = moment.tz(this.data.date, this.data.timezone).locale('en').format('dddd MMMM DD');
    }
    for (const ticket of this.data.tickets) {
      ticket.checked = false;
    }
  }

  public closePopup() {
    this.dialogRef.close();
  }

  public download() {
    const zoneName = moment.tz.guess();
    // const timezone = moment.tz(zoneName).zoneAbbr();
    this._communicationService.showLoading(true);
    this._receiptPopupService.getReceiptPdf(this.data._id, zoneName).subscribe(pdfResult => {
        this.showPdf(pdfResult);
      },
      err => {
        this._handleErrors(err);
        this._communicationService.showLoading(false);
      },
      () => {
        this._communicationService.showLoading(false);
      }
    );
  }

  public refundTickets() {
    if (this.selectedCount !== 0) {
      const ticketsToRefund = [];
      for (const ticket of this.data.tickets) {
        if (ticket.checked) {
          ticketsToRefund.push(ticket.ticketId);
        }
      }
      this._communicationService.showLoading(true);
      let refundTicketRes;
      this._receiptPopupService.refundTickets(ticketsToRefund).subscribe(refundTicketResponse => {
          refundTicketRes = refundTicketResponse;
        },
        err => {
          this._handleErrors(err);
          this._communicationService.showLoading(false);
        },
        () => {
          this._communicationService.showLoading(false);
          this.dialogRef.close({showWalletUpdate: true, wallet: refundTicketRes.wallet});
        }
      );
    }
  }

  public showPdf(linkSource) {
    const fileName = 'Receipt.pdf';
    const base64PDF = linkSource.split('data:application/pdf;base64,')[1];
    const binary = atob(base64PDF.replace(/\s/g, ''));
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([view], {type: 'application/pdf'});
    if (window.top.navigator.msSaveOrOpenBlob) {
      window.top.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }

  public showAlert(title: string, content: string): void {
    const dialogId = new Date();
    this._communicationService.setLatestDialogId(dialogId);
    this._dialog.open(DialogComponent, {
      data: {
        title,
        content,
        isConfirmationPopUp: false
      }
    });
  }

  public selectTicket(event, ticket) {
    ticket.checked = event.checked;
    if (ticket.checked) {
      this.selectedCount++;
    } else {
      this.selectedCount--;
    }
  }

  public selectAll() {
    if (this.selectedCount !== 0) {
      for (const ticket of this.data.tickets) {
        ticket.checked = false;
      }
      this.selectedCount = 0;
    } else {
      for (const ticket of this.data.tickets) {
        ticket.checked = true;
      }
      this.selectedCount = this.data.tickets.length;
    }
  }

  private _handleErrors(error) {
    switch (error.status) {
      default:
        this.showAlert(this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TITLE, this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TEXT);
        break;
    }
  }

}
