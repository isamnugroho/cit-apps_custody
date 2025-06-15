/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = '';
  password: string = '';
  remember: boolean = false; // Add remember property

  constructor(
    public util: UtilService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    const session = localStorage.getItem('user_id');
    if (session) {
      this.util.navigateRoot('/tabs');
    } else {
      // Check if username is remembered
      const rememberedUsername = localStorage.getItem('remembered_username');
      
      if (rememberedUsername) {
        this.username = rememberedUsername;
        this.remember = true;
      }
      console.log('No active session');
    }
  }

  onBack() {
    this.util.onBack();
  }

  onRegister() {
    this.util.navigateToPage('/register');
  }

  onHome() {
    this.util.navigateRoot('/tabs');
  }

  onReset() {
    this.util.navigateToPage('/reset-password');
  }

  onLogin() {
    let server = this.util.ip_server+"/public/authlogin/login";
      // let server = "http://bima.techmindo.co.id/rest_api/public/master_plan";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };
    
    const postData = {
      username: String(this.username),
      password: this.password
    };

    interface ResponseData {
        id: string;
        user_name: string;
        logged_in: boolean;
        // Add other expected fields
    }
  

    var that = this;
    this.http.post(server, postData, httpOptions)
      .subscribe((response: any) => {
        console.log('response:', response);
        // that.util.data_user = response;

        localStorage.setItem('user_id', response.user_id);
        localStorage.setItem('user_name', response.user_name);
        localStorage.setItem('user_level', response.user_level);
        localStorage.setItem('nama_jabatan', response.nama_jabatan);

        // Remember username if checkbox is checked
        if (this.remember) {
          localStorage.setItem('remembered_username', response.user_name);
        } else {
          localStorage.removeItem('remembered_username');
        }

        that.util.navigateRoot('/tabs');
      }, error => {
        console.error('Error:', error);

      });
  }

  rememberMe(checked: boolean) {
    this.remember = checked;
    if (checked) {
      localStorage.setItem('remembered_username', this.username);
    } else {
      localStorage.removeItem('remembered_username');
    }
  }
}
