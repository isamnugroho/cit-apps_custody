import { Component, OnInit } from '@angular/core';
import {
  FirebaseMessaging,
  GetTokenOptions,
} from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { IonicModule } from "@ionic/angular";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.page.html',
  styleUrls: ['./push-notification.page.scss'],
})
export class PushNotificationPage {
public token = "";

  constructor() {
    FirebaseMessaging.addListener("notificationReceived", (event) => {
      console.log("notificationReceived: ", { event });
      const audio = new Audio('assets/sounds/selesai_review.mp3');
      audio.volume = 1.0;
      audio.play();

      // alert("notificationReceived: " +JSON.stringify(event));
    });
    FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
      console.log("notificationActionPerformed: ", { event });
      const audio = new Audio('assets/sounds/selesai_review.mp3');
      audio.volume = 1.0;
      audio.play();
      // alert("notificationActionPerformed: " +JSON.stringify(event));
    });
    if (Capacitor.getPlatform() === "web") {
      navigator.serviceWorker.addEventListener("message", (event: any) => {
        console.log("serviceWorker message: ", { event });
        const notification = new Notification(event.data.notification.title, {
          body: event.data.notification.body,
        });
        notification.onclick = (event) => {
          console.log("notification clicked: ", { event });
        };
      });
    }
  }

  public async requestPermissions(): Promise<void> {
    await FirebaseMessaging.requestPermissions();
  }

  public async getToken(): Promise<void> {
    const options: GetTokenOptions = {
      vapidKey: "BIz-o3u8huTVjnF5UhmLhTawzr4Ydxs6d9qPhdALZV_O5l7CfVkYVI7XH2fcORaUubYElqpOX-sjgMtd7iXWxrg",
    };
    if (Capacitor.getPlatform() === "web") {
      options.serviceWorkerRegistration =
        await navigator.serviceWorker.register("firebase-messaging-sw.js");
    }
    const { token } = await FirebaseMessaging.getToken(options);
    this.token = token;
  }
}
