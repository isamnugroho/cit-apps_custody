import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobSignaturePage } from './job-signature.page';

const routes: Routes = [
  {
    path: '',
    component: JobSignaturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobSignaturePageRoutingModule {}
