import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobReviewPage } from './job-review.page';

const routes: Routes = [
  {
    path: '',
    component: JobReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobReviewPageRoutingModule {}
