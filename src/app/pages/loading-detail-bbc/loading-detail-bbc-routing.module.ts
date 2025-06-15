import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadingDetailBbcPage } from './loading-detail-bbc.page';

const routes: Routes = [
  {
    path: '',
    component: LoadingDetailBbcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadingDetailBbcPageRoutingModule {}
