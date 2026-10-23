import React from 'react';
import KelolaPemesanan from './kelolaPemesanan';

export const DAFTAR_HALAMAN: Record<string, React.ComponentType<any>> = {
  pos: KelolaPemesanan,
};

export { default as KelolaPemesanan } from './kelolaPemesanan';
