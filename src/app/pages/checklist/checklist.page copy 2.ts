import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { SignaturePage } from '../signature/signature.page';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import axios from 'axios';
import { LoadingController } from '@ionic/angular';
import { DocumentScanner } from 'capacitor-document-scanner';
import { Capacitor } from '@capacitor/core';
import type { TextFieldTypes } from '@ionic/core';
import { FormModalPage } from '../form-modal/form-modal.page';


import { db } from '../../db/db';
import { liveQuery } from 'dexie';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
  data_loading: any = [];
  is_valid: boolean = false;
  is_valid_sign: boolean = false;
  id: any = '';
  jenis_layanan: any = '';
  checked: boolean = false;
  total: any = 0;
  total_ctc: any = 0;

  debitAcctNo: any = '';
  benAcctNo: any = '';
  benName: any = '';
  amount: any = '';

  constructor(
    public util: UtilService,
    private alertController: AlertController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    public platform: Platform,
    private http: HttpClient,
    private loadingController: LoadingController
  ) { 
    this.route.queryParams.subscribe((data: any) => {
      this.id = data.id;
    });

    this.util.signatureImgCustody = "";
    this.util.signatureImgPIC = "";
    this.util.bag_number = [];
    this.util.seal_number = [];
  }

  listDataLoading$ = liveQuery(() => this.loadDataLoading());
  
  async loadDataLoading() {
    var collection = db.tableRun.filter((data) => {
      return (data.status_loading==true && data.id==this.id);
    });
    var datax = await collection.toArray();
    const arr1: any = datax[0].denom_kertas;
    const arr2: any = datax[0].denom_logam;

    // for(let item of arr) {
    //   console.log(item);
    // }

    Object.entries(arr1).forEach(([key, value]) => {
      this.util.denom_kertas.map(i => { 
        if(i.id==key) {
          return { item: i.item, value: i.value = (value=="" ? "0" : value), status: i.status = '' }
        } else {
          return { item: i.item, value: i.value = (i.value=="" ? "0" : i.value), status: i.status = '' }
        }
      });
    });

    Object.entries(arr2).forEach(([key, value]) => {
      this.util.denom_logam.map(i => { 
        if(i.id==key) {
          return { item: i.item, value: i.value = (value=="" ? "0" : value), status: i.status = '' }
        } else {
          return { item: i.item, value: i.value = (i.value=="" ? "0" : i.value), status: i.status = '' }
        }
      });
    });
    // console.log(arr2);
    // console.log(this.util.denom_logam);

    // this.util.denom_kertas.map(i => {
    // arr.map((i) => {
    //   console.log(i)
    // });


    // this.util.denom_kertas
    this.data_loading = datax;
    this.jenis_layanan = datax[0].jenis_layanan;
    this.onCheckQRValid()
    this.onCheckSignValid()
    return await datax;
  }

  ngOnInit() {
  }

  async onScanBag() {
    // console.log(this.platform.platforms());

    // console.log(this.data_loading[0].bag_number);
    if(this.platform.is('mobileweb')) {
      let age = prompt('Berapakah umut anda?', 'BAG-001');
      if(this.data_loading[0].bag_number.indexOf(age) > -1) {
        if(this.util.bag_number.indexOf(age) > -1) {
          alert("QR-CODE Already Scanned") 
        } else {
          this.util.bag_number.push(age)
        }
      } else {
        alert("Invalid QR-CODE")
      }
    } else {
      console.log("ANDROID")
    }

    this.onCheckQRValid();
  }

  async onScanSeal() {
    // console.log(this.platform.platforms());
    
    console.log(this.data_loading[0].seal_number);
    if(this.platform.is('mobileweb')) {
      let age = prompt('Berapakah umut anda?', 'SEAL-001');
      if(this.data_loading[0].seal_number.indexOf(age) > -1) {
        if(this.util.seal_number.indexOf(age) > -1) {
          alert("QR-CODE Already Scanned") 
        } else {
          this.util.seal_number.push(age)
        }
      } else {
        alert("Invalid QR-CODE")
      }
    } else {
      console.log("ANDROID")
    }

    this.onCheckQRValid();
  }

  onCheckQRValid() {
    if(this.data_loading[0].bag_number.length==this.util.bag_number.length) {
      this.is_valid = true
    } else {
      this.is_valid = false
    }
    
    if(this.data_loading[0].seal_number.length==this.util.seal_number.length) {
      this.is_valid = true
    } else {
      this.is_valid = false
    }
  }

  onCheckSignValid() {
    if(this.util.signatureImgPIC!=="") {
      this.is_valid_sign = true
    } else {
      this.is_valid_sign = false
    }
  }

  testCheck($event: any) {
    // console.log($event.target.checked);
    // console.log($event);
    this.checked = $event.target.checked;

    this.util.denom_kertas.map(i => { return { item: i.item, value: i.value, status: i.status = '' } });
    this.util.denom_logam.map(i => { return { item: i.item, value: i.value, status: i.status = '' } });
    this.total = 0;
    // this.util.denom_logam = this.util.denom_kertas.map(i => i.status = '');
    // console.log(this.checked);
  }


  inputOnCHange($event: any, i: any, type: any = 'kertas') {
    // console.log($event.target.checked);
    // console.log($event);
    // this.checked = $event.target.checked;

    // console.log(i);
    // console.log($event.target.value);

    if (type == "kertas") {
      this.util.denom_kertas[i].value = $event.target.value == '' ? 0 : $event.target.value;
    } else if (type == "logam") {
      this.util.denom_logam[i].value = $event.target.value == '' ? 0 : $event.target.value;
    }
  }

  inputOnCHangeCTC($event: any, i: any, type: any = 'kertas') {
    // console.log($event.target.checked);
    // console.log($event);
    // this.checked = $event.target.checked;

    // console.log(i);
    // console.log($event.target.value);

    if (type == "kertas") {
      this.util.denom_kertas_ctc[i].value = $event.target.value == '' ? 0 : $event.target.value;
    } else if (type == "logam") {
      this.util.denom_logam_ctc[i].value = $event.target.value == '' ? 0 : $event.target.value;
    }
  }

  checkboxOnCHange($event: any, i: any, type: any = 'kertas') {
    // console.log($event.target.checked);
    // console.log($event);
    // this.checked = $event.target.checked;

    // console.log(i);
    console.log($event.target.checked);

    if (type == "kertas") {
      this.util.denom_kertas[i].status = $event.target.checked == true ? "✓ loaded" : "";
      if (this.util.denom_kertas[i].item.includes('K')) {
        // this.total = this.util.denom_kertas.reduce((n, { value, item }) => n + parseInt(value) * parseInt(item.split("K")[0]), 0);
        const new_total = (parseInt(this.util.denom_kertas[i].value) * parseInt(this.util.denom_kertas[i].item.split("K")[0])) * 1000;
        if ($event.target.checked) {
          this.total = this.total + new_total;
        } else {
          this.total = this.total - new_total;
        }
      } else {
        const new_total = parseInt(this.util.denom_kertas[i].value) * parseInt(this.util.denom_kertas[i].item)
        if ($event.target.checked) {
          this.total = this.total + new_total;
        } else {
          this.total = this.total - new_total;
        }
      }
    } else if (type == "logam") {
      this.util.denom_logam[i].status = $event.target.checked == true ? "✓ loaded" : "";
      if (this.util.denom_logam[i].item.includes('K')) {
        // this.total = this.util.denom_kertas.reduce((n, { value, item }) => n + parseInt(value) * parseInt(item.split("K")[0]), 0);
        const new_total = (parseInt(this.util.denom_logam[i].value) * parseInt(this.util.denom_logam[i].item.split("K")[0])) * 1000;
        if ($event.target.checked) {
          this.total = this.total + new_total;
        } else {
          this.total = this.total - new_total;
        }
      } else {
        const new_total = parseInt(this.util.denom_logam[i].value) * parseInt(this.util.denom_logam[i].item)
        if ($event.target.checked) {
          this.total = this.total + new_total;
        } else {
          this.total = this.total - new_total;
        }
      }
    }
    console.log(this.total);
  }

  checkboxOnCHangeCTC($event: any, i: any, type: any = 'kertas') {
    // console.log($event.target.checked);
    // console.log($event);
    // this.checked = $event.target.checked;

    // console.log(i);
    console.log($event.target.checked);

    if (type == "kertas") {
      this.util.denom_kertas_ctc[i].status = $event.target.checked == true ? "✓ loaded" : "";
      if (this.util.denom_kertas_ctc[i].item.includes('K')) {
        // this.total = this.util.denom_kertas_ctc.reduce((n, { value, item }) => n + parseInt(value) * parseInt(item.split("K")[0]), 0);
        const new_total = (parseInt(this.util.denom_kertas_ctc[i].value) * parseInt(this.util.denom_kertas_ctc[i].item.split("K")[0])) * 1000;
        if ($event.target.checked) {
          this.total_ctc = this.total_ctc + new_total;
        } else {
          this.total_ctc = this.total_ctc - new_total;
        }
      } else {
        const new_total = parseInt(this.util.denom_kertas_ctc[i].value) * parseInt(this.util.denom_kertas_ctc[i].item)
        if ($event.target.checked) {
          this.total_ctc = this.total_ctc + new_total;
        } else {
          this.total_ctc = this.total_ctc - new_total;
        }
      }
    } else if (type == "logam") {
      this.util.denom_logam_ctc[i].status = $event.target.checked == true ? "✓ loaded" : "";
      if (this.util.denom_logam_ctc[i].item.includes('K')) {
        // this.total = this.util.denom_kertas.reduce((n, { value, item }) => n + parseInt(value) * parseInt(item.split("K")[0]), 0);
        const new_total = (parseInt(this.util.denom_logam_ctc[i].value) * parseInt(this.util.denom_logam_ctc[i].item.split("K")[0])) * 1000;
        if ($event.target.checked) {
          this.total_ctc = this.total_ctc + new_total;
        } else {
          this.total_ctc = this.total_ctc - new_total;
        }
      } else {
        const new_total = parseInt(this.util.denom_logam_ctc[i].value) * parseInt(this.util.denom_logam_ctc[i].item)
        if ($event.target.checked) {
          this.total_ctc = this.total_ctc + new_total;
        } else {
          this.total_ctc = this.total_ctc - new_total;
        }
      }
    }
    console.log(this.total_ctc);
  }

  onBack() {
    this.util.onBack();
  }

  async onDownload() {
    const alert = await this.alertController.create({
      header: 'Downloaded!',
      message: 'Your E-Receipt is Downloaded',
      mode: "ios",
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
            this.util.navigateRoot('/tabs');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.util.navigateRoot('/tabs');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentModalCustody() {
    const modal = await this.modalController.create({
      component: SignaturePage,
      cssClass: 'bookmark-modal',
      componentProps: { prop: 'custody' }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.data == 'ok' && data.role == 'ok') {
        // this.util.navigateToPage('cancel-booking');
        this.onCheckSignValid();
      }
    });
    await modal.present();
  }

  async presentModalPIC() {
    const modal = await this.modalController.create({
      component: SignaturePage,
      cssClass: 'bookmark-modal',
      componentProps: { prop: 'pic' }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.data == 'ok' && data.role == 'ok') {
        // this.util.navigateToPage('cancel-booking');
        this.onCheckSignValid();
      }
    });
    await modal.present();
  }

  async transferRekening(benAcctNo : any, benName : any) {
    // debitAcctNo: any = '';
    // benAcctNo: any = '';
    // benName: any = '';
    // amount: any = '';

    if(benName=='') {
      alert("Rekening tujuan invalid, tidak dapat melakukan transfer")
    } else {
      console.log(this.data_loading[0].rekening_debit);
      console.log(this.data_loading[0].rekening_client);
      const rekening_debit = String(this.data_loading[0].rekening_debit);

      const loading = await this.loadingController.create({
        message: 'Mentransfer Rekening Tujuan, Please wait...',
        spinner: 'crescent' // Optional: choose any spinner type that fits your design
      });
      await loading.present();


      let server = "https://cit-h2h.bijakapp.co.id/cimb_gateway/dev/create_transfer.php";
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        responseType: 'text' as const
      };

      if(benName==null) {
        benName = "-";
      } 

      const body = new URLSearchParams();
      body.set('action', 'submit');
      body.set('service_code', 'ACCOUNT_TRANSFER_CASHIN');
      body.set('debitAcctNo', rekening_debit);
      body.set('benAcctNo', benAcctNo);
      body.set('benName', benName);
      body.set('amount', this.total);
      body.set('view', 'false');

      await this.http.post(server, body.toString(), httpOptions).subscribe(
        async (data: any) => {
          console.log(data);
          // Create a new DOMParser instance to parse the SOAP XML string.
          const parser = new DOMParser();
          const soapDoc = parser.parseFromString(data, "text/xml");

          // Locate the <ns2:txnData> element in the SOAP document.
          const txnDataElements = soapDoc.getElementsByTagName("ns2:txnData");
          if (txnDataElements.length === 0) {
            console.error("No <ns2:txnData> element found in the SOAP response.");
          } else {
            const txnDataElement = txnDataElements[0];

            // Get the inner text which contains escaped XML. The browser automatically decodes HTML entities.
            const statusCodeElement = soapDoc.getElementsByTagName("ns2:statusCode")[0];
            const statusMsgElement = soapDoc.getElementsByTagName("ns2:statusMsg")[0];
            const innerXml: string = txnDataElement.textContent?.trim() ?? "";
            console.log("Extracted inner XML:", innerXml);

            // Reparse the inner XML into its own Document.
            const innerDoc = parser.parseFromString(innerXml, "text/xml");

            // Extract specific values from the inner XML.
            const transferIdElement = innerDoc.getElementsByTagName("transferId")[0];
            const txnDateElement = innerDoc.getElementsByTagName("txnDate")[0];
            const debitAcctNoElement = innerDoc.getElementsByTagName("debitAcctNo")[0];

            // Use optional chaining to safeguard against missing elements.
            const statusCode = statusCodeElement ? statusCodeElement.textContent : null;
            const statusMsg = statusMsgElement ? statusMsgElement.textContent : null;
            const transferId = transferIdElement ? transferIdElement.textContent : null;
            const txnDate = txnDateElement ? txnDateElement.textContent : null;
            const debitAcctNo = debitAcctNoElement ? debitAcctNoElement.textContent : null;

            // Log the extracted values.
            console.log("Transfer ID:", transferId);
            console.log("Transaction Date:", txnDate);
            console.log("Debit Account No:", debitAcctNo);

alert(`
  Transaction Status:
    Status Code: ${statusCode}
    Status Msg: ${statusMsg}
    Transfer ID: ${transferId}
    Debit Account: ${debitAcctNo}
`);

            this.onJobCompleteRetail(statusCode, this.total, transferId, txnDate);
          }

          await loading.dismiss();
        }, 
        async (error) => {
          console.log(error); 
          await loading.dismiss();
        }
      );
    }
  }

  async inquiryRekening() {
    const that = this;
    // console.log(this.data_loading[0].rekening_debit);
    // console.log(this.data_loading[0].rekening_client);
    const rekening = String(this.data_loading[0].rekening_client);
    // const rekening = String(1234567890);

    const loading = await this.loadingController.create({
      message: 'Mengecek Rekening Tujuan, Please wait...',
      spinner: 'crescent' // Optional: choose any spinner type that fits your design
    });
    await loading.present();


    let server = "https://cit-h2h.bijakapp.co.id/cimb_gateway/dev/create_inquiry.php";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      responseType: 'text' as const
    };

    const body = new URLSearchParams();
    body.set('action', 'submit');
    body.set('service_code', 'ACCOUNT_NAME_INQUIRY');
    body.set('accountNo', rekening);
    body.set('view', 'false');

    await this.http.post(server, body.toString(), httpOptions).subscribe(
      async (data: any) => {
        console.log(data);
        // Parse the SOAP XML response
        const parser = new DOMParser();
        const soapDoc = parser.parseFromString(data, "text/xml");

        // Extract the txnData element (adjust the method if namespace issues occur)
        const statusCodeElement = soapDoc.getElementsByTagName("ns2:statusCode")[0];
        const txnDataElement = soapDoc.getElementsByTagName("ns2:txnData")[0];
        const escapedXmlString: string = txnDataElement.textContent?.trim() ?? "";

        // Re-parse the inner XML string
        const innerParser = new DOMParser();
        const innerDoc = innerParser.parseFromString(escapedXmlString, "text/xml");

        // Get account details
        const accountNoElement = innerDoc.getElementsByTagName("accountNo")[0];
        const accountNameElement = innerDoc.getElementsByTagName("accountName")[0];

        const statusCode = statusCodeElement ? statusCodeElement.textContent : null;
        const accountNo = accountNoElement ? accountNoElement.textContent : null;
        const accountName = accountNameElement ? accountNameElement.textContent : null;

        console.log("Status Code:", statusCode); 
        console.log("Account No:", accountNo);
        console.log("Account Name:", accountName);

        if(statusCode=="00") {
          console.log("ketemu");
          that.benAcctNo = accountNo;
          that.benName = accountName;
        }

// alert(`
//   Inqury:
//     Status Code: ${statusCode}
//     Account No: ${accountNo}
//     Account Name:: ${accountName}
// `);

        await this.transferRekening(accountNo, accountName);

        await loading.dismiss();
      }, 
      async (error) => {
        console.log(error); 
        await loading.dismiss();
      }
    );
  }

  async getToken() {
    console.log(this.data_loading);

    let server = "https://cit-h2h.bijakapp.co.id/cimb_gateway/dev/create_token.php";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })

    };

    const body = new URLSearchParams();
    body.set('action', 'submit');

    await this.http.post(server, body.toString(), httpOptions).subscribe((data: any) => {
      console.log(data);
    }, error => {
      console.log(error); 
    });
  }

  async onJobComplete() {
    if(this.data_loading[0].group=="Branch") {
      // alert("BRANCH");
      // alert(this.total);
      if(this.data_loading[0].jenis_layanan=="Pickup") {
        if(this.total!==0) {
          this.onJobCompleteBranch();
        } else {
          alert("Invalid, value tidak boleh 0");
        }
      } else if(this.data_loading[0].jenis_layanan=="CTC Delivery") {
        if(this.total_ctc!==0) {
          this.onJobCompleteBranchCTC();
        } else {
          alert("Invalid, value tidak boleh 0");
        }
      } else if(this.data_loading[0].jenis_layanan=="Delivery") {
          this.onJobCompleteBranch();
      }
      
    } else {
      // alert("RETAIL")
      await this.getToken();
      await this.inquiryRekening();
    }

    // alert(JSON.stringify(this.data_loading[0]));
  }

  onJobCompleteBranch() {
    const that = this;

    const body = new URLSearchParams();
    body.set('id_plan', this.data_loading[0].id_plan);
    body.set('jenis_layanan', this.data_loading[0].jenis_layanan);
    body.set('step_android', '1');
    body.set('ttd_custody', this.util.signatureImgCustody);
    body.set('ttd_pic', this.util.signatureImgPIC);

    if(this.data_loading[0].jenis_layanan=="Pickup") {
      const convertedDenomKertas = this.util.denom_kertas.reduce((acc, curr) => {
        if(curr.value=="0") {
          acc[curr.id] = "";
        } else {
          acc[curr.id] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const convertedDenomLogam = this.util.denom_logam.reduce((acc, curr) => {
        if(curr.value=="0") {
          acc[curr.id] = "";
        } else {
          acc[curr.id] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);
      
      body.set('denom_kertas', JSON.stringify(convertedDenomKertas));
      body.set('denom_logam', JSON.stringify(convertedDenomLogam)); 
    }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', '*/*'); 

    let server = this.util.ip_server+"/public/master_plan/"+this.id;

    this.http.put(server, body.toString(), {headers}).subscribe((data: any) => {
      // console.log(data.result);
      if(data.result=="success") {
        db.tableRun.update(that.id, {status_complete: true}).then(function (updated) {
          if (updated)
            that.util.navigateToPage('tabs/explore');
          else
            console.log ("Nothing was updated - there was no friend with primary key: 2");
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onJobCompleteBranchCTC() {
    const that = this;

    const body = new URLSearchParams();
    body.set('id_plan', this.data_loading[0].id_plan);
    body.set('jenis_layanan', this.data_loading[0].jenis_layanan);
    body.set('step_android', '1');
    body.set('ttd_custody', this.util.signatureImgCustody);
    body.set('ttd_pic', this.util.signatureImgPIC);

    if(this.data_loading[0].jenis_layanan=="CTC Delivery") {
      const convertedDenomKertas = this.util.denom_kertas_ctc.reduce((acc, curr) => {
        if(curr.value=="0") {
          acc[curr.id] = "";
        } else {
          acc[curr.id] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const convertedDenomLogam = this.util.denom_logam_ctc.reduce((acc, curr) => {
        if(curr.value=="0") {
          acc[curr.id] = "";
        } else {
          acc[curr.id] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);
      
      body.set('denom_kertas', JSON.stringify(convertedDenomKertas));
      body.set('denom_logam', JSON.stringify(convertedDenomLogam)); 
    }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', '*/*'); 

    let server = this.util.ip_server+"/public/master_plan/"+this.id;

    this.http.put(server, body.toString(), {headers}).subscribe((data: any) => {
      // console.log(data.result);
      if(data.result=="success") {
        db.tableRun.update(that.id, {status_complete: true}).then(function (updated) {
          if (updated)
            that.util.navigateToPage('tabs/explore');
          else
            console.log ("Nothing was updated - there was no friend with primary key: 2");
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onJobCompleteRetail(status_transfer: any, amount: any, transferId: any, txnDate: any) {

    const that = this;

    console.log(this.data_loading);

    const body = new URLSearchParams();
    body.set('id_plan', this.data_loading[0].id_plan);
    body.set('jenis_layanan', this.data_loading[0].jenis_layanan);
    body.set('step_android', '1');
    body.set('ttd_custody', this.util.signatureImgCustody);
    body.set('ttd_pic', this.util.signatureImgPIC);
    body.set('total_transfer', amount);
    body.set('status_transfer', status_transfer);
    body.set('transferId', transferId);
    body.set('txnDate', txnDate);

    if(this.data_loading[0].jenis_layanan=="Pickup") {
      const convertedDenomKertas = this.util.denom_kertas.reduce((acc, curr) => {
        if(curr.value=="0") {
          acc[curr.id] = "";
        } else {
          acc[curr.id] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const convertedDenomLogam = this.util.denom_logam.reduce((acc, curr) => {
        if(curr.value=="0") {
          acc[curr.id] = "";
        } else {
          acc[curr.id] = curr.value;
        }
        return acc;
      }, {} as Record<string, string>);
      
      body.set('denom_kertas', JSON.stringify(convertedDenomKertas));
      body.set('denom_logam', JSON.stringify(convertedDenomLogam)); 
    }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', '*/*'); 

    let server = this.util.ip_server+"/public/master_plan/"+this.id;

    this.http.put(server, body.toString(), {headers}).subscribe((data: any) => {
      console.log(data.result);
      if(data.result=="success") {
        db.tableRun.update(that.id, {status_complete: true, total_transfer: amount, transferId: transferId, txnDate: txnDate, status_transfer: status_transfer}).then(function (updated) {
          if (updated) {
            that.util.signatureImgCustody = '';
            that.util.signatureImgPIC = '';
            that.util.navigateToPage('tabs/explore');
          } else {
            console.log ("Nothing was updated - there was no friend with primary key: 2");
          }
        });
      }
    }, error => {
      console.log(error);
    });
  }

  async captureBocPicture() {
    const { scannedImages = [] } = await DocumentScanner.scanDocument();

    // get back an array with scanned image file paths
    if (scannedImages?.length > 0) {
      // set the img src, so we can view the first scanned image
      // console.log(scannedImages);
      // console.log(Capacitor.convertFileSrc(scannedImages[0]));
      const scannedImage = document.getElementById('scannedImage') as HTMLImageElement
      scannedImage.src = Capacitor.convertFileSrc(scannedImages[0])
      // this.util.bocFisik = Capacitor.convertFileSrc(scannedImages[0])
    }
  }

  async openDenominationPopup(type: 'kertas' | 'logam' = 'kertas') {
    // const modal = await this.modalController.create({
    //   component: MyModalComponent,
    //   cssClass: 'bookmark-modal',
    // });
    // await modal.present();

    const modal = await this.modalController.create({
      component: FormModalPage,
      cssClass: 'bookmark-modal-x',
    });
    modal.onDidDismiss().then((data) => {
      var json = JSON.parse(data.data);

      console.log(json);
      if(json.jenis=='kertas') { 
        this.util.denom_kertas.map(i => {     
          if(i.id==json.denom) {
            i.value = json.value;
            if(json.value=='0') {
              i.status = '';
            } else {  
              i.status = '✓ loaded';
            }
          }
        });

        this.total = this.util.denom_kertas.reduce((sum, item) => {
          console.log(item);

          let denom = 0;
          if (item.item.includes('K')) {
            denom = parseInt(item.item.split('K')[0]) * 1000;
          } else {
            denom = parseInt(item.item);
          }
          return sum + (parseInt(item.value || '0') * denom);
        }, 0);

        
        this.total += this.util.denom_logam.reduce((sum, item) => {
          console.log(item);

          let denom = 0;
          if (item.item.includes('K')) {
            denom = parseInt(item.item.split('K')[0]) * 1000;
          } else {
            denom = parseInt(item.item);
          }
          return sum + (parseInt(item.value || '0') * denom);
        }, 0);
      } else {
        this.util.denom_logam.map(i => {   
          if(i.id==json.denom) {
            i.value = json.value;
            if(json.value=='0') {
              i.status = '';
            } else {  
              i.status = '✓ loaded';
            }
          }
        });

        this.total = this.util.denom_kertas.reduce((sum, item) => {
          console.log(item);

          let denom = 0;
          if (item.item.includes('K')) {
            denom = parseInt(item.item.split('K')[0]) * 1000;
          } else {
            denom = parseInt(item.item);
          }
          return sum + (parseInt(item.value || '0') * denom);
        }, 0);

        
        this.total += this.util.denom_logam.reduce((sum, item) => {
          console.log(item);

          let denom = 0;
          if (item.item.includes('K')) {
            denom = parseInt(item.item.split('K')[0]) * 1000;
          } else {
            denom = parseInt(item.item);
          }
          return sum + (parseInt(item.value || '0') * denom);
        }, 0);
      }

          
      // console.log(data.data);
      // alert(data.data);
    });
    await modal.present();
    
    // Recalculate total for denom_kertas
    

    // // Add denom_logam to total
    // this.total += this.util.denom_logam.reduce((sum, item) => {
    //   let denom = 0;
    //   if (item.item.includes('K')) {
    //   denom = parseInt(item.item.split('K')[0]) * 1000;
    //   } else {
    //   denom = parseInt(item.item);
    //   }
    //   return sum + (parseInt(item.value || '0') * denom);
    // }, 0);


    // // make popup input with select denom and input value
    // // No extra code needed here, the popup is fully defined below
    // const denomAlert = await this.alertController.create({
    // });
    // await denomAlert.present();
  }
}
