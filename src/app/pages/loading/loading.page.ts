import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { PdfService } from 'src/app/services/pdf.service';
import { CancelModalPage } from '../backup/cancel-modal/cancel-modal.page';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { Browser } from '@capacitor/browser';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { DocumentScanner } from 'capacitor-document-scanner';
import { Capacitor } from '@capacitor/core';

import { BocModalPage } from '../boc-modal/boc-modal.page';

import { db } from '../../db/db';
import { liveQuery } from 'dexie';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {
  data_loading: any[] = [];
  data_plan: any = [];
  data_done_loading: any[] = [];
  segment: any = 'upcoming';

  user_id: any;
  user_name: any;
  user_level: any;
  nama_jabatan: any;

  boc_fisik = '';
  imageSrc = '';
  
  constructor(
    public util: UtilService,
    private modalController: ModalController,
    private http: HttpClient,
    private pdfService: PdfService,
    private documentViewer: DocumentViewer,
    private fileOpener: FileOpener,
    private loadingController: LoadingController,
    private cdRef: ChangeDetectorRef
  ) { 
    this.loadDataLoading();
    this.loadDataDoneLoading();
    // console.log(this.data_loading);
    // console.log(this.data_done_loading);
  }

  ngOnInit() {
    this.onPopulateDB();
    this.onResetDB();
    this.user_id = localStorage.getItem('user_id');
    this.user_name = localStorage.getItem('user_name');
    this.user_level = localStorage.getItem('user_level');
    this.nama_jabatan = localStorage.getItem('nama_jabatan');

    this.util.getKeys("data_planning").then((res) => {
      const json = JSON.parse(res);
      this.util.data_planning = json;
      this.util.data_runsheet = json['detail_runsheet'];

      // console.log("ngOnInit Loading Page");
    });

    this.status_job$.subscribe({
      next: (data) => console.log('Updated friends list:', data),
      error: (err) => console.error('Error:', err),
    });

  }

  async loadPlanData() {
    this.data_plan = await this.getTablePlan();
    this.data_plan = this.data_plan[0];
  }

  getTablePlan() {
    return db.tablePlan.toArray();
  }

  status_job$ = liveQuery(async () => {
    this.data_plan = await this.getTablePlan();
    this.data_plan = this.data_plan[0];
  });

  // listloadDataPlan$ = liveQuery(() => this.loadDataPlan());
  listDataLoading$ = liveQuery(() => this.loadDataLoading());
  listDataDoneLoading$ = liveQuery(() => this.loadDataDoneLoading());
  listDataComplete$ = liveQuery(() => this.loadDataComplete());

  async loadDataLoading() {
    var collection = db.tableRun.filter((data) => {
      return data.status_loading==false && data.status_complete==false;
    });
    // this.data_loading = await collection.toArray();
    return await collection.toArray();
  }

  async loadDataDoneLoading() {
    var collection = db.tableRun.filter((data) => {
      return data.status_loading==true && data.status_complete==false;
    });
    // this.data_done_loading = await collection.toArray();
    return await collection.toArray();
  }

  async loadDataComplete() {
    var collection = db.tableRun.filter((data) => {
      return data.status_loading==true && data.status_complete==true;
    });
    // this.data_done_loading = await collection.toArray();
    return await collection.toArray();
  }

  segmentChanged() {
    console.log(this.segment);
  }

  // onLoadingDetail(id_plan: any, id: any) {
    
  onLoadingDetail(id_plan: any, id: any, bag_number: any, seal_number: any) {
    // alert(bag_number.length)
    const param: NavigationExtras = {
      queryParams: {
        id_plan: id_plan,
        id: id
      }
    };
    if (!bag_number || bag_number.length === 0) {
      this.util.navigateToPage('loading-detail-bbc', param);
    } else {
      this.util.navigateToPage('loading-detail', param);
    }
  }

  onLoadingDetailBBC(id_plan: any, id: any) {
    const param: NavigationExtras = {
      queryParams: {
        id_plan: id_plan,
        id: id
      }
    };
    this.util.navigateToPage('loading-detail-bbc', param);
  }

  onToDestination(id: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: id
      }
    };
    this.util.navigateToPage('ride', param);
  }

  onToCashin(id: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: id
      }
    };
    this.util.navigateToPage('confirm-payments', param);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CancelModalPage,
      cssClass: 'bookmark-modal'
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.data == 'ok' && data.role == 'ok') {
        this.util.navigateToPage('cancel-booking');
      }
    });
    await modal.present();
  }

  onBack() {
    this.util.onBack();
  }


  // downloadFile() {
  //   var url = "http://africau.edu/images/default/sample.pdf";
  //   this.http.sendRequest(url, { method: "get", responseType: "arraybuffer" }).then(
  //     httpResponse => {
  //       console.log("File dowloaded successfully")
  //       this.downloadedFile = new Blob([httpResponse.data], { type: 'application/pdf' });
  //     }
  //   ).catch(err => {
  //     console.error(err);
  //   })
  // }

  downloadPdf2() {
    const pdfUrl = 'http://192.168.1.3/compare/lastest/bima_apps/pdf/generate'; // Replace with your PDF URL
    this.pdfService.downloadPdf(pdfUrl).subscribe((blob: any) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample.pdf'; // Set the file name
      a.click();
      window.URL.revokeObjectURL(url); // Clean up
    });
  }

  openPDF(filePath: string) {
    this.documentViewer.viewDocument(filePath, 'application/pdf', { title: 'My PDF' });
  }
  
  openFile(filePath: string) {
    this.fileOpener.open(filePath, 'application/pdf')
      .then(() => console.log('File opened successfully'))
      .catch(error => console.error('Error opening file:', error));
  }
  

  downloadPdf(id: any, id_plan: any) {
    console.log(id);
    const pdfUrl = this.util.ip_server_backend+'/pdf/boc2/'+id_plan+'/'+id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    // this.http.get(pdfUrl, {
    //   headers,
    //   responseType: 'blob', 
    // }).subscribe((blob: any)  => {
    //   // const url = window.URL.createObjectURL(blob);
    //   // const a = document.createElement('a');
    //   // a.href = url;
    //   // a.download = 'sample.pdf'; // Set the file name
    //   // a.click();
    //   // window.URL.revokeObjectURL(url); // Clean up
    //   const reader = new FileReader();
    //   reader.onload = async () => {
    //     const base64Data = reader.result?.toString().split(',')[1];
    //     await Filesystem.writeFile({
    //       path: 'example.pdf',
    //       data: base64Data,
    //       directory: FilesystemDirectory.Documents,
    //     });
    //     console.log('PDF downloaded successfully!');
    //   };
    //   reader.readAsDataURL(blob);

    // }, error => {
    //   console.log(error);
    // });

    this.http.get(pdfUrl, { headers, responseType: 'blob' }).subscribe(async (blob) => {
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const base64Data = await this.blobToBase64(blob);
      try {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}_${(currentDate.getMonth() + 1).toString().padStart(2, '0')}_${currentDate.getDate().toString().padStart(2, '0')}_${currentDate.getHours().toString().padStart(2, '0')}_${currentDate.getMinutes().toString().padStart(2, '0')}_${currentDate.getSeconds().toString().padStart(2, '0')}`;

        const newFileName = `boc_${formattedDate}.pdf`;

        // Step 1: Write the PDF file
        await Filesystem.writeFile({
            path: newFileName,
            data: base64Data,
            directory: FilesystemDirectory.Documents
        });

        // Step 2: Retrieve the file URI
        const fileInfo = await Filesystem.getUri({
            path: newFileName,
            directory: FilesystemDirectory.Documents
        });
        const fileUri = fileInfo.uri;
        
        this.openFile(fileUri)
      } catch (error) {
        alert("Download gagal")
      }
    });
  }

  async uploadBOCFisik(id: any, id_plan: any, no_boc: any) {
    // Scan the document
    const { scannedImages = [] } = await DocumentScanner.scanDocument();

    // Check if any images were scanned, otherwise handle error/cancel gracefully
    if (!scannedImages || scannedImages.length === 0) {
      alert('No document was scanned. Please try again.');
      return;
    }

    // If an image was scanned, reduce its resolution before upload
    // Load the image into an HTMLImageElement
    const img = new Image();
    img.src = Capacitor.convertFileSrc(scannedImages[0]);
    await new Promise((resolve) => { img.onload = resolve; });

    // Create a canvas to resize the image
    const canvas = document.createElement('canvas');
    // Set your desired width/height (e.g., 800px wide, keep aspect ratio)
    const MAX_WIDTH = 800;
    const scale = MAX_WIDTH / img.width;
    canvas.width = MAX_WIDTH;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a Blob (JPEG, quality 0.7)
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', 0.7)
    );

    // Create a local URL for the reduced image
    const reducedImageUrl = URL.createObjectURL(blob);

    this.util.boc_fisik = reducedImageUrl;
    const imageUrl = this.util.boc_fisik;
    this.uploadFile(imageUrl, id, id_plan, no_boc);
  }

  async lihatBOCFisik(id: any, id_plan: any, no_boc: any, boc_fisik: any) {
    // alert(this.util.boc_fisik);

    // alert(boc_fisik);

    // if(this.util.boc_fisik!=="") {
      // const imageUrl = this.util.boc_fisik;
      let randomNumber = Math.random();
      let imageUrl = this.util.ip_server+'/public/uploads/'+no_boc+'.jpg?rand='+randomNumber;
      if(boc_fisik!=="") {
        imageUrl = boc_fisik+'?rand='+randomNumber;
      }
      
      this.imageSrc = imageUrl; // Assign new image source
      this.cdRef.detectChanges(); // Ensure Angular detects change

      const modal = await this.modalController.create({
        component: BocModalPage,
        cssClass: 'boc-modal',
        componentProps: { imageSrc: this.imageSrc }
      });
      console.log('Passing image URL:', imageUrl);
      modal.onDidDismiss().then((data) => {
        console.log(data);
        if (data && data.data == 'ok' && data.role == 'ok') {
          // this.util.navigateToPage('cancel-booking');
          this.uploadBOCFisik(id, id_plan, no_boc);
        }
      });
      await modal.present();
    // }
  }

  async uploadFile(imagePath: string, id: any, id_plan: any, no_boc: any) {
    const response = await fetch(imagePath);
    const blob = await response.blob(); // Convert file URL to blob

    const formData = new FormData();
    formData.append('id', id); 
    formData.append('id_plan', id_plan); 
    formData.append('no_boc', no_boc);
    formData.append('url', this.util.ip_server+'/public/uploads/'+no_boc+'.jpg');
    formData.append('file', blob, 'uploaded-image.jpg'); 

    // fetch(this.util.ip_server+'/public/boc/upload', {
    const loading = await this.loadingController.create({
      message: 'Uploading file, please wait...',
      spinner: 'crescent'
    });
    await loading.present();

    fetch(this.util.ip_server+'/public/boc/upload', {
      method: 'POST',
      body: formData,
    })
    .then(res => res.json())
    .then(async (data) => {
      console.log("Upload successful", data)
      await db.tableRun.update(id, {boc_fisik: data.url}).then(function (updated) {
      if (updated)
        console.log ("updated");
      else
        console.log ("Nothing was updated - there was no friend with primary key: 2");
      });
      await loading.dismiss();
    })
    .catch(async error => {
      console.error("Upload error:", error);
      await loading.dismiss();
    });
  }

  
  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] ?? '');
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  formatDate(dateInput:any) {
    // Ensure the date input is treated as a string
    const dateStr = String(dateInput);
  
    // Validate that the string is in the correct format (8 characters).
    if (dateStr.length !== 8) {
      throw new Error("Date string must be in YYYYMMDD format.");
    }
  
    // Extract the year, month, and day parts
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6);
  
    // Concatenate with hyphens in between
    return `${year}-${month}-${day}`;
  }
  
  
  async statusRekening(transferId:any, txnDate:any, rekening_debit:any) {
    const that = this;

    console.log(this.data_loading);
    // console.log(this.data_loading[0].rekening_debit);
    // console.log(this.data_loading[0].rekening_client);
    // const rekening = String(this.data_loading[0].rekening_client);
    const rekening = String(rekening_debit);

    const loading = await this.loadingController.create({
      message: 'Mengecek Status Transaksi, Please wait...',
      spinner: 'crescent' // Optional: choose any spinner type that fits your design
    });
    await loading.present();


    let server = "https://cit-h2h.bijakapp.co.id/cimb_gateway/dev/create_status.php";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      responseType: 'text' as const
    };

    var trxDate = this.formatDate(txnDate);

    const body = new URLSearchParams();
    body.set('action', 'submit');
    body.set('service_code', 'TRANSACTION_STATUS');
    body.set('reffNo', transferId);
    body.set('acctNo', rekening_debit);
    body.set('trxDate', trxDate);
    body.set('view', 'false');

    await this.http.post(server, body.toString(), httpOptions).subscribe(
      async (data: any) => {
        console.log(data);
        // Parse the SOAP XML response
        
        // Create a new DOMParser instance
        const parser = new DOMParser();

        // Parse the SOAP XML string into a Document
        const soapDoc = parser.parseFromString(data, "text/xml");

        // Extract values from the SOAP response
        const bankReffNoElement = soapDoc.getElementsByTagName("ns2:bankReffNo")[0];
        const statusCodeElement   = soapDoc.getElementsByTagName("ns2:statusCode")[0];
        const statusMsgElement    = soapDoc.getElementsByTagName("ns2:statusMsg")[0];
        const txnResponseElement  = soapDoc.getElementsByTagName("ns2:txnResponseDateTime")[0];
        const txnDataElement      = soapDoc.getElementsByTagName("ns2:txnData")[0];

        const bankReffNo      = bankReffNoElement?.textContent?.trim() ?? null;
        const statusCode      = statusCodeElement?.textContent?.trim() ?? null;
        const statusMsg       = statusMsgElement?.textContent?.trim() ?? null;
        const txnResponseTime = txnResponseElement?.textContent?.trim() ?? null;

        // Log the main values
        console.log("Bank Reff No:", bankReffNo);
        console.log("Status Code:", statusCode);
        console.log("Status Msg:", statusMsg);
        console.log("Txn Response DateTime:", txnResponseTime);

        // Extract and decode the inner XML within <ns2:txnData>
        // The textContent property decodes the HTML-encoded XML (e.g. &lt; becomes <)
        if (txnDataElement) {
          const innerXml = txnDataElement.textContent?.trim() ?? "";
          console.log("Extracted inner XML:", innerXml);
          
          // Re-parse the inner XML to get a new document
          const innerDoc = parser.parseFromString(innerXml, "text/xml");

          // Extract details from the inner XML (transactionStatus)
          const reffNoElement    = innerDoc.getElementsByTagName("reffNo")[0];
          const acctNoElement    = innerDoc.getElementsByTagName("acctNo")[0];
          const trxDateElement   = innerDoc.getElementsByTagName("trxDate")[0];
          const channelElement   = innerDoc.getElementsByTagName("ChannelCode")[0];

          const reffNo   = reffNoElement?.textContent?.trim() ?? null;
          const acctNo   = acctNoElement?.textContent?.trim() ?? null;
          const trxDate   = trxDateElement?.textContent?.trim() ?? null;
          const channel   = channelElement?.textContent?.trim() ?? null; 

          console.log("Transaction Status:");
          console.log("  Reff No:", reffNo);
          console.log("  Account No:", acctNo);
          console.log("  Transaction Date:", trxDate);
          console.log("  Channel Code:", channel);

          alert(`
Transaction Status:
  Bank Reff No: ${bankReffNo}
  Status Code: ${statusCode}
  Status Msg: ${statusMsg}
  DateTime: ${txnResponseTime}
  Reff No: ${reffNo}
  Account No: ${acctNo}
  Transaction Date: ${trxDate}
  Channel Code: ${channel}
            `);
        } else {
          console.error("No <ns2:txnData> element found.");
        }


        await loading.dismiss();
      }, 
      async (error) => {
        console.log(error); 
        await loading.dismiss();
      }
    );
  }
  
  async transferRekening(id:any, rekening_debit: any, benAcctNo : any, benName : any, total_transfer:any) {
    // debitAcctNo: any = '';
    // benAcctNo: any = '';
    // benName: any = '';
    // amount: any = '';

    if(benName=='') {
      alert("Rekening tujuan invalid, tidak dapat melakukan transfer")
    } else {

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

      // alert(total_transfer);

      const body = new URLSearchParams();
      body.set('action', 'submit');
      body.set('service_code', 'ACCOUNT_TRANSFER_CASHIN');
      body.set('debitAcctNo', rekening_debit);
      body.set('benAcctNo', benAcctNo);
      body.set('benName', benName);
      body.set('amount', total_transfer);
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

            db.tableRun.update(id, {status_complete: true, transferId: String(transferId), status_transfer: String(statusCode)}).then(function (updated) {
              if (updated) {
              } else {
                console.log ("Nothing was updated - there was no friend with primary key: 2");
              }
            });
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

  async inquiryRekening(id:any, rekening_debit: any, rekening_client: any, total_transfer: any) {
    const that = this;
    // console.log(this.data_loading[0].rekening_debit);
    // console.log(this.data_loading[0].rekening_client);
    const rekening = String(rekening_client);
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
        }

alert(`
  Inqury:
    Status Code: ${statusCode}
    Account No: ${accountNo}
    Account Name: ${accountName}
`);

        await this.transferRekening(id, rekening_debit, accountNo, accountName, total_transfer);

        await loading.dismiss();
      }, 
      async (error) => {
        console.log(error); 
        await loading.dismiss();
      }
    );
  }

  async getToken(id:any, rekening_debit: any, rekening_client: any, total_transfer: any) {
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

      this.inquiryRekening(id, rekening_debit, rekening_client, total_transfer);
    }, error => {
      console.log(error); 
    });
  }

  

  async inquiryRekeningX(id:any, rekening_debit: any, rekening_client: any, total_transfer: any) {
    const that = this;
    // console.log(this.data_loading[0].rekening_debit);
    // console.log(this.data_loading[0].rekening_client);
    const rekening = String(rekening_client);
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
        }

alert(`
  Inqury:
    Status Code: ${statusCode}
    Account No: ${accountNo}
    Account Name:: ${accountName}
`);

        await loading.dismiss();
      }, 
      async (error) => {
        console.log(error); 
        await loading.dismiss();
      }
    );
  }

  OI() {
// var data = `
// <?xml version="1.0" encoding="UTF-8"?>
// <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
//   <soapenv:Body>
//     <HostCustomerResponse xmlns="https://directchannel.cimbniaga.co.id">
//       <ns1:output xmlns:ns1="http://172.27.121.45" xmlns:ns2="java:prismagateway.service.HostCustomer" xsi:type="ns2:Output">
//         <ns2:bankReffNo>250506BI02018254</ns2:bankReffNo>
//         <ns2:statusCode>00</ns2:statusCode>
//         <ns2:statusMsg/>
//         <ns2:txnResponseDateTime>20250506142847</ns2:txnResponseDateTime>
//         <ns2:txnData>
// 				    &lt;transferRequest&gt;&lt;transfer&gt;&lt;transferId&gt;BIMA20250506ATC0029&lt;/transferId&gt;&lt;txnDate&gt;20250506&lt;/txnDate&gt;&lt;debitAcctNo&gt;800188845700&lt;/debitAcctNo&gt;&lt;benAcctNo&gt;800164118500&lt;/benAcctNo&gt;&lt;benName&gt;CIMB NIAGA&lt;/benName&gt;&lt;benBankName&gt;CIMB Niaga&lt;/benBankName&gt;&lt;benBankAddr1&gt;&lt;/benBankAddr1&gt;&lt;benBankAddr2&gt;&lt;/benBankAddr2&gt;&lt;benBankAddr3&gt;&lt;/benBankAddr3&gt;&lt;benBankBranch&gt;&lt;/benBankBranch&gt;&lt;benBankCode&gt;022&lt;/benBankCode&gt;&lt;benBankSWIFT&gt;&lt;/benBankSWIFT&gt;&lt;currCd&gt;IDR&lt;/currCd&gt;&lt;amount&gt;25&lt;/amount&gt;&lt;memo&gt;&lt;/memo&gt;&lt;/transfer&gt;&lt;/transferRequest&gt;
// 				</ns2:txnData>
//       </ns1:output>
//     </HostCustomerResponse>
//   </soapenv:Body>
// </soapenv:Envelope>
// `;
var data = `
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soapenv:Body>
    <HostCustomerResponse xmlns="https://directchannel.cimbniaga.co.id">
      <ns1:output xmlns:ns1="http://172.27.121.45" xmlns:ns2="java:prismagateway.service.HostCustomer" xsi:type="ns2:Output">
        <ns2:bankReffNo/>
        <ns2:statusCode>12</ns2:statusCode>
        <ns2:statusMsg>INVALID TRANSACTION</ns2:statusMsg>
        <ns2:txnResponseDateTime>20250506151229</ns2:txnResponseDateTime>
        <ns2:txnData>
				    &lt;transferRequest&gt;&lt;transfer&gt;&lt;transferId&gt;BIMA20250506ATC0033&lt;/transferId&gt;&lt;txnDate&gt;20250506&lt;/txnDate&gt;&lt;debitAcctNo&gt;800188845700&lt;/debitAcctNo&gt;&lt;benAcctNo&gt;987654321011&lt;/benAcctNo&gt;&lt;benName&gt;-&lt;/benName&gt;&lt;benBankName&gt;CIMB Niaga&lt;/benBankName&gt;&lt;benBankAddr1&gt;&lt;/benBankAddr1&gt;&lt;benBankAddr2&gt;&lt;/benBankAddr2&gt;&lt;benBankAddr3&gt;&lt;/benBankAddr3&gt;&lt;benBankBranch&gt;&lt;/benBankBranch&gt;&lt;benBankCode&gt;022&lt;/benBankCode&gt;&lt;benBankSWIFT&gt;&lt;/benBankSWIFT&gt;&lt;currCd&gt;IDR&lt;/currCd&gt;&lt;amount&gt;25&lt;/amount&gt;&lt;memo&gt;&lt;/memo&gt;&lt;/transfer&gt;&lt;/transferRequest&gt;
				</ns2:txnData>
      </ns1:output>
    </HostCustomerResponse>
  </soapenv:Body>
</soapenv:Envelope>
`;
    // Parse the XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.trim(), "text/xml"); 

    // Extract main values
    const bankReffNo = xmlDoc.querySelector("ns2\\:bankReffNo, bankReffNo")?.textContent;
    const statusCode = xmlDoc.querySelector("ns2\\:statusCode, statusCode")?.textContent;
    const statusMsg = xmlDoc.querySelector("ns2\\:statusMsg, statusMsg")?.textContent;
    const txnResponseDateTime = xmlDoc.querySelector("ns2\\:txnResponseDateTime, txnResponseDateTime")?.textContent;
    const txnData = xmlDoc.querySelector("ns2\\:txnData, txnData")?.textContent;

    // Decode the transaction data
    const decodedTxnData = new DOMParser().parseFromString(txnData || '', "text/html");

    // console.log(decodedTxnData.querySelector("transferId")?.textContent);
    // Parse transaction details from decoded data
    // const txnParser = new DOMParser();
    // const txnDoc = txnParser.parseFromString(decodedTxnData || '', "text/xml");



    const transferId = decodedTxnData.querySelector("transferId")?.textContent;
    const txnDate = decodedTxnData.querySelector("txnDate")?.textContent;
    const debitAcctNo = decodedTxnData.querySelector("debitAcctNo")?.textContent;
    const benAcctNo = decodedTxnData.querySelector("benAcctNo")?.textContent;
    const benName = decodedTxnData.querySelector("benName")?.textContent;
    const benBankName = decodedTxnData.querySelector("benBankName")?.textContent;
    const benBankCode = decodedTxnData.querySelector("benBankCode")?.textContent;
    const currCd = decodedTxnData.querySelector("currCd")?.textContent;
    const amount = decodedTxnData.querySelector("amount")?.textContent;

    // Output extracted data
    console.log({
      bankReffNo,
      statusCode,
      statusMsg,
      txnResponseDateTime,
      transferId,
      txnDate,
      debitAcctNo,
      benAcctNo,
      benName,
      benBankName,
      benBankCode,
      currCd,
      amount
    });


alert(`
  Transfer Status:
    Bank Ref No: ${bankReffNo}
    Status Code: ${statusCode}
    Status Msg: ${statusMsg || 'No message'}
    Response DateTime: ${txnResponseDateTime}
    Transfer ID: ${transferId}
    Transaction Date: ${txnDate}
    Debit Account: ${debitAcctNo}
    Beneficiary Account: ${benAcctNo}
    Beneficiary Name: ${benName}
    Beneficiary Bank: ${benBankName}
    Bank Code: ${benBankCode}
    Currency: ${currCd}
    Amount: ${amount}
`);
  }

  OOI() {
const xmlString = `
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<soapenv:Body>
<HostCustomerResponse xmlns="https://directchannel.cimbniaga.co.id">
<ns1:output xmlns:ns1="http://172.27.121.45" xmlns:ns2="java:prismagateway.service.HostCustomer" xsi:type="ns2:Output">
<ns2:bankReffNo/>
<ns2:statusCode>999</ns2:statusCode>
<ns2:statusMsg>Trans. Doesn't Have a Response,Please Check Acct. Balance,Call Our Support - MW - 07</ns2:statusMsg>
<ns2:txnResponseDateTime>20250506123431</ns2:txnResponseDateTime>
<ns2:txnData>
&lt;accountNameRequest&gt;&lt;accountNo&gt;-&lt;/accountNo&gt;&lt;/accountNameRequest&gt;
</ns2:txnData>
</ns1:output>
</HostCustomerResponse>
</soapenv:Body>
</soapenv:Envelope>
`;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString.trim(), "text/xml");

    // Extract main values
    const bankReffNo = xmlDoc.querySelector("ns2\\:bankReffNo, bankReffNo")?.textContent || "(empty)";
    const statusCode = xmlDoc.querySelector("ns2\\:statusCode, statusCode")?.textContent;
    const statusMsg = xmlDoc.querySelector("ns2\\:statusMsg, statusMsg")?.textContent || "No message";
    const txnResponseDateTime = xmlDoc.querySelector("ns2\\:txnResponseDateTime, txnResponseDateTime")?.textContent;
    const txnData = xmlDoc.querySelector("ns2\\:txnData, txnData")?.textContent;

    // Decode transaction data and extract account number
    const decodedTxnData = new DOMParser().parseFromString(txnData || '', "text/html").documentElement.textContent;
    const txnParser = new DOMParser();
    const txnDoc = txnParser.parseFromString(decodedTxnData || '', "text/xml");

    const accountNo = txnDoc.querySelector("accountNo")?.textContent || "(empty)";

    // Display extracted data in an alert
alert(`
Transaction Status:
  Bank Ref No: ${bankReffNo}
  Status Code: ${statusCode}
  Status Msg: ${statusMsg}
  Response DateTime: ${txnResponseDateTime}
  Account Number: ${accountNo}
`);
  }

  OOOI() {
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <soapenv:Body>
        <HostCustomerResponse xmlns="https://directchannel.cimbniaga.co.id">
          <ns1:output xmlns:ns1="http://172.27.121.45" xmlns:ns2="java:prismagateway.service.HostCustomer" xsi:type="ns2:Output">
            <ns2:bankReffNo>62509366250785</ns2:bankReffNo>
            <ns2:statusCode>00</ns2:statusCode>
            <ns2:statusMsg>SUCCESS:</ns2:statusMsg>
            <ns2:txnResponseDateTime>20250506143045</ns2:txnResponseDateTime>
            <ns2:txnData>&lt;transactionStatusResponse&gt;
    &lt;transactionStatus&gt;
      &lt;acctNo&gt;800188845700&lt;/acctNo&gt;
      &lt;reffNo&gt;BIMA20250506ATC0029&lt;/reffNo&gt;
      &lt;TrxAmount&gt;25.00&lt;/TrxAmount&gt;
      &lt;trxDate&gt;2025-05-06&lt;/trxDate&gt;
      &lt;debitCreditFlag&gt;D&lt;/debitCreditFlag&gt;
      &lt;ChannelCode&gt;BIZ&lt;/ChannelCode&gt;
      &lt;GLReconciliationNo&gt;250506BI02018254&lt;/GLReconciliationNo&gt;
    &lt;/transactionStatus&gt;
    &lt;/transactionStatusResponse&gt;</ns2:txnData>
          </ns1:output>
        </HostCustomerResponse>
      </soapenv:Body>
    </soapenv:Envelope>`;
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString || '', "text/xml");
    
    const outputData = {
      bankReffNo: xmlDoc.getElementsByTagName("ns2:bankReffNo")[0]?.textContent || '',
      statusCode: xmlDoc.getElementsByTagName("ns2:statusCode")[0]?.textContent || '',
      statusMsg: xmlDoc.getElementsByTagName("ns2:statusMsg")[0]?.textContent || '',
      txnResponseDateTime: xmlDoc.getElementsByTagName("ns2:txnResponseDateTime")[0]?.textContent || '',
      txnData: xmlDoc.getElementsByTagName("ns2:txnData")[0]?.textContent || ''
    };
    
    // Parsing embedded txnData XML
    const embeddedXmlString = outputData.txnData.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    const embeddedXmlDoc = parser.parseFromString(embeddedXmlString || '', "text/xml");
    
    const transactionData = {
      acctNo: embeddedXmlDoc.getElementsByTagName("acctNo")[0]?.textContent || '',
      reffNo: embeddedXmlDoc.getElementsByTagName("reffNo")[0]?.textContent || '',
      TrxAmount: embeddedXmlDoc.getElementsByTagName("TrxAmount")[0]?.textContent || '',
      trxDate: embeddedXmlDoc.getElementsByTagName("trxDate")[0]?.textContent || '',
      debitCreditFlag: embeddedXmlDoc.getElementsByTagName("debitCreditFlag")[0]?.textContent || '',
      ChannelCode: embeddedXmlDoc.getElementsByTagName("ChannelCode")[0]?.textContent || '',
      GLReconciliationNo: embeddedXmlDoc.getElementsByTagName("GLReconciliationNo")[0]?.textContent || ''
    };
    
    console.log({ ...outputData, transactionData });
    
alert(`
  Transaction Status:
    Bank Ref No: ${outputData.bankReffNo}
    Status Code: ${outputData.statusCode}
    Status Msg: ${outputData.statusMsg}
    Response DateTime: ${outputData.txnResponseDateTime}
    Account Number: ${transactionData.acctNo}
  
  Transaction Data:
    Reference No: ${transactionData.reffNo}
    Transaction Amount: ${transactionData.TrxAmount}
    Transaction Date: ${transactionData.trxDate}
    Debit/Credit Flag: ${transactionData.debitCreditFlag}
    Channel Code: ${transactionData.ChannelCode}
    GL Reconciliation No: ${transactionData.GLReconciliationNo}
  `);
  }

  
  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      this.onResetDB();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  async onResetDB() {
    await db.resetDatabase();
    // this.loadDataPlan();

    // db.transaction("rw", db.tablePlan, db.tablePlan, function() {
    //   db.tablePlan.clear();
    //   db.tablePlan.clear();
    // }).then(function() {
    //   console.log("DB UPDATED");
    // });
    this.onPopulateDB();
  }
  
  onPopulateDB() {
    // let server = this.util.ip_server+"/public/master_plan";
    // let server = this.util.ip_server+"/public/master_plan?petugas="+this.user_name;
    let server = this.util.ip_server+"/public/master_plan?petugas="+this.user_name;
    // let server = "http://bima.techmindo.co.id/rest_api/public/master_plan";

    const params = new HttpParams({
      fromObject: {
        user_id: "tes",
      }
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    this.http.get(server, httpOptions).subscribe((data: any) => {
      // const json = JSON.parse(data);
      // console.log(data);

      var data_plan: any = [];
      var data_run: any = [];
      for (let key in data) {
        // console.log(key + " = " + data[key].id);

        // console.log(data);
        data_plan.push({
          id: data[key].id,
          h_min: data[key].h_min,
          run_number: data[key].run_number,
          action_date: data[key].action_date,
          created_by: data[key].created_by,
          created_date: data[key].created_date,
          action_start_job: data[key].action_start_job,
          action_end_job: data[key].action_end_job,
          status_start_job: data[key].status_start_job,
          status_end_job: data[key].status_end_job,
        });

        for (let key2 in data[key].detail_runsheet) {
          // console.log(key2 + " = " + data[key].detail_runsheet[key2].id);
          data_run.push({
            id: data[key].detail_runsheet[key2].id,
            id_plan: data[key].detail_runsheet[key2].id_plan,
            no_boc: data[key].detail_runsheet[key2].no_boc,
            no_boc_fisik: data[key].detail_runsheet[key2].no_boc_fisik,
            jenis_layanan: data[key].detail_runsheet[key2].jenis_layanan,
            jenis_layanan_lapangan: data[key].detail_runsheet[key2].jenis_layanan_lapangan,
            jenis_barang: data[key].detail_runsheet[key2].jenis_barang,
            jenis_transaksi: data[key].detail_runsheet[key2].jenis_transaksi,
            pengirim: data[key].detail_runsheet[key2].pengirim,
            penerima: data[key].detail_runsheet[key2].penerima,
            nama: data[key].detail_runsheet[key2].nama,
            group: data[key].detail_runsheet[key2].group,
            area: data[key].detail_runsheet[key2].area,
            kode: data[key].detail_runsheet[key2].kode,
            nama_pt: data[key].detail_runsheet[key2].nama_pt,
            alamat: data[key].detail_runsheet[key2].alamat,
            latlng: data[key].detail_runsheet[key2].latlng,
            pic: data[key].detail_runsheet[key2].pic,
            pic_baru: "",
            nik: data[key].detail_runsheet[key2].nik,
            nik_baru: "",
            telp: data[key].detail_runsheet[key2].telp,
            total_nominal: data[key].detail_runsheet[key2].total_nominal,
            denom_kertas: data[key].detail_runsheet[key2].denom_kertas,
            denom_logam: data[key].detail_runsheet[key2].denom_logam,
            bag_number: data[key].detail_runsheet[key2].bag_number,
            seal_number: data[key].detail_runsheet[key2].seal_number,
            boc_fisik: data[key].detail_runsheet[key2].boc_fisik,
            rekening_kredit: data[key].detail_runsheet[key2].rekening_kredit,
            rekening_debit: data[key].detail_runsheet[key2].rekening_debit,
            rekening_client: data[key].detail_runsheet[key2].rekening_client,
            status_loading: data[key].detail_runsheet[key2].status_loading,
            status_complete: data[key].detail_runsheet[key2].status_complete,
            total_transfer: data[key].detail_runsheet[key2].total_transfer,
            status_transfer: data[key].detail_runsheet[key2].status_transfer,
            transferId: data[key].detail_runsheet[key2].transferId,
            txnDate: data[key].detail_runsheet[key2].txnDate,
          });
        }
      }

      // console.log(data_run);

      db.transaction("rw", db.tablePlan, function() {
        db.tablePlan.bulkAdd(data_plan).catch(function(err) {
          // console.log(err);
        });
      }).then(function() {
        console.log("DB UPDATED");
      });

      db.transaction("rw", db.tableRun, function() {
        db.tableRun.bulkAdd(data_run).catch(function(err) {
          // console.log(err);
        });
      }).then(function() {
        console.log("DB UPDATED");
      });
    }, error => {
      console.log(error);
    });
  }
}
