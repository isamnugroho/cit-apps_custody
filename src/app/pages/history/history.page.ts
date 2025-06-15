/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { HistoryService } from 'src/app/services/hostory.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Pipe, PipeTransform } from '@angular/core';



@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  posts: any[] = [];
  history: any[] = [];

  constructor(
    public util: UtilService,
    private modalController: ModalController,
    private historyService: HistoryService,
    private http: HttpClient,
    private fileOpener: FileOpener
  ) { }

  async ngOnInit() {
    // await this.loadPosts();
    await this.loadHistory();
  }

  async loadPosts(event?: any) {
    try {
      const newPosts = await this.historyService.getPosts();
      this.posts = [...this.posts, ...newPosts];

      if (event) event.target.complete(); // Stop loading animation
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }

  async loadHistory(event?: any) {
    try {
      const newHistory = await this.historyService.getHistory(this.util.ip_server);
      this.history = [...this.history, ...newHistory];

      console.log(this.history);

      if (event) event.target.complete(); // Stop loading animation
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
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

    this.http.get(pdfUrl, { headers, responseType: 'blob' }).subscribe(async (blob) => {
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const base64Data = await this.blobToBase64(blob);
      try {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}_${(currentDate.getMonth() + 1).toString().padStart(2, '0')}_${currentDate.getDate().toString().padStart(2, '0')}_${currentDate.getHours().toString().padStart(2, '0')}_${currentDate.getMinutes().toString().padStart(2, '0')}_${currentDate.getSeconds().toString().padStart(2, '0')}`;

        const newFileName = `boc_${formattedDate}.pdf`;


        // Save the file
        await Filesystem.writeFile({
            path: newFileName,
            data: base64Data,
            directory: FilesystemDirectory.Documents
        });

        // Get the file URI
        const fileInfo = await Filesystem.getUri({
            path: newFileName,
            directory: FilesystemDirectory.Documents
        });
        const fileUri = fileInfo.uri;

        // Open the file
        this.openFile(fileUri);
      } catch (error) {
          console.error('Error saving or opening the file:', error);
      }

      // try {
      //   Filesystem.writeFile({
      //     path: 'boc.pdf',
      //     data: base64Data,
      //     directory: FilesystemDirectory.Documents,
      //   });

      //   const fileInfo = await Filesystem.getUri({
      //     path: 'boc.pdf',
      //     directory: FilesystemDirectory.Documents,
      //   });
      //   const fileUri = fileInfo.uri; // Get the file path
        
      //   this.openFile(fileUri)
      // } catch (error) {
      //   alert("Download gagal")
      // }
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
}
