import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-countdown-modal',
  templateUrl: './countdown-modal.page.html',
  styleUrls: ['./countdown-modal.page.scss'],
})
export class CountdownModalPage implements OnInit {

  countdown: number = 10; // Set initial countdown value
  intervalId: any;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    this.intervalId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.intervalId);
        // Optionally, close modal or trigger an event here
        this.modalController.dismiss('finish', 'ok');
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  dismiss(type: any) {
    this.modalController.dismiss(type, 'ok');
  }
}
