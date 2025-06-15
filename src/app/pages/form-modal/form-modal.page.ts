import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from '../../services/util.service'

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.page.html',
  styleUrls: ['./form-modal.page.scss'],
})
export class FormModalPage implements OnInit {
  denom_list: any = [];
  selected_jenis: any = '';
  selected_denom: any = '';
  inputed_lembar: any = '';

  constructor(
    public util: UtilService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  onJenisSelected(jenis: any) {
    // Handle logic when a "jenis" is selected
    // You can add your custom logic here
    console.log('Jenis selected:', jenis.detail.value);

    this.selected_jenis = jenis.detail.value;

    if(jenis.detail.value === 'kertas') {
      // this.util.showToast('Jenis 1 selected');
      this.denom_list = this.util.denom_kertas;
      console.log(this.denom_list);

      return this.denom_list
    } else if(jenis.detail.value === 'logam') {
      // this.util.showToast('Jenis 2 selected');
      this.denom_list = this.util.denom_logam;
      console.log(this.denom_list);

      return this.denom_list;
    }
  }

  onDenomSelected(denom: any) {
    // Handle logic when a "jenis" is selected
    // You can add your custom logic here
    console.log('Denom selected:', denom.detail.value);
    this.selected_denom = denom.detail.value;
  }

  onSave() {
    if (!this.selected_jenis) {
      this.util.showToast('Jenis harus dipilih', 'danger', 'top');
      return;
    }
    if (!this.selected_denom) {
      this.util.showToast('Denom harus dipilih', 'danger', 'top');
      return;
    }
    if (this.inputed_lembar === '' || isNaN(this.inputed_lembar)) {
      this.util.showToast('Jumlah lembar harus diisi dengan angka', 'danger', 'top');
      return;
    }

    const data_post = {
      jenis: this.selected_jenis,
      denom: this.selected_denom,
      value: this.inputed_lembar.replace(/\./g, ''),
    };
    
    this.modalController.dismiss(JSON.stringify(data_post), 'ok');
  }
  
  dismiss(type: any) {
    this.modalController.dismiss(type, 'ok');
  }

  onLembarInput(event: any) {
    // Remove all non-digit characters for the actual value
    let rawValue = event.target.value.replace(/\D/g, '');

    // Add thousand delimiters (.)
    if (rawValue) {
      rawValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Update the model with the unformatted value
    this.inputed_lembar = rawValue;

    // Optionally, you can format for display if using <input type="text">, but not for <input type="number">
    // If you want to display formatted value, use a separate variable and bind it to the input with type="text"

    console.log('Inputed Lembar:', rawValue);
    // Do not return or set formatted value to event.target.value if input type is number
  }
}
