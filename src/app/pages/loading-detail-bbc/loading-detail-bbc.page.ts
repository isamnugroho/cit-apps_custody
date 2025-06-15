import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';


import { db } from '../../db/db';
import { liveQuery } from 'dexie';

@Component({
  selector: 'app-loading-detail-bbc',
  templateUrl: './loading-detail-bbc.page.html',
  styleUrls: ['./loading-detail-bbc.page.scss'],
})
export class LoadingDetailBbcPage implements OnInit {
data_loading: any = [];
  bag_number: any = [];
  seal_number: any = [];
  is_valid: boolean = false;

  id_plan: any = '';
  id: any = '';

  constructor(
    public util: UtilService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    public platform: Platform,
    private http: HttpClient
  ) { 
    this.route.queryParams.subscribe((data: any) => {
      this.id_plan = data.id_plan;
      this.id = data.id;
      // this.data_loading = 
    });
    // this.data_loading = checkRunSheet$;
    // this.loadDataLoading(this.id)
    // this.listTodoItems()
  }

  ngOnInit() {
    // console.log(this.data_loading)

    console.log(this.seal_number.length)
  }

  onBack() {
    this.util.onBack();
  }

  listDataLoading$ = liveQuery(() => this.loadDataLoading());

  async loadDataLoading() {
    var collection = db.tableRun.filter((data) => {
      return (data.status_loading==false && data.id==this.id);
    });
    var datax = await collection.toArray();
    this.data_loading = datax;
    return await datax;
  }

  async startScan() {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL
    });
  
    console.log("QR Code:", result);
  }
  
  async onScanBag() {
    console.log(this.platform.platforms());

    console.log(this.data_loading[0].bag_number);
    if(this.platform.is('mobileweb')) {
      let age = prompt('SCAN BAG NUMBER');
      if(this.data_loading[0].bag_number.indexOf(age) > -1) {
        if(this.bag_number.indexOf(age) > -1) {
          alert("QR-CODE Already Scanned") 
        } else {
          this.bag_number.push(age)
        }
      } else {
        alert("Invalid QR-CODE")
      }
    } else {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL
      });

      if(this.data_loading[0].bag_number.indexOf(result.ScanResult) > -1) {
        if(this.bag_number.indexOf(result.ScanResult) > -1) {
          alert("QR-CODE Already Scanned") 
        } else {
          this.bag_number.push(result.ScanResult)
        }
      } else {
        alert("Invalid QR-CODE")
      }
      console.log("ANDROID")
    }

    this.onCheckQRValid();
  }

  async onScanSeal() {
    console.log(this.platform.platforms());
    
    console.log(this.data_loading[0].seal_number);
    if(this.platform.is('mobileweb')) {
      let age = prompt('SCAN SEAL NUMBER');
      if(this.data_loading[0].seal_number.indexOf(age) > -1) {
        if(this.seal_number.indexOf(age) > -1) {
          alert("QR-CODE Already Scanned") 
        } else {
          this.seal_number.push(age)
        }
      } else {
        alert("Invalid QR-CODE")
      }
    } else {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL
      });

      if(this.data_loading[0].seal_number.indexOf(result.ScanResult) > -1) {
        if(this.seal_number.indexOf(result.ScanResult) > -1) {
          alert("QR-CODE Already Scanned") 
        } else {
          this.seal_number.push(result.ScanResult)
        }
      } else {
        alert("Invalid QR-CODE")
      }
      console.log("ANDROID")
    }

    this.onCheckQRValid();
  }

  onCheckQRValid() {
    if (
      this.data_loading[0].bag_number.length === this.bag_number.length &&
      this.data_loading[0].seal_number.length === this.seal_number.length
    ) {
      this.is_valid = true;
    } else {
      this.is_valid = false;
    }
  }

  // async loadDataLoading(id: string) {
  //   return new Promise((resolve, reject) => {
  //     var data = db.tableRun.filter((data) => {
  //       return data.status_loading==false && data.id==id;
  //     }).toArray();
  //     resolve(data);
  //   });
  // }

  // checkRunSheet$ = liveQuery(async () => {
  //   var idaax = await db.tableRun.filter((data) => {
  //     return data.status_loading==false && data.id=='67bec7190da2f8188a06655a';
  //   }).toArray();
  //   return idaax[0];
  // });

  // async loadDataLoading(id: string) {
  //   console.log(id);
  //   var collection = db.tableRun.filter((data) => {
  //     return data.status_loading==false && data.id==id;
  //   });
  //   console.log(await collection.toArray());
  //   this.data_loading = await collection.toArray();
  // }

  onDoneLoading() {
    // console.log(this.util.data_runsheet[this.index]);
    // this.util.data_runsheet[this.index].status_loading = true;

    // this.util.getKeys("data_planning").then((res) => {
    //   const json = JSON.parse(res);
    //   this.util.data_runsheet[this.index].status_loading = true;
    //   json.detail_runsheet[this.index].status_loading = true;
    //   this.util.setKeys("data_planning", JSON.stringify(json));
    // });

    // alert(this.id_plan+" "+this.id);
    const that = this;
    


    let server = this.util.ip_server+"/public/update_status/update_loading_status";
      // let server = "http://bima.techmindo.co.id/rest_api/public/master_plan";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };
    
    const postData = {
      id_plan: this.id_plan,
      id_detail: this.id,
      loading: true
    };

    this.http.post(server, postData, httpOptions)
      .subscribe(response => {
        console.log('Response:', response);

        db.tableRun.update(this.id, {status_loading: true}).then(function (updated) {
          if (updated)
            that.util.navigateToPage('tabs/explore');
          else
            console.log ("Nothing was updated - there was no friend with primary key: 2");
        });

        this.util.navigateToPage('tabs/explore');
      }, error => {
        console.error('Error:', error);

        db.tableRun.update(this.id, {status_loading: true}).then(function (updated) {
          if (updated)
            that.util.navigateToPage('tabs/explore');
          else
            console.log ("Nothing was updated - there was no friend with primary key: 2");
        });

        this.util.navigateToPage('tabs/explore');
      });
  
  }

  async onDownload() {
    const alert = await this.alertController.create({
      header: 'Downloaded!',
      message: 'Your E-Receipt is Downloaded',
      mode: "ios",
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
            this.util.navigateRoot('/tabs');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.util.navigateRoot('/tabs');
          }
        }
      ]
    });

    await alert.present();
  }
}
