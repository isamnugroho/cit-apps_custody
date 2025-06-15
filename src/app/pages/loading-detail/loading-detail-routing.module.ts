import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadingDetailPage } from './loading-detail.page';

const routes: Routes = [
  {
    path: '',
    component: LoadingDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadingDetailPageRoutingModule {}
