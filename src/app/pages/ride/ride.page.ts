import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { db } from '../../db/db';

import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { Browser } from '@capacitor/browser';


@Component({
  selector: 'app-ride',
  templateUrl: './ride.page.html',
  styleUrls: ['./ride.page.scss'],
})
export class RidePage implements OnInit {
  name: any = '';
  activeService: any = '';
  
  id: any = '';

  constructor(
    public util: UtilService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((data: any) => {
      this.id = data.id;
    });
  }
  

  ngOnInit() {
    this.startTimer();
  }

  date: any;
  now: any;
  targetDate: any = new Date(2025, 1, 20);
  targetTime: any = this.targetDate.getTime();
  difference: number;
  months: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  currentTime: any = `${this.months[this.targetDate.getMonth()]
    } ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;

  @ViewChild('days', { static: true }) days: ElementRef;
  @ViewChild('hours', { static: true }) hours: ElementRef;
  @ViewChild('minutes', { static: true }) minutes: ElementRef;
  @ViewChild('seconds', { static: true }) seconds: ElementRef;

  ngAfterViewInit() {
    // setInterval(() => {
    //   this.tickTock();
    //   this.difference = this.targetTime - this.now;
    //   this.difference = this.difference / (1000 * 60 * 60 * 24);

    //   !isNaN(this.days.nativeElement.innerText)
    //     ? (this.days.nativeElement.innerText = Math.floor(this.difference))
    //     : (this.days.nativeElement.innerHTML = `<img src="https://i.gifer.com/VAyR.gif" />`);
    // }, 1000);
  }

  tickTock() {
    this.date = new Date();
    this.now = this.date.getTime();
    this.days.nativeElement.innerText = Math.floor(this.difference);
    this.hours.nativeElement.innerText = 23 - this.date.getHours();
    this.minutes.nativeElement.innerText = 60 - this.date.getMinutes();
    this.seconds.nativeElement.innerText = 60 - this.date.getSeconds();
  }


  time: number = 0;
  display: any;
  interval: any;

  startTimer() {
    console.log("=====>");
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display = this.transform(this.time)
    }, 1000);
  }

  transform(value: number): string {
    var sec_num = value;
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    console.log(seconds);

    if (hours > 60) { hours = 0; }
    if (minutes > 60) { minutes = 0; }
    if (seconds > 60) { seconds = 0; }


    this.hours.nativeElement.innerText = String(hours).padStart(2, '0');
    this.minutes.nativeElement.innerText = String(minutes).padStart(2, '0');
    this.seconds.nativeElement.innerText = String(seconds).padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds;
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  changeServices(name: any) {
    this.activeService = name;
  }

  async getItemById(id: number) {
    const item = await db.tableRun.get(id);
    return item;
    // console.log(item);
  }

  async openGoogleMaps(lat: number, lng: number) {
    await Browser.open({ url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` });
  }

  async onNavigation(id: any) {
    const res = await this.getItemById(id);
    if (res) {
      console.log(res);
      const latlng = res.latlng;
      const [lat, lng] = latlng.split(", ").map(Number);

      this.openGoogleMaps(lat, lng);

    } else {
      console.error("Item not found.");
    }
  }

  async onArrive(id: any) {
    if(this.util.is_dev) {
      this.pauseTimer();
      const param: NavigationExtras = {
        queryParams: {
          id: id
        }
      };
      this.util.navigateToPage('job-detail', param);
    } else {
      const res = await this.getItemById(id);
      if (res) {
        console.log(res);
          const result = await CapacitorBarcodeScanner.scanBarcode({
            hint: CapacitorBarcodeScannerTypeHint.ALL
          });

          if(res.kode==result.ScanResult) {
            this.pauseTimer();
            const param: NavigationExtras = {
              queryParams: {
                id: id
              }
            };
            this.util.navigateToPage('job-detail', param);
          } else {
            alert("QR CODE not MATCH!");
          }
      } else {
          console.error("Item not found.");
      } 
    }

    

       // Logs the resolved value

      // const result = await CapacitorBarcodeScanner.scanBarcode({
      //   hint: CapacitorBarcodeScannerTypeHint.ALL
      // });

      // if(data.kode==result.ScanResult) {
      //   this.pauseTimer();
      //   const param: NavigationExtras = {
      //     queryParams: {
      //       id: id
      //     }
      //   };
      //   this.util.navigateToPage('job-detail', param);
      // } else {
      //   alert("QR CODE not MATCH!");
      // }
    // });
    
    // const result = await CapacitorBarcodeScanner.scanBarcode({
    //   hint: CapacitorBarcodeScannerTypeHint.ALL
    // });
    // alert(result.ScanResult);
    // this.pauseTimer();
    // const param: NavigationExtras = {
    //   queryParams: {
    //     id: id
    //   }
    // };
    // this.util.navigateToPage('job-detail', param);
  }

  onBack() {
    // this.util.onBack();
    this.pauseTimer();
    this.util.onBack();
  }
}
