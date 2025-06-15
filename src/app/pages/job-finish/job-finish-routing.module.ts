import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobFinishPage } from './job-finish.page';

const routes: Routes = [
  {
    path: '',
    component: JobFinishPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobFinishPageRoutingModule {}
