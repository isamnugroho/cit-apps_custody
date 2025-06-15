import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobReviewSupervisorPageRoutingModule } from './job-review-supervisor-routing.module';

import { JobReviewSupervisorPage } from './job-review-supervisor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobReviewSupervisorPageRoutingModule
  ],
  declarations: [JobReviewSupervisorPage]
})
export class JobReviewSupervisorPageModule {}
