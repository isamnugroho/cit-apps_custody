import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

@Injectable({
  providedIn: 'root'
})

export class DbService extends Dexie {
  constructor() {
    super('ngdexieliveQuery');
    this.version(2).stores({
      table_plan: '++id, h_min, action_date, created_by, created_date',
      table_run: '++id,id_plan,no_boc,jenis_layanan,jenis_barang,jenis_transaksi,pengirim,penerima,nama,group,area,kode,nama_pt,alamat,latlng,pic,telp,total_nominal,denom_kertas,denom_logam,bag_number,seal_number,status_loading,status_complete,total_transfer,status_transfer,transferId,txnDate',
    }); 
  }
}
