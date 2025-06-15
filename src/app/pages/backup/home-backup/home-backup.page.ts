/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { NavigationExtras } from '@angular/router';
import { register } from 'swiper/element';

register();
@Component({
  selector: 'app-home',
  templateUrl: './home-backup.page.html',
  styleUrls: ['./home-backup.page.scss'],
})
export class HomePage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 4,
  };
  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  onNotification() {
    this.util.navigateToPage('notifications');
  }

  onBookmarks() {
    this.util.navigateToPage('bookmarks');
  }

  onSalonList(name: any) {
    const param: NavigationExtras = {
      queryParams: {
        name: name
      }
    };
    this.util.navigateToPage('salon-list', param);
  }

  onSalonInfo(index: number) {
    const param: NavigationExtras = {
      queryParams: {
        id: index
      }
    };
    this.util.navigateToPage('salon-info', param);
  }

}
