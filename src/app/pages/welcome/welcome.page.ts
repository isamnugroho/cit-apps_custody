/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { register } from 'swiper/element';
import Swiper from 'swiper';
import { LiveUpdate } from '@capawesome/capacitor-live-update';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';

register();
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @ViewChild("swiper") swiper?: ElementRef<{ swiper: Swiper }>
  activeIndex: any = 0;

  current_bundle_id: any = "";
  constructor(
    public util: UtilService,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkBundle();
  }

  async checkBundle() {
    const curr_bundle = await LiveUpdate.getCurrentBundle();
    this.current_bundle_id = curr_bundle.bundleId;
    const curr_ready = await LiveUpdate.ready();
    const next_bundle = await LiveUpdate.sync();
    if(next_bundle.nextBundleId==null) {
      // this.util.navigateToPage('login');
      this.router.navigate(['/login'], { replaceUrl: true });
    } else {
      this.onCheckUpdate();
    }
  }

  async onCheckUpdate() {
    // this.liveUpdate();
    const result1 = await LiveUpdate.getCurrentBundle();
    const result2 = await LiveUpdate.getBundles();
    const result3 = await LiveUpdate.getVersionCode();
    const result4 = await LiveUpdate.getVersionName();
    const result5 = await LiveUpdate.ready();
    const result = await LiveUpdate.sync();

    console.log(result1);
    console.log(result2);
    console.log(result3);
    console.log(result4);
    console.log(result5);
    console.log(result);
    if(result.nextBundleId) {
      console.log("LiveUpdate.reload()");
      await LiveUpdate.reload();
    }
  }

  async liveUpdate() {
    try {
      console.log("LiveUpdate.ready()");
      await LiveUpdate.ready();
      this.sync();
    } catch(e) {
      console.log(e);
    }
  }

  async sync() {
    try {
      const result = await LiveUpdate.sync();
      if(result.nextBundleId) {
        console.log("LiveUpdate.reload()");
        await LiveUpdate.reload();
      }
    } catch(e) {
      console.log(e);
    }
  }
}
