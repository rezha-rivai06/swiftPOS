# SwiftPOS — Sistem Kasir & Manajemen Bisnis UMKM

> **Aplikasi Kasir (Point of Sale) Modern, Responsif, dan Berkinerja Tinggi untuk Gerai Kopi dan Usaha Kuliner (F&B) UMKM.**

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Active_Development-10B981?style=for-the-badge)](https://github.com/rivzhent/swiftcoffeeapps)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE)

---

## Daftar Isi
- [Tentang SwiftPOS](#tentang-swiftpos)
- [Teknologi & Dependensi Kunci](#teknologi--dependensi-kunci)
- [Arsitektur & Pola Desain (Clean Architecture)](#arsitektur--pola-desain-clean-architecture)
- [Matriks Fitur & Status Pengembangan](#matriks-fitur--status-pengembangan)
- [Implementasi Kode Kunci](#implementasi-kode-kunci)
  - [1. Single Source of Truth (SSOT) Dynamic Router](#1-single-source-of-truth-ssot-dynamic-router)
  - [2. Interactive SVG Circular Progress Gauge](#2-interactive-svg-circular-progress-gauge)
  - [3. Responsive Adaptive Layout Engine](#3-responsive-adaptive-layout-engine)
- [Struktur Direktori Proyek](#struktur-direktori-proyek)
- [Panduan Memulai & Pengembangan Lokal](#panduan-memulai--pengembangan-lokal)
- [Standar Kualitas & Panduan Rekayasa](#standar-kualitas--panduan-rekayasa)
- [Pengembang & Dedikasi](#pengembang--dedikasi)

---

## Tentang SwiftPOS

**SwiftPOS** dibangun dari nol oleh **Rezha (zhent)** (Fullstack Engineer) dengan satu tujuan utama: menyediakan ekosistem kasir digital yang ringan, intuitif, cepat, dan berstandar industri bagi para pengusaha UMKM, khususnya kedai kopi dan industri kuliner (*Food & Beverages*).

Banyak UMKM terhambat oleh aplikasi kasir yang lambat, berbasis langganan mahal, atau memiliki antarmuka pengguna yang rumit bagi barista dan kasir operasional. SwiftPOS dirancang dengan prinsip **Zero Friction**, **Clean Aesthetics**, dan **Adaptive Ergonomics** yang dapat dijalankan secara instan di perangkat Tablet (layar kasir counter) maupun Smartphone (kasir bergerak / *on-the-go*).

---

## Teknologi & Dependensi Kunci

| Kategori | Teknologi / Pustaka | Versi | Peran & Penggunaan |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React Native | `~0.86.3` | Fondasi platform lintas perangkat (Mobile & Web) |
| **Runtime & Tooling** | Expo | `~57.0.24` | Tooling universal ekosistem React Native |
| **Routing Engine** | Expo Router | `~57.0.22` | Navigasi berbasis file & dinamis (`app/` system) |
| **UI Library** | React | `19.2.3` | Komponen fungsional & hooks reaktif modern |
| **Language** | TypeScript | `~6.0.3` | Strict type safety, kontrak data, dan IntelliSense |
| **Vector & Graphics** | React-Native-SVG | `15.15.4` | Rendering ikon vektor dinamis & gauge lingkaran |
| **Animation Engine** | React Native Animated | Bawaan | Transisi kinetik splash screen & feedback mikro |
| **Web Target** | React-Native-Web | `~0.21.0` | Kompilasi layout mobile ke browser desktop/tablet |

---

## Arsitektur & Pola Desain (Clean Architecture)

SwiftPOS mengimplementasikan pemisahan tanggung jawab (*Separation of Concerns*) yang ketat agar kode dapat dipelihara dan diskalakan secara berkelanjutan:

```
┌────────────────────────────────────────────────────────┐
│                   EXPO ROUTER LAYER                    │
│     (src/app/index.tsx, [page].tsx, main.tsx)          │
│   Tanggung jawab: Rute URL, params, navigasi global    │
└───────────────────────────┬────────────────────────────┘
                            │ SSOT Rute Mapping
┌───────────────────────────▼────────────────────────────┐
│                    PAGE VIEWS LAYER                    │
│      (src/pages/kelolaPemesanan.tsx, riwayat.tsx)      │
│   Tanggung jawab: Alur bisnis halaman & state lokal    │
└───────────────────────────┬────────────────────────────┘
                            │ Komposisi Widget
┌───────────────────────────▼────────────────────────────┐
│                   COMPONENTS LAYER                     │
│  (RevenueCard, QuickActions, ringkasanPenjualan, dll)  │
│   Tanggung jawab: Elemen presentasi murni & reusable   │
└───────────────────────────┬────────────────────────────┘
                            │ Ikonografi
┌───────────────────────────▼────────────────────────────┐
│                      ICONS LAYER                       │
│    (src/icons/CartIcon, OrdersIcon, CoffeeIcon, dll)   │
│   Tanggung jawab: Aset grafis SVG modular tanpa beban  │
└────────────────────────────────────────────────────────┘
```

### Prinsip Utama Rekayasa:
1. **Single Source of Truth (SSOT) Rute**: Halaman tidak lagi di-hardcode secara terpisah di berbagai tombol. Rute terpusat pada file `src/pages/index.ts` menggunakan tipe data `HalamanRute` dan mapping `DAFTAR_HALAMAN`.
2. **Adaptive Viewport**: Komponen otomatis mengukur lebar layar (`width >= 768px`) untuk mengubah mode antarmuka antara smartphone (stack vertikal) dan tablet (multi-kolom split).
3. **Robust Layout Constraints**: Seluruh kontainer flex menerapkan `width: '100%'`, `maxWidth: '100%'`, dan `minWidth: 0` pada elemen teks bersarang untuk mencegah *horizontal overflow bug* pada layar kecil.

---

## Matriks Fitur & Status Pengembangan

| Modul Fitur | Lokasi Kode | Status | Keterangan Operasional |
| :--- | :--- | :---: | :--- |
| **Layar Pembuka (Splash)** | `src/app/startApps.tsx` | **Selesai** | Animasi kinetik SVG logo cangkir kopi dengan *cubic easing* dan transisi otomatis ke beranda. |
| **Dashboard Operasional** | `src/app/main.tsx` | **Selesai** | Ringkasan operasional harian terpadu dengan navigasi cepat ke seluruh modul kasir. |
| **Kartu Omset & Kas** | `src/components/RevenueCard.tsx` | **Selesai** | Metrik omset harian, jumlah transaksi, split uang laci (tunai) & QRIS, dilengkapi tombol sensor privasi nominal. |
| **Ringkasan Penjualan SVG** | `src/components/ringkasanPenjualan.tsx` | **Selesai** | Progress ring SVG terhadap target harian, status top performer, dan panel akordeon rincian per kategori. |
| **Peluncur Akses Cepat** | `src/components/QuickActions.tsx` | **Selesai** | Grid shortcut fitur utama kasir (`pos`, `riwayat`, `menu`, `stock`, `report`) dengan badge notifikasi. |
| **Kelola Pemesanan (POS)** | `src/pages/kelolaPemesanan.tsx` | **Selesai** | Katalog produk multi-kategori, kalkulator keranjang real-time, pajak PPN 11%, hitung kembalian cepat, dan cetak nota. |
| **Riwayat Transaksi** | `src/pages/riwayat.tsx` | **Selesai** | Daftar transaksi tercatat, filter status (`Semua`, `Terjual`, `Batal`), pencarian real-time berdasarkan nomor order/meja. |
| **Modal Peringatan & Hapus** | `src/components/modalNotif.tsx`, `modalHapus.tsx` | **Selesai** | Dialog modal aksesibel untuk konfirmasi pembatalan pesanan dan peringatan stok bahan kritis. |
| **Kelola Menu & Kategori** | `src/components/QuickActions.tsx` | **Dalam Proses** | Manajemen daftar produk, penyesuaian harga, penambahan varian (hot/ice/topping). |
| **Kelola Stok & Inventori** | `src/components/QuickActions.tsx` | **Dalam Proses** | Manajemen kartu stok bahan baku (susu, biji kopi, cup), peringatan otomatis bahan menipis (*low stock alert*). |
| **Laporan & Analitik** | `src/components/QuickActions.tsx` | **Dalam Proses** | Laporan laba/rugi, ekspor transaksi CSV/PDF, analisis jam sibuk gerai (*peak hours*). |
| **Integrasi Printer Thermal** | - | **Direncanakan** | Integrasi pencetakan struk via Bluetooth thermal printer protokol ESC/POS. |
| **Multi-outlet & Sinkronisasi** | - | **Direncanakan** | Dukungan multi-cabang dengan sinkronisasi database cloud waktu nyata. |

---

## Implementasi Kode Kunci

### 1. Single Source of Truth (SSOT) Dynamic Router

Rute halaman internal dikendalikan dari sebuah registry terpusat untuk menjamin keamanan tipe dan kemudahan perawatan kode:

```typescript
// File: src/pages/index.ts
import React from 'react';
import KelolaPemesanan from './kelolaPemesanan';
import RiwayatPesanan from './riwayat';

// 1. Tipe rute terdaftar yang diizinkan sistem
export type HalamanRute = 'pos' | 'riwayat';

// 2. Mapping kamus komponen halaman (Record Type)
export const DAFTAR_HALAMAN: Record<HalamanRute, React.ComponentType<any>> = {
  pos: KelolaPemesanan,
  riwayat: RiwayatPesanan,
};
```

Pada lapisan router dinamis, rute dieksekusi secara instan dengan proteksi fallback 404:

```tsx
// File: src/app/[page].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DAFTAR_HALAMAN, HalamanRute } from '../pages';

export default function DynamicPage() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const router = useRouter();

  // Pencarian komponen langsung dengan O(1) time complexity
  const KomponenHalaman = DAFTAR_HALAMAN[page as HalamanRute];

  if (!KomponenHalaman) {
    return <HalamanTidakDitemukan onKembali={() => router.replace('/main')} />;
  }

  return <KomponenHalaman onBack={() => router.replace('/main')} />;
}
```

---

### 2. Interactive SVG Circular Progress Gauge

Komponen ring progres penjualan menghitung sudut keliling lingkaran (*circumference*) SVG secara matematis dan real-time:

```typescript
// File: src/components/ringkasanPenjualan.tsx
const RADIUS = 45;
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Hitung persentase ketercapaian target
const persentase = Math.round(Math.min((totalPenjualan / targetPenjualan) * 100, 100));

// Tentukan offset garis SVG sesuai persentase
const strokeOffset = CIRCUMFERENCE * (1 - persentase / 100);
```

```tsx
<Svg width={104} height={104} viewBox="0 0 110 110">
  {/* Lingkaran Background / Jalur Rel */}
  <Circle cx={55} cy={55} r={RADIUS} stroke="#E2E8F0" strokeWidth={STROKE_WIDTH} fill="none" />
  {/* Lingkaran Progres Aktif */}
  <Circle
    cx={55}
    cy={55}
    r={RADIUS}
    stroke="#0F766E"
    strokeWidth={STROKE_WIDTH}
    fill="none"
    strokeDasharray={CIRCUMFERENCE}
    strokeDashoffset={strokeOffset}
    strokeLinecap="round"
    transform="rotate(-90 55 55)"
  />
</Svg>
```

---

### 3. Responsive Adaptive Layout Engine

Antarmuka beradaptasi secara cerdas berdasarkan dimensi jendela aktual tanpa membutuhkan dua berkas terpisah:

```tsx
// File: src/app/main.tsx
export default function Main() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTablet]}>
      {isTablet ? (
        <View style={styles.tabletRow}>
          <View style={styles.tabletLeftCol}>
            <RevenueCard />
            <QuickActions onActionPress={aksi} />
          </View>
          <View style={styles.tabletRightCol}>
            <RecentOrders />
          </View>
        </View>
      ) : (
        <>
          <RevenueCard />
          <QuickActions onActionPress={aksi} />
          <RingkasanPenjualan />
          <RecentOrders />
        </>
      )}
    </ScrollView>
  );
}
```

---

## Struktur Direktori Proyek

```text
swiftcoffeeapps/
├── README.md                      # Dokumentasi teknis proyek utama
├── .gitignore                     # Filter berkas Git
└── frontend/                      # Modul aplikasi React Native / Expo
    ├── app.json                   # Konfigurasi aplikasi Expo & splash screen
    ├── package.json               # Daftar dependensi & script eksekusi
    ├── tsconfig.json              # Konfigurasi compiler TypeScript
    └── src/
        ├── app/                   # Lapisan Navigasi Expo Router
        │   ├── index.tsx          # Titik masuk utama (redirect ke splash)
        │   ├── startApps.tsx      # Layar animasi pembuka (Splash screen)
        │   ├── main.tsx           # Halaman Dashboard Operasional
        │   └── [page].tsx         # Dynamic Router SSOT untuk seluruh sub-halaman
        ├── pages/                 # Lapisan Tampilan Halaman Penuh
        │   ├── index.ts           # Registry pusat SSOT (DAFTAR_HALAMAN & HalamanRute)
        │   ├── kelolaPemesanan.tsx# Halaman Kasir POS lengkap (katalog, keranjang, bayar)
        │   └── riwayat.tsx        # Halaman Riwayat Transaksi (filter status & pencarian)
        ├── components/            # Lapisan Komponen UI Reusable
        │   ├── index.ts           # Barrel export komponen
        │   ├── Navbar.tsx         # Bilah navigasi atas gerai & notifikasi
        │   ├── RevenueCard.tsx    # Kartu statistik pendapatan & laci kas
        │   ├── QuickActions.tsx   # Grid shortcut menu cepat kasir
        │   ├── ringkasanPenjualan.tsx # Gauge progres lingkaran SVG & analitik kategori
        │   ├── RecentOrders.tsx   # Pratinjau daftar transaksi terbaru
        │   ├── modalNotif.tsx     # Pop-up dialog notifikasi sistem & stok
        │   └── modalHapus.tsx     # Pop-up dialog konfirmasi destruktif keranjang
        ├── icons/                 # Lapisan Aset Ikon Vektor SVG
        │   ├── index.ts           # Barrel export ikon
        │   ├── CartIcon.tsx       # Ikon keranjang belanja POS
        │   ├── OrdersIcon.tsx     # Ikon riwayat transaksi
        │   ├── CoffeeIcon.tsx     # Ikon produk kopi & menu
        │   ├── StockIcon.tsx      # Ikon inventori bahan
        │   ├── ReportIcon.tsx     # Ikon laporan analitik
        │   ├── BellIcon.tsx       # Ikon lonceng notifikasi
        │   ├── ArrowLeftIcon.tsx  # Ikon navigasi kembali
        │   ├── PrinterIcon.tsx    # Ikon cetak nota
        │   ├── ShiftIcon.tsx      # Ikon pergantian shift kasir
        │   └── CustomersIcon.tsx  # Ikon pelanggan
        ├── hooks/                 # Custom React Hooks
        ├── services/              # Layanan API & integrasi eksternal
        ├── types/                 # Definisi tipe data global TypeScript
        └── constants/             # Konstanta warna, tema, dan konfigurasi umum
```

---

## Panduan Memulai & Pengembangan Lokal

### Prasyarat Sistem
- **Node.js**: Versi `18.x` atau lebih baru (`v20.x` LTS direkomendasikan).
- **npm** atau **yarn**.
- **Expo Go** (diinstal pada ponsel fisik Android/iOS) atau browser modern (Chrome / Edge / Firefox) untuk pengujian Web.

### Langkah Instalasi

1. **Clone repositori proyek:**
   ```bash
   git clone https://github.com/rivzhent/swiftcoffeeapps.git
   cd swiftcoffeeapps/frontend
   ```

2. **Instal dependensi proyek:**
   ```bash
   npm install
   ```

3. **Menjalankan server pengembangan:**
   ```bash
   # Menjalankan untuk platform Web di browser
   npm run web

   # Menjalankan untuk Android (Device / Emulator)
   npm run android

   # Menjalankan untuk iOS (Simulator macOS)
   npm run ios

   # Menjalankan server universal Expo (QR Code Expo Go)
   npm start
   ```

4. **Menjalankan pemeriksaan tipe data TypeScript:**
   ```bash
   npx tsc --noEmit
   ```
   > Pastikan hasil pemeriksaan selalu menghasilkan kode keluar `0` (Zero Type Errors).

---

## Standar Kualitas & Panduan Rekayasa

Sebagai engineer yang memegang prinsip perfeksionisme dan kode bersih (*clean code*), seluruh kontribusi pada SwiftPOS wajib mematuhi standar berikut:

1. **Strict Type Safety**: Hindari penggunaan tipe `any` tanpa batasan. Selalu definisikan antarmuka (`interface`) atau tipe eksplisit untuk *props*, *state*, dan *event handlers*.
2. **Accessible Semantics**: Seluruh tombol, kontainer interaktif, dan dialog wajib menyertakan atribut aksesibilitas (`role="button"`, `aria-label`, `role="region"`).
3. **No Unused Comments / Artifacts**: Kode produksi tidak boleh menyisakan komentar pseudocode yang usang. Seluruh blok kode harus berbicara sendiri (*self-documenting code*).
4. **Responsive Integrity**: Setiap penambahan komponen baru wajib diuji pada resolusi terkecil (360px) hingga layar tablet (1024px) untuk memastikan ketiadaan *horizontal layout overflow*.

---

## Pengembang & Dedikasi

* **Arsitek & Lead Fullstack Engineer:** **Rezha (zhent)**
* **Misi:** Memberikan kontribusi nyata dalam digitalisasi operasional bisnis UMKM Indonesia dengan perangkat lunak berkualitas kelas dunia.
* **Lisensi:** Proyek ini didistribusikan di bawah lisensi terbuka [MIT License](./frontend/LICENSE).

---
*Dokumentasi ini dipelihara secara aktif seiring bertumbuhnya fitur dan kapabilitas SwiftPOS.*
