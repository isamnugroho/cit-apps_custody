import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormModalPageRoutingModule } from './form-modal-routing.module';

import { FormModalPage } from './form-modal.page';
import { SharedModule } from '../../component/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    FormModalPageRoutingModule
  ],
  declarations: [FormModalPage]
})
export class FormModalPageModule {}
