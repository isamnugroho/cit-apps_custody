import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountdownModalPage } from './countdown-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CountdownModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountdownModalPageRoutingModule {}
