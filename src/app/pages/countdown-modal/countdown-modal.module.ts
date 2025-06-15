import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountdownModalPageRoutingModule } from './countdown-modal-routing.module';

import { CountdownModalPage } from './countdown-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountdownModalPageRoutingModule
  ],
  declarations: [CountdownModalPage]
})
export class CountdownModalPageModule {}
