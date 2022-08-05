import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cardNumber'
})
export class CardNumberPipe implements PipeTransform {
  public transform(val: string, pipeType = null) {
    if (val.match(/[A-Za-z]/i)) {
      return val;
    }
    let pipeValue;
    if (pipeType === 'pipe1') {
      if (val.length < 6) {
        pipeValue = val.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
      } else if (val.length > 11 && val.length < 16) {
        pipeValue = val.replace(/\s+/g, '').replace(/(\d{4})(\d{6})/g, '$1 $2 ').trim();
      } else if (val.length > 16) {
        pipeValue = val.replace(/\s+/g, '').replace(/(\d{4})(\d{6})(\d{5})/g, '$1 $2 $3').trim();
      } else {
        return val;
      }
    } else {
      pipeValue = val.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    return pipeValue;
  }
}
