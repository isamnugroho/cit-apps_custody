import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'terbilangFormat'
})
export class TerbilangFormatPipe implements PipeTransform {
  transform(angka: string | number, jenis: string = ''): string {
    let satuan = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
    let n = typeof angka === 'string' ? parseInt(angka.replace(/\./g, ''), 10) : angka;
    const satuanAkhir = jenis === 'kertas' ? 'Lembar' : jenis === 'logam' ? 'Coin' : 'Rupiah';
    if (isNaN(n) || n === 0) return `nol ${satuanAkhir}`;
    function toTerbilang(x: number): string { 
      if (x < 12) return satuan[x];
      if (x < 20) return toTerbilang(x - 10) + " belas";
      if (x < 100) return toTerbilang(Math.floor(x / 10)) + " puluh " + toTerbilang(x % 10);
      if (x < 200) return "seratus " + toTerbilang(x - 100);
      if (x < 1000) return toTerbilang(Math.floor(x / 100)) + " ratus " + toTerbilang(x % 100);
      if (x < 2000) return "seribu " + toTerbilang(x - 1000);
      if (x < 1000000) return toTerbilang(Math.floor(x / 1000)) + " ribu " + toTerbilang(x % 1000);
      if (x < 1000000000) return toTerbilang(Math.floor(x / 1000000)) + " juta " + toTerbilang(x % 1000000);
      if (x < 1000000000000) return toTerbilang(Math.floor(x / 1000000000)) + " milyar " + toTerbilang(x % 1000000000);
      if (x < 1000000000000000) return toTerbilang(Math.floor(x / 1000000000000)) + " triliun " + toTerbilang(x % 1000000000000);
      return "";
    }
    return (toTerbilang(n).replace(/\s+/g, ' ').trim() + ` ${satuanAkhir}`).toUpperCase();
    // return jenis;
  }
}
