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


@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  posts: any[] = [];

  constructor(
    public util: UtilService,
    private modalController: ModalController,
    private historyService: HistoryService
  ) { }

  async ngOnInit() {
    await this.loadPosts();
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
}
