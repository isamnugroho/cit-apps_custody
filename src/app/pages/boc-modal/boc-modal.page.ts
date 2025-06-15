/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : CIT Apps This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, Input, OnChanges, ChangeDetectorRef, SimpleChanges  } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-boc-modal',
  templateUrl: './boc-modal.page.html',
  styleUrls: ['./boc-modal.page.scss'],
})
export class BocModalPage implements OnChanges {
  @Input() imageSrc!: string;

  constructor(
    private modalController: ModalController,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnChanges() {
    console.log('Updated Image URL:', this.imageSrc);
    this.cdRef.detectChanges(); // Force Angular to recognize changes
  }

  dismiss(type: any) {
    this.modalController.dismiss(type, 'ok');
  }

}
