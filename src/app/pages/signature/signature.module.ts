import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignaturePageRoutingModule } from './signature-routing.module';

import { SignaturePage } from './signature.page';

import { SignaturePadComponent } from '../../component/shared/signature-pad/signature-pad.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignaturePageRoutingModule
  ],
  declarations: [SignaturePage, SignaturePadComponent]
})
export class SignaturePageModule {}
