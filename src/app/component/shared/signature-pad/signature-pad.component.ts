import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { EventEmitterService } from '../../../services/event-emitter.service';   
import { UtilService } from 'src/app/services/util.service'; 

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
})
export class SignaturePadComponent  implements OnInit {
  signatureNeeded!: boolean;
  signaturePad!: SignaturePad;
  @ViewChild('canvas') canvasEl!: ElementRef;
  signatureImg!: string;
  constructor(
    public util: UtilService,
    private eventEmitterService: EventEmitterService    
  ) { }

  ngOnInit(): void {
    this.eventEmitterService.subsVarCustody = this.eventEmitterService.invokeCustodyComponentFunction.subscribe(
      (name: string) => {
        // This callback will be invoked when the event emits
        // alert("saveSignatureCustody: " + name);
        this.saveSignatureCustody();  
      }
    );
    this.eventEmitterService.subsVarPIC = this.eventEmitterService.invokePICComponentFunction.subscribe(
      (name: string) => {
        // This callback will be invoked when the event emits
        // alert("saveSignaturePIC: " + name);
        this.saveSignaturePIC();   
      }
    );
  
    
    // if (this.eventEmitterService.subsVarCustody==undefined) {    
    //   this.eventEmitterService.subsVarCustody = this.eventEmitterService.    
    //   invokeCustodyComponentFunction.subscribe((name:string) => {    
    //     // this.saveSignatureCustody();    
    //     alert("saveSignatureCustody");
    //   });    
    // } else if (this.eventEmitterService.subsVarPIC==undefined) {    
    //   this.eventEmitterService.subsVarPIC = this.eventEmitterService.    
    //   invokePICComponentFunction.subscribe((name:string) => {    
    //     // this.saveSignaturePIC();    
    //     alert("saveSignaturePIC");
    //   });    
    // }    
  }

  ngOnDestroy(): void {
    if (this.eventEmitterService.subsVarCustody) {
      this.eventEmitterService.subsVarCustody.unsubscribe();
    }
    if (this.eventEmitterService.subsVarPIC) {
      this.eventEmitterService.subsVarPIC.unsubscribe();
    }
  }
  

  firstFunction() {    
    // alert( 'Hello ' + '\nWelcome to C# Corner \nFunction in First Component');    
    this.savePad();
    this.signaturePad.clear();
  }    

  saveSignaturePIC() {    
    console.log("saveSignaturePIC");
    // alert( 'Hello ' + '\nWelcome to C# Corner \nFunction in First Component');    
    this.savePadSignature('pic');
    this.signaturePad.clear();
  }    

  saveSignatureCustody() {    
    console.log("saveSignatureCustody");
    // alert( 'Hello ' + '\nWelcome to C# Corner \nFunction in First Component');    
    this.savePadSignature('custody');
    this.signaturePad.clear();
  }    

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
  }

  startDrawing(event: Event) {
    // works in device not in browser
  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad.clear();
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.signatureNeeded = this.signaturePad.isEmpty();
    console.log(this.signatureNeeded)
    // console.log(this.signatureImg)
    if (!this.signatureNeeded) {
      this.util.signatureImgCustody = this.signatureImg;
      this.signatureNeeded = false;
    } else {
      alert( 'Signature is required'); 
    }
  }

  savePadSignature(str: any) {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.signatureNeeded = this.signaturePad.isEmpty();
    // console.log(this.signatureImg)
    console.log(str);
    if(str=="pic") {
      if (!this.signatureNeeded) { 
        this.util.signatureImgPIC = base64Data;
        this.signatureNeeded = false;
      } else {
        alert( 'Signature is required'); 
      }
      this.signaturePad.clear();
    } else {
      if (!this.signatureNeeded) {
        this.util.signatureImgCustody = base64Data;
        this.signatureNeeded = false;
      } else {
        alert( 'Signature is required'); 
      }
      this.signaturePad.clear();
    }
  }
}
