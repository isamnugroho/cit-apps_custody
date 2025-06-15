import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadingDetailBbcPageRoutingModule } from './loading-detail-bbc-routing.module';

import { LoadingDetailBbcPage } from './loading-detail-bbc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingDetailBbcPageRoutingModule
  ],
  declarations: [LoadingDetailBbcPage]
})
export class LoadingDetailBbcPageModule {}
