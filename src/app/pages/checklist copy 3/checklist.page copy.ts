import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { SignaturePage } from '../signature/signature.page';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import axios from 'axios';

import { db } from '../../db/db';
import { liveQuery } from 'dexie';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
  data_loading: any = [];
  is_valid: boolean = false;
  is_valid_sign: boolean = false;
  id: any = '';
  jenis_layanan: any = '';
  checked: boolean = false;
  total: any = 0;

  constructor(
    public util: UtilService,
    private alertController: AlertController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    public platform: Platform,
    private http: HttpClient
  ) { 
    this.route.queryParams.subscribe((data: any) => {
      this.id = data.id;
    });

    this.util.signatureImgCustody = "";
    this.util.signatureImgPIC = "";
    this.util.bag_number = [];
    this.util.seal_number = [];
  }

  listDataLoading$ = liveQuery(() => this.loadDataLoading());
  
  async loadDataLoading() {
    var collection = db.tableRun.filter((data) => {
      return (data.status_loading==true && data.id==this.id);
    });
    var datax = await collection.toArray();
    const arr1: any = datax[0].denom_kertas;
    const arr2: any = datax[0].denom_logam;

    // for(let item of arr) {
    //   console.log(item);
    // }

    Object.entries(arr1).forEach(([key, value]) => {
      this.util.denom_kertas.map(i => { 
        if(i.id==key) {
          return { item: i.item, value: i.value = (value=="" ? "0" : value), status: i.status = '' }
        } else {
          return { item: i.item, value: i.value = (i.value=="" ? "0" : i.value), status: i.status = '' }
        }
       });
    });

    Object.entries(arr2).forEach(([key, value]) => {
      this.util.denom_logam.map(i => { 
        if(i.id==key) {
          return { item: i.item, value: i.value = (value=="" ? "0" : value), status: i.status = '' }
        } else {
          return { item: i.item, value: i.value = (i.value=="" ? "0" : i.value), status: i.status = '' }
        }
       });
    });
    // console.log(arr2);
    // console.log(this.util.denom_logam);

    // this.util.denom_kertas.map(i => {
    // arr.map((i) => {
    //   console.log(i)
    // });


    // this.util.denom_kertas
    this.data_loading = datax;
    this.jenis_layanan = datax[0].jenis_layanan;
    this.onCheckQRValid()
    this.onCheckSignValid()
    return await datax;
  }

  ngOnInit() {
  }

  async onScanBag() {
    // console.log(this.platform.platforms());

    // console.log(this.data_loading[0].bag_number);
    if(this.platform.is('mobileweb')) {
      let age = prompt('Berapakah umut anda?', 'BAG-001');
      if(this.data_loading[0].bag_number.indexOf(age) > -1) {
        if(this.util.bag_number.indexOf(age) > -1) {
          alert("QR-CODE Already Scanned") 
        } else {
          this.util.bag_number.push(age)
        }
      } else {
        alert("Invalid QR-CODE")
      }
    } else {
      console.log("ANDROID")
    }

    this.onCheckQRValid();
  }

  async onScanSeal() {
    // console.log(this.platform.platforms());
    
    console.log(this.data_loading[0].seal_number);
    if(this.platform.is('mobileweb')) {
      let age = prompt('Berapakah umut anda?', 'SEAL-001');
      if(this.data_loading[0].seal_number.indexOf(age) > -1) {
        if(this.util.seal_number.indexOf(age) > -1) {
          alert("QR-CODE Already Scanned") 
        } else {
          this.util.seal_number.push(age)
        }
      } else {
        alert("Invalid QR-CODE")
      }
    } else {
      console.log("ANDROID")
    }

    this.onCheckQRValid();
  }

  onCheckQRValid() {
    if(this.data_loading[0].bag_number.length==this.util.bag_number.length) {
      this.is_valid = true
    } else {
      this.is_valid = false
    }
    
    if(this.data_loading[0].seal_number.length==this.util.seal_number.length) {
      this.is_valid = true
    } else {
      this.is_valid = false
    }
  }

  onCheckSignValid() {
    if(this.util.signatureImgPIC!=="") {
      this.is_valid_sign = true
    } else {
      this.is_valid_sign = false
    }
  }

  testCheck($event: any) {
    // console.log($event.target.checked);
    // console.log($event);
    this.checked = $event.target.checked;

    this.util.denom_kertas.map(i => { return { item: i.item, value: i.value, status: i.status = '' } });
    this.util.denom_logam.map(i => { return { item: i.item, value: i.value, status: i.status = '' } });
    this.total = 0;
    // this.util.denom_logam = this.util.denom_kertas.map(i => i.status = '');
    // console.log(this.checked);
  }


  inputOnCHange($event: any, i: any, type: any = 'kertas') {
    // console.log($event.target.checked);
    // console.log($event);
    // this.checked = $event.target.checked;

    // console.log(i);
    // console.log($event.target.value);

    if (type == "kertas") {
      this.util.denom_kertas[i].value = $event.target.value == '' ? 0 : $event.target.value;
    } else if (type == "logam") {
      this.util.denom_logam[i].value = $event.target.value == '' ? 0 : $event.target.value;
    }
  }

  checkboxOnCHange($event: any, i: any, type: any = 'kertas') {
    // console.log($event.target.checked);
    // console.log($event);
    // this.checked = $event.target.checked;

    // console.log(i);
    console.log($event.target.checked);

    if (type == "kertas") {
      this.util.denom_kertas[i].status = $event.target.checked == true ? "✓ loaded" : "";
      if (this.util.denom_kertas[i].item.includes('K')) {
        // this.total = this.util.denom_kertas.reduce((n, { value, item }) => n + parseInt(value) * parseInt(item.split("K")[0]), 0);
        const new_total = (parseInt(this.util.denom_kertas[i].value) * parseInt(this.util.denom_kertas[i].item.split("K")[0])) * 1000;
        if ($event.target.checked) {
          this.total = this.total + new_total;
        } else {
          this.total = this.total - new_total;
        }
      } else {
        const new_total = parseInt(this.util.denom_kertas[i].value) * parseInt(this.util.denom_kertas[i].item)
        if ($event.target.checked) {
          this.total = this.total + new_total;
        } else {
          this.total = this.total - new_total;
        }
      }
    } else if (type == "logam") {
      this.util.denom_logam[i].status = $event.target.checked == true ? "✓ loaded" : "";
      if (this.util.denom_logam[i].item.includes('K')) {
        // this.total = this.util.denom_kertas.reduce((n, { value, item }) => n + parseInt(value) * parseInt(item.split("K")[0]), 0);
        const new_total = (parseInt(this.util.denom_logam[i].value) * parseInt(this.util.denom_logam[i].item.split("K")[0])) * 1000;
        if ($event.target.checked) {
          this.total = this.total + new_total;
        } else {
          this.total = this.total - new_total;
        }
      } else {
        const new_total = parseInt(this.util.denom_logam[i].value) * parseInt(this.util.denom_logam[i].item)
        if ($event.target.checked) {
          this.total = this.total + new_total;
        } else {
          this.total = this.total - new_total;
        }
      }
    }
    console.log(this.total);
  }

  onBack() {
    this.util.onBack();
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

  async presentModalCustody() {
    const modal = await this.modalController.create({
      component: SignaturePage,
      cssClass: 'bookmark-modal',
      componentProps: { prop: 'custody' }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.data == 'ok' && data.role == 'ok') {
        // this.util.navigateToPage('cancel-booking');
        this.onCheckSignValid();
      }
    });
    await modal.present();
  }

  async presentModalPIC() {
    const modal = await this.modalController.create({
      component: SignaturePage,
      cssClass: 'bookmark-modal',
      componentProps: { prop: 'pic' }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.data == 'ok' && data.role == 'ok') {
        // this.util.navigateToPage('cancel-booking');
        this.onCheckSignValid();
      }
    });
    await modal.present();
  }

  transferRekening() {

  }

  inquiryRekening() {
    
  }

  onJobComplete() {
    // console.log("AAAAAA")
    // // this.util.navigateToPage('tabs/explore');

    // let server = this.util.ip_server+"/public/master_plan/"+this.id;

    // var data = new FormData();
    // var oReq = new XMLHttpRequest();

    // oReq.open("PUT", server, true);
    // oReq.onreadystatechange = function() {
    //   if (oReq.readyState == 4 && oReq.status == 200){
    //     console.log(oReq.responseText);
    //     // loading.dismiss();
    //     // that.presentToast('SUBMIT SUCCESS', 'bottom');
    //     if(oReq.responseText=="success") {
    //       // that.update_data(withness)
    //       // delete_temp();
    //     }
    //   } else {
    //     // loading.dismiss();
    //     // that.presentToast('SUBMIT GAGAL', 'bottom');
    //   }
    // }

    // oReq.ontimeout = function (e) {
    //   console.log(e)
    //   // loading.dismiss();
    //   // that.presentToast('SUBMIT TIMEOUT', 'bottom');
    //   // that.update_data(withness)
    // };

    // oReq.onerror = function (e) {
    //   // loading.dismiss();
    //   console.log(e);
    //   // that.presentToast(JSON.stringify(e), 'bottom');
    //   // that.update_data(withness)
    // };

    // data.append('ttd_pic', this.util.signatureImgPIC);
    // data.append('ttd_custody', this.util.signatureImgCustody);

    const that = this;

    
    // this.util.signatureImgCustody = "";
    // this.util.signatureImgPIC = "";

    console.log(this.data_loading);

    const body = new URLSearchParams();
    body.set('id_plan', this.data_loading[0].id_plan);
    body.set('jenis_layanan', this.data_loading[0].jenis_layanan);
    body.set('step_android', '1');
    body.set('ttd_custody', this.util.signatureImgCustody);
    body.set('ttd_pic', this.util.signatureImgPIC);
    if(this.data_loading[0].jenis_layanan=="Pickup") {
      const convertedDenomKertas = this.util.denom_kertas.reduce((acc, curr) => {
        if(curr.value=="0") {
          acc[curr.id] = "";
        } else {
          acc[curr.id] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const convertedDenomLogam = this.util.denom_logam.reduce((acc, curr) => {
        if(curr.value=="0") {
          acc[curr.id] = "";
        } else {
          acc[curr.id] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);

      // console.log(convertedDenomKertas);
      // console.log(convertedDenomLogam);
      
      body.set('denom_kertas', JSON.stringify(convertedDenomKertas));
      body.set('denom_logam', JSON.stringify(convertedDenomLogam)); 
    }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', '*/*'); 

    let server = this.util.ip_server+"/public/master_plan/"+this.id;
    // let server = "http://bima.techmindo.co.id/rest_api/public/master_plan/"+this.id;

    this.http.put(server, body.toString(), {headers}).subscribe((data: any) => {
      console.log(data.result);
      if(data.result=="success") {
        db.tableRun.update(that.id, {status_complete: true}).then(function (updated) {
          if (updated) {
            that.util.signatureImgCustody = '';
            that.util.signatureImgPIC = '';
            that.util.navigateToPage('tabs/explore');
          } else {
            console.log ("Nothing was updated - there was no friend with primary key: 2");
          }
        });
      }
    }, error => {
      console.log(error);
    });

    // const params = new URLSearchParams();
    // params.append('param1', 'value1');
    // params.append('param2', 'value2');

    // const options = {
    //   url: 'http://192.168.1.3/public/master_plan/67bec7010da2f8188a066559',
    //   method: 'PUT',
    //   headers: {
    //     'Accept': '*/*',
    //     'Content-Type': 'charset=UTF-8'
    //   },
    //   data: params
    // };

    // axios(options)
    // .then(response => {
    //   console.log(response.status);
    // })
    // .catch(error => {
    //   console.error(error);
    // });
  }
}
