/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  name: any = '';
  cover: any = '';
  id: any = '';
  constructor(
    public util: UtilService,
    public route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        const info = this.util.userList[data.id];
        if (info && info.name && info.image) {
          this.name = info.name;
          this.cover = info.image;
          setTimeout(() => {
            this.content.scrollToBottom(5);
          }, 1000);
        }
      }
    });
  }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
  }

}
