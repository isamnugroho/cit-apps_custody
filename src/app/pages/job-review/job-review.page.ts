import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { SignaturePage } from '../signature/signature.page';

import { db } from '../../db/db';
import { liveQuery } from 'dexie';


@Component({
  selector: 'app-job-review',
  templateUrl: './job-review.page.html',
  styleUrls: ['./job-review.page.scss'],
})
export class JobReviewPage implements OnInit {
  data_loading: any = [];
  id: any = '';
  total_kertas: any = 0;
  total_logam: any = 0;
  total: any = 0;
  is_valid_sign: boolean = false;

  constructor(
    public util: UtilService,
    private alertController: AlertController,
    private modalController: ModalController,
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
