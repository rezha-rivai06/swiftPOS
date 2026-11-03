import React from 'react';
import KelolaPemesanan from './kelolaPemesanan';
import RiwayatPesanan from './riwayat';
import KelolaMenu from './kelolaMenu';
import TambahItem from './tambahItem';

export type HalamanRute = 'pos' | 'riwayat' | 'kelolaMenu' | 'menu' | 'tambah-item' | 'tambahItem';

export const DAFTAR_HALAMAN: Record<HalamanRute, React.ComponentType<any>> = {
  pos: KelolaPemesanan,
  riwayat: RiwayatPesanan,
  kelolaMenu: KelolaMenu,
   menu: KelolaMenu,
  'tambah-item': TambahItem,
  tambahItem: TambahItem,
};
