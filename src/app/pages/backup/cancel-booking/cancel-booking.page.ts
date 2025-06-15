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
import { CancelSuccessModalPage } from '../cancel-success-modal/cancel-success-modal.page';

@Component({
  selector: 'app-cancel-booking',
  templateUrl: './cancel-booking.page.html',
  styleUrls: ['./cancel-booking.page.scss'],
})
export class CancelBookingPage implements OnInit {

  constructor(
    public util: UtilService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
  }


  async onNext() {
    const modal = await this.modalController.create({
      component: CancelSuccessModalPage,
      cssClass: 'success-modal'
    });

    await modal.present();

  }

}
