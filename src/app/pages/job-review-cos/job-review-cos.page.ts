import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { SignaturePage } from '../signature/signature.page';
import { ReviewModalPage } from '../review-modal/review-modal.page';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  FirebaseMessaging,
  GetTokenOptions,
} from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";

import { db } from '../../db/db';
import { liveQuery } from 'dexie';
@Component({
  selector: 'app-job-review-cos',
  templateUrl: './job-review-cos.page.html',
  styleUrls: ['./job-review-cos.page.scss'],
})
export class JobReviewCosPage implements OnInit {
  public token = "";
  data_loading: any = [];
  id: any = '';
  total_kertas: any = 0;
  total_logam: any = 0;
  total: any = 0;
  is_valid_sign: boolean = false;
  user_id: any;
  user_name: any;
  user_level: any;
  nama_jabatan: any;

  mymodal: HTMLIonModalElement | null = null;

  constructor(
    public util: UtilService,
    private alertController: AlertController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { 
    this.user_id = localStorage.getItem('user_id');
    this.user_name = localStorage.getItem('user_name');
    this.user_level = localStorage.getItem('user_level');
    this.nama_jabatan = localStorage.getItem('nama_jabatan');

    this.route.queryParams.subscribe((data: any) => {
      this.id = data.id;
    });

    

    // this.countdownAlert();

    // var that = this;
    // FirebaseMessaging.addListener("notificationReceived", async (event) => {
    //   console.log("notificationReceived: ", { event });
    //   const audio = new Audio('assets/sounds/selesai_review.mp3');
    //   audio.volume = 1.0;
    //   audio.play();
    //   audio.onended = async () => {
    //     await this.onResetDB();
    //     // await this.loadDataLoadingX();
    //     that.mymodal?.dismiss('finish', 'ok');
    //     liveQuery(() => this.loadDataLoadingX());
    //   };
    //   // alert("notificationReceived: " +JSON.stringify(event));
    // });
    // FirebaseMessaging.addListener("notificationActionPerformed", async (event) => {
    //   console.log("notificationActionPerformed: ", { event });
    //   const audio = new Audio('assets/sounds/selesai_review.mp3');
    //   audio.volume = 1.0;
    //   audio.play();
    //   audio.onended = async () => {
    //     await this.onResetDB(); 
    //     // await this.loadDataLoadingX();
    //     that.mymodal?.dismiss('finish', 'ok');
    //     that.util.navigateRoot('/job-review-cos');
    //     liveQuery(() => this.loadDataLoadingX());
    //   };
    //   // alert("notificationActionPerformed: " +JSON.stringify(event));
    // });
    // if (Capacitor.getPlatform() === "web") {
    //   navigator.serviceWorker.addEventListener("message", (event: any) => {
    //     console.log("serviceWorker message: ", { event });
    //     const notification = new Notification(event.data.notification.title, {
    //       body: event.data.notification.body,
    //     });
    //     notification.onclick = (event) => {
    //       console.log("notification clicked: ", { event });
    //     };
    //   });
    // }
  }

  listDataLoadingX$ = liveQuery(() => this.loadDataLoadingX());
  
  async loadDataLoadingX() {
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
      this.util.denom_kertas = this.util.denom_kertas.map(i => {
        if (i.id == key) {
          const newValue = value == "" ? "0" : value;
          const total = (Number(i.id) * Number(newValue)).toLocaleString('id-ID');
          const status = (newValue !== "" && newValue !== "0") ? '✓' : '';
          return { ...i, value: newValue, total, status };
        } else {
          const valueStr = i.value == "" ? "0" : i.value;
          const total = (Number(i.id) * Number(valueStr)).toLocaleString('id-ID');
          const status = (valueStr !== "" && valueStr !== "0") ? '✓' : '';
          return { ...i, value: valueStr, total, status };
        }
      });
    });

