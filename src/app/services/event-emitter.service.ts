import { Injectable, EventEmitter } from '@angular/core';    
import { Subscription } from 'rxjs/internal/Subscription';    

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  // Initialize event emitters without redundant "=" signs
  invokeFirstComponentFunction: EventEmitter<string> = new EventEmitter<string>();
  invokeCustodyComponentFunction: EventEmitter<string> = new EventEmitter<string>();
  invokePICComponentFunction: EventEmitter<string> = new EventEmitter<string>();

  // Subscription variables for managing subscriptions
  subsVar: Subscription;
  subsVarCustody: Subscription;
  subsVarPIC: Subscription;

  constructor() { }

  onFirstComponentButtonClick() {
    this.invokeFirstComponentFunction.emit('firstComponentFunction')
  }

  onCustodyComponentButtonClick() {
    this.invokeCustodyComponentFunction.emit('custodyComponentFunction')
  }

  onPICComponentButtonClick() {
    this.invokePICComponentFunction.emit('picComponentFunction')
  }
}
