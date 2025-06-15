import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { SignaturePage } from '../signature/signature.page';
import { CountdownModalPage } from '../countdown-modal/countdown-modal.page';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { db } from '../../db/db';
import { liveQuery } from 'dexie';

@Component({
  selector: 'app-job-finish',
  templateUrl: './job-finish.page.html',
  styleUrls: ['./job-finish.page.scss'],
})
export class JobFinishPage implements OnInit {
  data_loading: any = [];
  id: any = '';
  total_kertas: any = 0;
  total_logam: any = 0;
  total: any = 0;
  is_valid_sign: boolean = false;
  jumlah_lembar: any = 0;
  jumlah_logam: any = 0;
  total_ctc: any = 0;

  constructor(
    public util: UtilService,
    private alertController: AlertController,
    private modalController: ModalController,
    private http: HttpClient,
    private route: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe((data: any) => {
      this.id = data.id;
    });

    this.total_kertas = this.util.denom_kertas.reduce((sum, item) => {
      let denom = 0;
      if (item.item.includes('K')) {
        denom = parseInt(item.item.split('K')[0]) * 1000;
      } else {
        denom = parseInt(item.item);
      }
      return sum + (parseInt(item.value || '0') * denom);
    }, 0);

    
    this.total_logam = this.util.denom_logam.reduce((sum, item) => {
      let denom = 0;
      if (item.item.includes('K')) {
        denom = parseInt(item.item.split('K')[0]) * 1000;
      } else {
        denom = parseInt(item.item);
      }
      return sum + (parseInt(item.value || '0') * denom);
    }, 0);

    this.total = this.total_kertas + this.total_logam;

    this.onCheckSignValid();
  }


  ngOnInit() {
    
  }

  onBack() {
    this.util.onBack();
  }

  listDataLoading$ = liveQuery(() => this.loadDataLoading());
  
  async loadDataLoading() {
    var collection = db.tableRun.filter((data) => {
      return (data.status_loading==true && data.id==this.id);
    });
    var datax = await collection.toArray();
    // console.log(datax);
    // console.log(datax[0].denom_kertas[100000]);
    this.data_loading = datax;
    return await datax;
  }

  onChecklist(id: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: id
      }
    };
    this.util.navigateToPage('checklist', param);
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

  onCheckSignValid() {
    if(this.util.signatureImgPIC!=="") {
      this.is_valid_sign = true
    } else {
      this.is_valid_sign = false
    }
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

  onConfirm() {
    if (!this.is_valid_sign) {
      this.util.showToast('Signature PIC harus diisi', 'danger', 'top');
      return;
    }

    const alert = this.alertController.create({
      header: 'Konfirmasi',
      message: 'Apakah anda yakin ingin menyelesaikan proses ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ya',
          handler: () => {
            console.log('Confirm Okay');
            // const param: NavigationExtras = {
            //   queryParams: {
            //     id: this.id
            //   }
            // };
            // this.util.navigateToPage('job-finish', param);
            // let countdown = 10;
            // const interval = setInterval(() => {
            //   countdown--;
            //   if (countdown === 0) {
            //   clearInterval(interval);
            //   // this.util.navigateRoot('/tabs');
            //   }
            // }, 1000);

            // this.util.showModal('Proses selesai! Anda akan diarahkan ke halaman utama dalam 10 detik.');
            let countdown = 10;
            const countdownAlert = async () => {
              const modal = await this.modalController.create({
                component: CountdownModalPage,
                componentProps: { countdown },
                cssClass: 'countdown-container'
              });
              modal.onDidDismiss().then((data) => {
                console.log(data)
                if (data && data.data == 'void' && data.role == 'ok') {
                } else if (data && data.data == 'finish' && data.role == 'ok') {
                  // this.util.navigateRoot('/tabs');
                  this.onJobComplete()
                }
              });
              await modal.present();
            };
            countdownAlert();
          }
        }
      ]
    });

    alert.then(alertEl => alertEl.present());
  }

  async onJobComplete() {
    if(this.data_loading[0].group=="Branch") {
      if(this.data_loading[0].jenis_layanan=="Pickup") {
        if(this.total!==0) {
          this.onJobCompleteBranch();
        } else {
          alert("Invalid, value tidak boleh 0");
        }
      } else if(this.data_loading[0].jenis_layanan=="CTC Delivery") {
        if(this.total_ctc!==0) {
          this.onJobCompleteBranchCTC();
        } else {
          alert("Invalid, value tidak boleh 0");
        }
      } else if(this.data_loading[0].jenis_layanan=="Delivery") {
          this.onJobCompleteBranch();
      }
    } else {
      if(this.total!==0) {
        this.onJobCompleteBranch();
      } else {
        alert("Invalid, value tidak boleh 0");
      }
    }
  }

  onJobCompleteBranch() {
    const that = this;

    const body = new URLSearchParams();
    body.set('id_plan', this.data_loading[0].id_plan);
    body.set('jenis_layanan', this.data_loading[0].jenis_layanan);
    body.set('step_android', '1');
    body.set('status_transfer', '00');
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
      
      body.set('denom_kertas', JSON.stringify(convertedDenomKertas));
      body.set('denom_logam', JSON.stringify(convertedDenomLogam)); 
    }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', '*/*'); 

    let server = this.util.ip_server+"/public/master_plan/"+this.id;

    this.http.put(server, body.toString(), {headers}).subscribe((data: any) => {
      // console.log(data.result);
      if(data.result=="success") {
        db.tableRun.update(that.id, {status_complete: true}).then(function (updated) {
          if (updated) {
            that.util.resetDenomKertas();
            that.util.resetDenomLogam();
            that.util.signatureImgPIC = "";
            that.util.navigateToPage('tabs/explore');
          }
          else {
            console.log ("Nothing was updated - there was no friend with primary key: 2");
          }
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onJobCompleteBranchCTC() {
    const that = this;

    const body = new URLSearchParams();
    body.set('id_plan', this.data_loading[0].id_plan);
    body.set('jenis_layanan', this.data_loading[0].jenis_layanan);
    body.set('step_android', '1');
    body.set('ttd_custody', this.util.signatureImgCustody);
    body.set('ttd_pic', this.util.signatureImgPIC);

    if(this.data_loading[0].jenis_layanan=="CTC Delivery") {
      const convertedDenomKertas = this.util.denom_kertas_ctc.reduce((acc, curr) => {
        if(curr.value=="0") {
          acc[curr.id] = "";
        } else {
          acc[curr.id] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const convertedDenomLogam = this.util.denom_logam_ctc.reduce((acc, curr) => {
        if(curr.value=="0") {
          acc[curr.id] = "";
        } else {
          acc[curr.id] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);
      
      body.set('denom_kertas', JSON.stringify(convertedDenomKertas));
      body.set('denom_logam', JSON.stringify(convertedDenomLogam)); 
    }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', '*/*'); 

    let server = this.util.ip_server+"/public/master_plan/"+this.id;

    this.http.put(server, body.toString(), {headers}).subscribe((data: any) => {
      // console.log(data.result);
      if(data.result=="success") {
        db.tableRun.update(that.id, {status_complete: true}).then(function (updated) {
          if (updated)
            that.util.navigateToPage('tabs/explore');
          else
            console.log ("Nothing was updated - there was no friend with primary key: 2");
        });
      }
    }, error => {
      console.log(error);
    });
  }
}
