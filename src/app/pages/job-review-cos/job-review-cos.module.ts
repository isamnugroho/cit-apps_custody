import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobReviewCosPageRoutingModule } from './job-review-cos-routing.module';

import { JobReviewCosPage } from './job-review-cos.page';
import { SharedModule } from '../../component/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    JobReviewCosPageRoutingModule
  ],
  declarations: [JobReviewCosPage]
})
export class JobReviewCosPageModule {}