    Object.entries(arr2).forEach(([key, value]) => {
      this.util.denom_logam = this.util.denom_logam.map(i => {
      if (i.id == key) {
        const newValue = value == "" ? "0" : value;
        const total = (Number(i.id) * Number(newValue)).toLocaleString('id-ID');
        const status = (newValue !== "" && newValue !== "0") ? '✓' : '';
        return { ...i, value: newValue, total, status };
      } else {
        const valueStr = i.value == "" ? "0" : i.value;
        const total = (Number(i.id) * Number(valueStr)).toLocaleString('id-ID');
        const status = (valueStr !== "" && valueStr !== "0") ? '✓' : '';
        return { ...i, value: valueStr, total, status };
      }
      });
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

    return await datax;
  }

  countdownAlert = async () => {
    this.mymodal = await this.modalController.create({
      component: ReviewModalPage,
      componentProps: {  },
      cssClass: 'countdown-container'
    });
    this.mymodal.onDidDismiss().then((data) => {
      console.log(data)
    });
    return await this.mymodal.present();
  };

  public async requestPermissions(): Promise<void> {
    await FirebaseMessaging.requestPermissions();
  }

  public async getToken(): Promise<void> {
    const options: GetTokenOptions = {
      vapidKey: "BIz-o3u8huTVjnF5UhmLhTawzr4Ydxs6d9qPhdALZV_O5l7CfVkYVI7XH2fcORaUubYElqpOX-sjgMtd7iXWxrg",
    };
    if (Capacitor.getPlatform() === "web") {
      options.serviceWorkerRegistration =
        await navigator.serviceWorker.register("firebase-messaging-sw.js");
    }
    const { token } = await FirebaseMessaging.getToken(options);
    this.token = token;
  }


  ngOnInit() {
    this.onPopulateDB();
    this.user_id = localStorage.getItem('user_id');
    this.user_name = localStorage.getItem('user_name');
    this.user_level = localStorage.getItem('user_level');
    this.nama_jabatan = localStorage.getItem('nama_jabatan');


    this.onResetDB();
    // console.log(this.data_planning);
  }

  async onResetDB() {
    await db.resetDatabase();
    // this.loadDataPlan();

    // db.transaction("rw", db.tablePlan, db.tablePlan, function() {
    //   db.tablePlan.clear();
    //   db.tablePlan.clear();
    // }).then(function() {
    //   console.log("DB UPDATED");
    // });
    this.onPopulateDB();
  }
  
  onPopulateDB() {
    // let server = this.util.ip_server+"/public/master_plan";
    // let server = this.util.ip_server+"/public/master_plan?petugas="+this.user_name;
    let server = this.util.ip_server+"/public/master_plan?petugas="+this.user_name;
    // let server = "http://bima.techmindo.co.id/rest_api/public/master_plan";

    const params = new HttpParams({
      fromObject: {
        user_id: "tes",
      }
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    this.http.get(server, httpOptions).subscribe((data: any) => {
      // const json = JSON.parse(data);
      console.log(data);

      var data_plan: any = [];
      var data_run: any = [];
      for (let key in data) {
        // console.log(key + " = " + data[key].id);

        // alert(data[key].status_start_job);
        data_plan.push({
          id: data[key].id,
          h_min: data[key].h_min,
          run_number: data[key].run_number,
          action_date: data[key].action_date,
          created_by: data[key].created_by,
          created_date: data[key].created_date,
          action_start_job: data[key].action_start_job,
          action_end_job: data[key].action_end_job,
          status_start_job: data[key].status_start_job,
          status_end_job: data[key].status_end_job,
        });

        for (let key2 in data[key].detail_runsheet) {
          // console.log(key2 + " = " + data[key].detail_runsheet[key2].id);
          data_run.push({
            id: data[key].detail_runsheet[key2].id,
            id_plan: data[key].detail_runsheet[key2].id_plan,
            no_boc: data[key].detail_runsheet[key2].no_boc,
            no_boc_fisik: data[key].detail_runsheet[key2].no_boc_fisik,
            jenis_layanan: data[key].detail_runsheet[key2].jenis_layanan,
            jenis_layanan_lapangan: data[key].detail_runsheet[key2].jenis_layanan_lapangan,
            jenis_barang: data[key].detail_runsheet[key2].jenis_barang,
            jenis_transaksi: data[key].detail_runsheet[key2].jenis_transaksi,
            pengirim: data[key].detail_runsheet[key2].pengirim,
            penerima: data[key].detail_runsheet[key2].penerima,
            nama: data[key].detail_runsheet[key2].nama,
            group: data[key].detail_runsheet[key2].group,
            area: data[key].detail_runsheet[key2].area,
            kode: data[key].detail_runsheet[key2].kode,
            nama_pt: data[key].detail_runsheet[key2].nama_pt,
            alamat: data[key].detail_runsheet[key2].alamat,
            latlng: data[key].detail_runsheet[key2].latlng,
            pic: data[key].detail_runsheet[key2].pic,
            pic_baru: "",
            nik: data[key].detail_runsheet[key2].nik,
            nik_baru: "",
            telp: data[key].detail_runsheet[key2].telp,
            total_nominal: data[key].detail_runsheet[key2].total_nominal,
            denom_kertas: data[key].detail_runsheet[key2].denom_kertas,
            denom_logam: data[key].detail_runsheet[key2].denom_logam,
            bag_number: data[key].detail_runsheet[key2].bag_number,
            seal_number: data[key].detail_runsheet[key2].seal_number,
            boc_fisik: data[key].detail_runsheet[key2].boc_fisik,
            rekening_kredit: data[key].detail_runsheet[key2].rekening_kredit,
            rekening_debit: data[key].detail_runsheet[key2].rekening_debit,
            rekening_client: data[key].detail_runsheet[key2].rekening_client,
            status_loading: data[key].detail_runsheet[key2].status_loading,
            status_complete: data[key].detail_runsheet[key2].status_complete,
            total_transfer: data[key].detail_runsheet[key2].total_transfer,
            status_transfer: data[key].detail_runsheet[key2].status_transfer,
            transferId: data[key].detail_runsheet[key2].transferId,
            txnDate: data[key].detail_runsheet[key2].txnDate,
          });
        }
      }

      console.log(data_run);

      db.transaction("rw", db.tablePlan, function() {
        db.tablePlan.bulkAdd(data_plan).catch(function(err) {
          // console.log(err);
        });
      }).then(function() {
        console.log("DB UPDATED");
      });

      db.transaction("rw", db.tableRun, function() {
        db.tableRun.bulkAdd(data_run).catch(function(err) {
          // console.log(err);
        });
      }).then(function() {
        console.log("DB UPDATED");
      });

      
    }, error => {
      console.log(error);
    });
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
            const param: NavigationExtras = {
              queryParams: {
                id: this.id
              }
            };
            this.util.navigateToPage('job-finish', param);
          }
        }
      ]
    });

    alert.then(alertEl => alertEl.present());
  }
}
