import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobSignaturePageRoutingModule } from './job-signature-routing.module';

import { JobSignaturePage } from './job-signature.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobSignaturePageRoutingModule
  ],
  declarations: [JobSignaturePage]
})
export class JobSignaturePageModule {}
