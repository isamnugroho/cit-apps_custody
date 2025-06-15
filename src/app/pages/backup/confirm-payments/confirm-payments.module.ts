/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmPaymentsPageRoutingModule } from './confirm-payments-routing.module';

import { ConfirmPaymentsPage } from './confirm-payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmPaymentsPageRoutingModule
  ],
  declarations: [ConfirmPaymentsPage]
})
export class ConfirmPaymentsPageModule { }
