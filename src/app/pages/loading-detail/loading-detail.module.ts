import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadingDetailPageRoutingModule } from './loading-detail-routing.module';

import { LoadingDetailPage } from './loading-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingDetailPageRoutingModule
  ],
  declarations: [LoadingDetailPage]
})
export class LoadingDetailPageModule {}
