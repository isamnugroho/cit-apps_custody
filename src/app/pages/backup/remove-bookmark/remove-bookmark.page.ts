/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-remove-bookmark',
  templateUrl: './remove-bookmark.page.html',
  styleUrls: ['./remove-bookmark.page.scss'],
})
export class RemoveBookmarkPage implements OnInit {
  cover: any = '';
  name: any = '';
  address: any = '';
  rate: any = '';
  distance: any = '';
  constructor(
    public util: UtilService,
    private modalController: ModalController,
    private navParam: NavParams
  ) {
    const id = this.navParam.get('value');
    const info = this.util.salonList[id];
    console.log(info);
    if (info && info.name) {
      this.name = info.name;
      this.cover = info.cover;
      this.address = info.address;
      this.rate = info.rate;
      this.distance = info.distance;
    }
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
