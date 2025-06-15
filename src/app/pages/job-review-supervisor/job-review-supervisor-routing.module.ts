import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobReviewSupervisorPage } from './job-review-supervisor.page';

const routes: Routes = [
  {
    path: '',
    component: JobReviewSupervisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobReviewSupervisorPageRoutingModule {}
