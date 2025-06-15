import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { Subscription } from 'rxjs';
import { EventEmitterService } from '../../../services/event-emitter.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss']
})
export class SignaturePadComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasEl!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;
  signatureImg!: string;
  signatureNeeded = false;

  // These subscriptions help to avoid memory leaks
  private custodySubscription?: Subscription;
  private picSubscription?: Subscription;

  constructor(
    public util: UtilService,
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {
    // Subscribe to the custody event if not already subscribed
    if (!this.eventEmitterService.subsVarCustody) {
      this.custodySubscription = this.eventEmitterService.invokeCustodyComponentFunction.subscribe((name: string) => {    
        this.saveSignatureCustody();    
      });
      this.eventEmitterService.subsVarCustody = this.custodySubscription;
    }

    // Subscribe to the PIC event if not already subscribed
    if (!this.eventEmitterService.subsVarPIC) {
      this.picSubscription = this.eventEmitterService.invokePICComponentFunction.subscribe((name: string) => {
        this.saveSignaturePIC();
      });
      this.eventEmitterService.subsVarPIC = this.picSubscription;
    }
  }

  ngAfterViewInit(): void {
    if (this.canvasEl) {
      this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.custodySubscription) { 
      this.custodySubscription.unsubscribe();
    }
    if (this.picSubscription) {
      this.picSubscription.unsubscribe();
    }
  }

  // Clears the signature pad
  clearPad(): void {
    this.signaturePad.clear();
  }

  // Save signature and then clear the pad (default action)
  firstFunction(): void {
    this.savePad();
    this.signaturePad.clear();
  }

  // Saves signature for PIC (person in charge)
  saveSignaturePIC(): void {
    console.log("saveSignaturePIC");
    this.savePadSignature('pic');
    this.signaturePad.clear();
  }

  // Saves signature for custody
  saveSignatureCustody(): void {
    console.log("saveSignatureCustody");
    this.savePadSignature('custody');
    this.signaturePad.clear();
  }

  // Generic save function used by firstFunction()
  savePad(): void {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.signatureNeeded = this.signaturePad.isEmpty(); // true if no signature

    console.log('signatureNeeded:', this.signatureNeeded);
    if (!this.signatureNeeded) {
      // Save default as a custody signature, for example
      this.util.signatureImgCustody = this.signatureImg;
    } else {
      alert('Signature is required');
    }
  }

  // Saves the signature based on the type passed
  savePadSignature(type: string): void {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.signatureNeeded = this.signaturePad.isEmpty();

    console.log('Type:', type);
    if (!this.signatureNeeded) {
      if (type === 'pic') {
        this.util.signatureImgPIC = base64Data;
      } else {
        this.util.signatureImgCustody = base64Data;
      }
    } else {
      alert('Signature is required');
    }
  }
}