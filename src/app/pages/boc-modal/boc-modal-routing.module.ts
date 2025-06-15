/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : CIT Apps This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BocModalPage } from './boc-modal.page';

const routes: Routes = [
  {
    path: '',
    component: BocModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BocModalPageRoutingModule { }
