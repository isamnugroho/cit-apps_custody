/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-packages-list',
  templateUrl: './packages-list.page.html',
  styleUrls: ['./packages-list.page.scss'],
})
export class PackagesListPage implements OnInit {

  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
  }

  onPackageInfo(name: any, image: any) {
    const param: NavigationExtras = {
      queryParams: {
        name: name,
        image: image
      }
    };
    this.util.navigateToPage('package-details', param);
  }

  onPayment() {
    this.util.navigateToPage('select-slot');
  }

}
