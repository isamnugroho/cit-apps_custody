/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : CIT Apps This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BocModalPageRoutingModule } from './boc-modal-routing.module';

import { BocModalPage } from './boc-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BocModalPageRoutingModule
  ],
  declarations: [BocModalPage]
})
export class BocModalPageModule { }
