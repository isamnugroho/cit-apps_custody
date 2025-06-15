/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component } from '@angular/core';
import { db } from '../../db/db';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { UtilService } from 'src/app/services/util.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  data_planning = [];
  data_runsheet = [];

  id_plan: any = '';

  constructor(
    public util: UtilService,
    private http: HttpClient
  ) { }

  onTabsWillChange(event: any) {
    // const index = this.tabsStack.indexOf(event.tab);
    // if( index > -1) {
    //   // Your logic here
    //   // Remove it from the array so it can pushed at the end again
    //   this.tabsStack.splice(index, 1);
    // }
    // this.tabsStack.push(event.tab);

    console.log(event.tab);

    if(event.tab=="home") {

    }
  }

  async QRScann() {
    const currentTab = document.querySelector('ion-tab-button.tab-selected')?.getAttribute('tab');
    // alert(currentTab);
    if(currentTab!=="explore") {
      alert("Please select Job Menu to scan QR code");
      return;
    }

    const count_lapangan = await db.tableRun
      .filter((data) => data.jenis_layanan_lapangan !== "")
      .count();
      
    if(count_lapangan>0) {
      alert("JOB PETUGAS CUSTODY DI LAPANGAN");
      const count_undone = await db.tableRun
        .filter((data) => data.status_complete !== true)
        .count(); 

      if(count_undone>0) {
        var res = await db.tablePlan.toArray();
        this.id_plan = res[0].id;
        console.log(res[0].id);

        let server = this.util.ip_server+"/public/update_status/start_job";

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          })
        };
        
        const postData = {
          id_plan: this.id_plan
        };

        this.http.post(server, postData, httpOptions).subscribe(response => {
          console.log('Response:', response);
          var json = JSON.parse(JSON.stringify(response));
          if(json.result=="success") {
            // this.util.qrScanned = true;
            db.tablePlan.update(this.id_plan, {action_start_job: json.messages.result, status_start_job: true}).then(function (updated) {
              if (updated) {
                console.log ("Data was updated");
              } else {
                console.log ("Nothing was updated - there was no friend with primary key: 2");
              }
            });
          }
        }, error => {
          console.error('Error:', error);
        });
      } else {
        const result = await CapacitorBarcodeScanner.scanBarcode({
          hint: CapacitorBarcodeScannerTypeHint.ALL
        });

        if(result.ScanResult=='BJK001') {
          var res = await db.tablePlan.toArray();
          this.id_plan = res[0].id;
          console.log(res[0].id);

          let server = this.util.ip_server+"/public/update_status/end_job";

          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded',
            })
          };
          
          const postData = {
            id_plan: this.id_plan
          };

          this.http.post(server, postData, httpOptions).subscribe(response => {
            console.log('Response:', response);
            var json = JSON.parse(JSON.stringify(response));
            if(json.result=="success") {
              // this.util.qrScanned = true;
              
              db.tablePlan.update(this.id_plan, {action_end_job: json.messages.result, status_end_job: true}).then(function (updated) {
                if (updated) {
                  console.log ("Data was updated");
                } else {
                  console.log ("Nothing was updated - there was no friend with primary key: 2");
                }
              });
            }
          }, error => {
            console.error('Error:', error);
          });
        }
      }
    } else {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL
      });

      if(result.ScanResult=='BJK001') {
        // this.util.qrScanned = true;
        // Get all records from tablePlan

        const count_undone = await db.tableRun
          .filter((data) => data.status_complete !== true)
          .count(); 

        if(count_undone>0) {
          var res = await db.tablePlan.toArray();
          this.id_plan = res[0].id;
          console.log(res[0].id);

          let server = this.util.ip_server+"/public/update_status/start_job";

          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded',
            })
          };
          
          const postData = {
            id_plan: this.id_plan
          };

          this.http.post(server, postData, httpOptions).subscribe(response => {
            console.log('Response:', response);
            var json = JSON.parse(JSON.stringify(response));
            if(json.result=="success") {
              // this.util.qrScanned = true;
              db.tablePlan.update(this.id_plan, {action_start_job: json.messages.result, status_start_job: true}).then(function (updated) {
                if (updated) {
                  console.log ("Data was updated");
                } else {
                  console.log ("Nothing was updated - there was no friend with primary key: 2");
                }
              });
            }
          }, error => {
            console.error('Error:', error);
          });
        } else {
          var res = await db.tablePlan.toArray();
          this.id_plan = res[0].id;
          console.log(res[0].id);

          let server = this.util.ip_server+"/public/update_status/end_job";

          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded',
            })
          };
          
          const postData = {
            id_plan: this.id_plan
          };

          this.http.post(server, postData, httpOptions).subscribe(response => {
            console.log('Response:', response);
            var json = JSON.parse(JSON.stringify(response));
            if(json.result=="success") {
              // this.util.qrScanned = true;
              
              db.tablePlan.update(this.id_plan, {action_end_job: json.messages.result, status_end_job: true}).then(function (updated) {
                if (updated) {
                  console.log ("Data was updated");
                } else {
                  console.log ("Nothing was updated - there was no friend with primary key: 2");
                }
              });
            }
          }, error => {
            console.error('Error:', error);
          });
        }
      }
    }

    // const result = await CapacitorBarcodeScanner.scanBarcode({
    //   hint: CapacitorBarcodeScannerTypeHint.ALL
    // });

    // if (result.ScanResult) {
    //   // Detect current page/tab
    //   const currentTab = document.querySelector('ion-tab-button.tab-selected')?.getAttribute('tab');
    //   console.log('Current tab:', currentTab);

    //   if (result.ScanResult === 'BJK001') {
    //     // this.util.qrScanned = true;
    //     // Additional logic here
    //   }
    // }
    // const result = await CapacitorBarcodeScanner.scanBarcode({
    //   hint: CapacitorBarcodeScannerTypeHint.ALL
    // });

    // if(result.ScanResult=='BJK001') {
    //     // this.util.qrScanned = true;
        
    // }
  }
}
