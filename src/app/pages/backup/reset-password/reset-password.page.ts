/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  mode: any = 'sms';
  currentDiv: any = '1';
  showPassword: boolean = false;
  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  changeToggle() {
    this.showPassword = !this.showPassword;
  }

  changeMode(mode: any) {
    this.mode = mode;
  }

  onBack() {
    this.util.onBack();
  }

  onPin() {
    this.currentDiv = '2';
  }

  onVerify() {
    this.currentDiv = '3';
  }

  onComplete() {
    console.log('complete');
    this.util.showSimpleAlert('Password Reset');
    this.util.onBack();
  }

}
