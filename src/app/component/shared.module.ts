// shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerbilangFormatPipe } from '../terbilang-format.pipe';

@NgModule({
  declarations: [ TerbilangFormatPipe ],
  exports:    [ TerbilangFormatPipe ],
  imports:    [ CommonModule ]
})
export class SharedModule { }
