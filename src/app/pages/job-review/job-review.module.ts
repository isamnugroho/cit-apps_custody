import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobReviewPageRoutingModule } from './job-review-routing.module';

import { JobReviewPage } from './job-review.page';
import { SharedModule } from '../../component/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    JobReviewPageRoutingModule
  ],
  declarations: [JobReviewPage]
})
export class JobReviewPageModule {}
