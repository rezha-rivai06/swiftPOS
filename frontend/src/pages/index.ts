import React from 'react';
import KelolaPemesanan from './kelolaPemesanan';
import RiwayatPesanan from './riwayat';

export type HalamanRute = 'pos' | 'riwayat';

export const DAFTAR_HALAMAN: Record<HalamanRute, React.ComponentType<any>> = {
  pos: KelolaPemesanan,
  riwayat: RiwayatPesanan,
};
