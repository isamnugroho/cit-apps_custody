import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currencyCode: string = 'IDR'): string {
    if (!value) return '';

    let formattedValue = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0
    }).format(value);

    return formattedValue.replace(',', '.'); // Replace comma with dot
  }
}
