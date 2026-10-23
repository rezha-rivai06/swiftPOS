import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export interface RingkasanPenjualanProps {
  totalPenjualan?: number;
  targetPenjualan?: number;
  totalKategori?: number;
  topPerformer?: string;
  persentaseTopPerformer?: number;
}

const RADIUS = 45;
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface DetailKategori {
  id: string;
  nama: string;
  jumlah: number;
  persen: number;
}

const CONTOH_RINCIAN_KATEGORI: DetailKategori[] = [
  { id: '1', nama: 'Makanan & Minuman', jumlah: 56, persen: 68 },
  { id: '2', nama: 'Kopi & Espresso', jumlah: 18, persen: 22 },
  { id: '3', nama: 'Snack & Pastry', jumlah: 8, persen: 10 },
];

export default function RingkasanPenjualan({
  totalPenjualan = 82,
  targetPenjualan = 100,
  totalKategori = 8,
  topPerformer = 'Makanan & Minuman',
  persentaseTopPerformer = 68,
}: RingkasanPenjualanProps) {
  const [bukaRincian, setBukaRincian] = useState<boolean>(false);

  const persentase = Math.round(
    Math.min((totalPenjualan / targetPenjualan) * 100, 100)
  );
  const strokeOffset = CIRCUMFERENCE * (1 - persentase / 100);

  const toggleRincian = () => {
    setBukaRincian((prev) => !prev);
  };

  return (
    <View
      role="region"
      aria-label="Ringkasan Penjualan Hari Ini"
      style={styles.kartu}
    >
      {/* ── HEADER KARTU ── */}
      <View style={styles.headerBaris}>
        <View>
          <Text role="heading" aria-level={3} style={styles.judulKartu}>
            Penjualan Hari Ini
          </Text>
          <Text style={styles.subJudulKartu}>
            {`Total ${totalKategori} kategori aktif terjual`}
          </Text>
        </View>

        <TouchableOpacity
          role="button"
          aria-label="Toggle rincian per kategori"
          aria-expanded={bukaRincian}
          style={styles.tombolRincian}
          activeOpacity={0.7}
          onPress={toggleRincian}
        >
          <Text style={styles.teksTombolRincian}>
            {`Pecah Rincian ${bukaRincian ? '∧' : '∨'}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── BARIS KONTEN UTAMA: RING + INFO ── */}
      <View style={styles.barisTengah}>
        {/* SVG Circular Ring */}
        <View
          role="progressbar"
          aria-valuenow={persentase}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Target penjualan tercapai ${persentase}%`}
          style={styles.wrapperRing}
        >
          <Svg width={120} height={120} viewBox="0 0 110 110">
            {/* Background Track */}
            <Circle
              cx={55}
              cy={55}
              r={RADIUS}
              stroke="#E2E8F0"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            {/* Active Progress Ring */}
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

          <View style={styles.labelTengah}>
            <Text style={styles.angkaPersentase}>{`${persentase}%`}</Text>
            <Text style={styles.labelFraksi}>
              {`${totalPenjualan}/${targetPenjualan}`}
            </Text>
            <Text style={styles.labelPenjualan}>Penjualan</Text>
          </View>
        </View>

        {/* Informasi Kategori */}
        <View style={styles.infoKategori}>
          <Text style={styles.labelInfo}>Total Kategori Aktif Terjual:</Text>
          <Text style={styles.nilaiKategori}>{`${totalKategori} Kategori`}</Text>

          <View style={styles.jarak} />

          <Text style={styles.labelInfo}>Top Performer:</Text>
          <Text style={styles.nilaiTopPerformer}>
            {`${topPerformer} (${persentaseTopPerformer}%)`}
          </Text>
        </View>
      </View>

      {/* ── PANEL EKSPANSI: DETAIL KATEGORI ── */}
      {bukaRincian && (
        <View
          role="region"
          aria-label="Daftar Rincian Kategori"
          style={styles.panelEkspansi}
        >
          <Text style={styles.judulEkspansi}>Kontribusi per Kategori:</Text>
          {CONTOH_RINCIAN_KATEGORI.map((kat) => (
            <View key={kat.id} style={styles.itemRincian}>
              <View style={styles.barisTeksRincian}>
                <Text style={styles.namaKategoriRincian}>{kat.nama}</Text>
                <Text style={styles.angkaKategoriRincian}>
                  {`${kat.jumlah} terjual (${kat.persen}%)`}
                </Text>
              </View>
              <View style={styles.trackBar}>
                <View
                  style={[styles.fillBar, { width: `${kat.persen}%` }]}
                />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ── FOOTER HINT EXPAND ── */}
      <TouchableOpacity
        role="button"
        aria-label="Buka tutup rincian per kategori"
        style={styles.hintBaris}
        activeOpacity={0.6}
        onPress={toggleRincian}
      >
        <Text style={styles.teksHint}>
          {`Ketuk untuk melihat rincian per kategori ${bukaRincian ? '∧' : '∨'}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginTop: 16,
  },
  headerBaris: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  judulKartu: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  subJudulKartu: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  tombolRincian: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teksTombolRincian: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  barisTengah: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  wrapperRing: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelTengah: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  angkaPersentase: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F766E',
    lineHeight: 26,
  },
  labelFraksi: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  labelPenjualan: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  infoKategori: {
    flex: 1,
    justifyContent: 'center',
  },
  labelInfo: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 2,
  },
  nilaiKategori: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  jarak: {
    height: 12,
  },
  nilaiTopPerformer: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  panelEkspansi: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  judulEkspansi: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  itemRincian: {
    marginBottom: 8,
  },
  barisTeksRincian: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  namaKategoriRincian: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  angkaKategoriRincian: {
    fontSize: 11,
    color: '#64748B',
  },
  trackBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fillBar: {
    height: '100%',
    backgroundColor: '#0F766E',
    borderRadius: 3,
  },
  hintBaris: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  teksHint: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
