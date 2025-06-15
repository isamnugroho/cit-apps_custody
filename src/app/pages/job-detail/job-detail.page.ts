import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

import { db } from '../../db/db';
import { liveQuery } from 'dexie';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss'],
})
export class JobDetailPage implements OnInit {
  data_loading: any = [];
  id: any = '';
  constructor(
    public util: UtilService,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe((data: any) => {
      this.id = data.id;
    });
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
}
