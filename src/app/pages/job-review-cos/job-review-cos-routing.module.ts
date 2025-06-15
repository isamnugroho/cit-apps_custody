import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobReviewCosPage } from './job-review-cos.page';

const routes: Routes = [
  {
    path: '',
    component: JobReviewCosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobReviewCosPageRoutingModule {}
