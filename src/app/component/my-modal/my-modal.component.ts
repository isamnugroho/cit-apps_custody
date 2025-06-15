import { Component } from '@angular/core';
import { IonItem, IonList, IonSelect, IonSelectOption, IonText, IonLabel, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-my-modal',
  templateUrl: './my-modal.component.html',
  styleUrls: ['./my-modal.component.scss'],
  standalone: true,
  imports: [IonItem, IonList, IonSelect, IonSelectOption, IonText, IonLabel, IonInput]
})
export class MyModalComponent {
}
