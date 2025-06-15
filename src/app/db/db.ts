/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quote-props */
/* eslint-disable max-len */
import Dexie, { Table } from 'dexie';

export interface TablePlan {
  id: string;
  h_min: string;
  run_number: string;
  action_date: string;
  created_by: string;
  created_date: string;
  action_start_job: string;
  action_end_job: string;
  status_start_job: boolean;
  status_end_job: boolean;
}

export interface TableRun {
  id: string;
  id_plan: string;
  no_boc: string;
  no_boc_fisik: string;
  jenis_layanan: string;
  jenis_layanan_lapangan: string;
  jenis_barang: string;
  jenis_transaksi: string;
  pengirim: string;
  penerima: string;
  nama: string;
  group: string;
  area: string;
  kode: string;
  nama_pt: string;
  alamat: string;
  latlng: string;
  pic: string;
  pic_baru: string;
  nik: string;
  nik_baru: string;
  telp: string;
  total_nominal: string;
  denom_kertas: string;
  denom_logam: string;
  bag_number: string;
  seal_number: string;
  boc_fisik: string;
  rekening_kredit: string;
  rekening_debit: string;
  rekening_client: string;
  status_loading?: boolean;
  status_complete?: boolean;
  total_transfer: string;
  status_transfer: string;
  transferId: string;
  txnDate: string;
}

// @ts-ignore
export class AppDB extends Dexie {
  tablePlan!: Table<TablePlan, number>;
  tableRun!: Table<TableRun, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      tablePlan: '&id,h_min,run_number,action_date,created_by,created_date,action_start_job,action_end_job,status_start_job,status_end_job',
      tableRun: '&id,id_plan,no_boc,no_boc_fisik,jenis_layanan,jenis_layanan_lapangan,jenis_barang,jenis_transaksi,pengirim,penerima,nama,group,area,kode,nama_pt,alamat,latlng,pic,pic_baru,nik,nik_baru,telp,total_nominal,denom_kertas,denom_logam,bag_number,seal_number,boc_fisik,rekening_kredit,rekening_debit,rekening_client,status_loading,status_complete,total_transfer,status_transfer,transferId,txnDate',
    });
  }

  async resetDatabase() {
    await db.transaction('rw', 'tablePlan', 'tableRun', () => {
      this.tablePlan.clear();
      this.tableRun.clear();
    });
  }
}

export const db = new AppDB();
