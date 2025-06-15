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

import { CancelSuccessModalPageRoutingModule } from './cancel-success-modal-routing.module';

import { CancelSuccessModalPage } from './cancel-success-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelSuccessModalPageRoutingModule
  ],
  declarations: [CancelSuccessModalPage]
})
export class CancelSuccessModalPageModule { }
