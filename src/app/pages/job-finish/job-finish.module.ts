import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobFinishPageRoutingModule } from './job-finish-routing.module';

import { JobFinishPage } from './job-finish.page';
import { SharedModule } from '../../component/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    JobFinishPageRoutingModule
  ],
  declarations: [JobFinishPage]
})
export class JobFinishPageModule {}
