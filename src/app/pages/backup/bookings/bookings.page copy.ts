/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { CancelModalPage } from '../cancel-modal/cancel-modal.page';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  segment: any = 'upcoming';
  constructor(
    public util: UtilService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  segmentChanged() {
    console.log(this.segment);
  }

  onReceipt() {
    this.util.navigateToPage('e-receipt');
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CancelModalPage,
      cssClass: 'bookmark-modal'
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.data == 'ok' && data.role == 'ok') {
        this.util.navigateToPage('cancel-booking');
      }
    });
    await modal.present();
  }

}
