
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventEmitterService } from '../../services/event-emitter.service';    

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage implements OnInit {
  prop: string;

  constructor(
    private modalController: ModalController,
    private eventEmitterService: EventEmitterService    
  ) { }

  ngOnInit() {
    // alert(this.prop);
  }

  firstComponentFunction(){    
    this.eventEmitterService.onFirstComponentButtonClick();    
    setTimeout(() => {
      this.dismiss('ok');
    }, 100);
  }    

  custodyComponentFunction(){    
    this.eventEmitterService.onCustodyComponentButtonClick();    
    setTimeout(() => {
      this.dismiss('ok');
    }, 100);
  }    

  picComponentFunction() { 
    // alert("picComponentFunction");   
    this.eventEmitterService.onPICComponentButtonClick();    
    setTimeout(() => {
      this.dismiss('ok');
    }, 100);
  }    

  dismiss(type: any) {
    this.modalController.dismiss(type, 'ok');
  }
}
