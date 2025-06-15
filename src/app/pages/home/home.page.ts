import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { NavigationExtras } from '@angular/router';
import { register } from 'swiper/element';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { db } from '../../db/db';
import { liveQuery } from 'dexie';


import {
  IonContent,
  IonHeader,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})


export class HomePage implements OnInit {

  data_run: any[] = [];
  button_active: boolean = false;

  user_id: any;
  user_name: any;
  user_level: any;
  nama_jabatan: any;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 4,
  };
  constructor(
    public util: UtilService,
    private http: HttpClient
  ) { 
    this.loadDataPlan();
  }

  ngOnInit() {
    this.onPopulateDB();
    this.user_id = localStorage.getItem('user_id');
    this.user_name = localStorage.getItem('user_name');
    this.user_level = localStorage.getItem('user_level');
    this.nama_jabatan = localStorage.getItem('nama_jabatan');


    this.onResetDB();
    // console.log(this.data_planning);
  }

  listDataPlan$ = liveQuery(() => this.loadDataPlan());

  async loadDataPlan() {
    var collection = db.tableRun;
    // this.data_run = await collection.toArray();
    // console.log(collection.toArray())
    return await collection.toArray();
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      this.onResetDB();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  onNotification() {
    this.util.navigateToPage('notifications');
  }

  onBookmarks() {
    this.util.navigateToPage('bookmarks');
  }

  onSalonList(name: any) {
    const param: NavigationExtras = {
      queryParams: {
        name: name
      }
    };
    this.util.navigateToPage('salon-list', param);
  }

  onSalonInfo(index: number) {
    const param: NavigationExtras = {
      queryParams: {
        id: index
      }
    };
    this.util.navigateToPage('salon-info', param);
  }

  OnLoading() {
    const param: NavigationExtras = {
      queryParams: {
        id: "12345"
      }
    };
    this.util.navigateToPage('tabs/explore', param);
  }

  onTest() {
    const data = this.util.getKeys("data_planning").then((res) => {
      const json = JSON.parse(res);
      this.util.data_planning = json;
      this.util.data_runsheet = json['detail_runsheet'];

      console.log(this.util.data_planning);
      console.log(this.util.data_runsheet);
    });
    // console.log(data);
  }

  onApiServer() {
    // let server = this.util.ip_server+"/public/master_plan?petugas="+this.user_name;
    let server = this.util.ip_server+"/public/master_plan?petugas="+this.user_name;
    // let server = "http://bima.techmindo.co.id/rest_api/public/master_plan";

    const params = new HttpParams({
      fromObject: {
        user_id: "tes",
      }
    });

    const postData = {
      petugas: this.user_name,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    this.http.get(server, httpOptions).subscribe((data: any) => {
      // const json = JSON.parse(data);
      console.log(data);
      // this.util.data_planning = data;
      this.util.setKeys("data_planning", JSON.stringify(data));
    }, error => {
      console.log(error);
    });
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
      console.log(data);

      var data_plan: any = [];
      var data_run: any = [];
      for (let key in data) {
        // console.log(key + " = " + data[key].id);

        // alert(data[key].status_start_job);
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

      console.log(data_run);

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

      
      this.button_active = true;
    }, error => {
      this.button_active = false;
      console.log(error);
    });
  }

  async authenticateUser() {
    // try {
    //   await BiometricAuth.authenticate({
    //     reason: 'Authenticate with fingerprint',
    //     allowDeviceCredential: true
    //   });
  
    //   console.log('Authentication successful');
    //   // Proceed with login or access sensitive data
    // } catch (error) {
    //   console.error('Authentication failed:', error);
    // }
  }
  

  async authenticate() {
    // const result = await BiometricAuth.authenticate({
    //   reason: 'Authenticate with fingerprint',
    //   allowDeviceCredential: true
    // });
  
    // if (result.success) {
    //   console.log('Authentication successful');
    // } else {
    //   console.log('Authentication failed', result.error);
    // }
  }

  // registerFingerprint(username: string, fingerprintData: string) {
  //   this.http.post('https://yourserver.com/register.php', {
  //     username: username,
  //     fingerprint: fingerprintData
  //   }).subscribe(response => {
  //     console.log('Registration successful', response);
  //   }, error => {
  //     console.log('Registration failed', error);
  //   });
  // }
  
}
