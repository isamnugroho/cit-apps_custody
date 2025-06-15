/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/

interface Environment {
  production: boolean;
  firebase: {
    apiKey: string;
    projectId: string;
    messagingSenderId: string;
    appId: string;
    vapidKey: string;
  };
}

export const environment: Environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyDfPWcd1BSX4IGN6p1KNG0XeWkWbCoCEqg",
    projectId: "peak-trilogy-461621-v6",
    messagingSenderId: "1097591823669",
    appId: "1:1097591823669:android:adacf8bd4a5194b6a6007c",
    vapidKey: "BIz-o3u8huTVjnF5UhmLhTawzr4Ydxs6d9qPhdALZV_O5l7CfVkYVI7XH2fcORaUubYElqpOX-sjgMtd7iXWxrg"
  },
};
