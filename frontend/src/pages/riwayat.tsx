import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from '../icons';

type StatusTransaksi = 'TERJUAL' | 'BATAL';
type FilterStatus = 'Semua' | 'Terjual' | 'Batal';

interface TransaksiItem {
  id: string;
  orderNumber: string;
  tipePesanan: string;
  daftarMenu: string;
  totalHarga: number;
  metodeBayar: string;
  waktu: string;
  status: StatusTransaksi;
}

const DATA_TRANSAKSI: TransaksiItem[] = [
  {
    id: '1',
    orderNumber: '#1042',
    tipePesanan: 'Meja 3',
    daftarMenu: '2x Kopi Susu Aren, 1x Croissant Almond',
    totalHarga: 48000,
    metodeBayar: 'QRIS',
    waktu: '14:20 WIB',
    status: 'TERJUAL',
  },
  {
    id: '2',
    orderNumber: '#1041',
    tipePesanan: 'Takeaway',
    daftarMenu: '2x Kopi Susu Aren, 1x Croissant Almond',
    totalHarga: 48000,
    metodeBayar: 'QRIS',
    waktu: '14:20 WIB',
    status: 'TERJUAL',
  },
  {
    id: '3',
    orderNumber: '#1040',
    tipePesanan: 'Meja 1',
    daftarMenu: '1x Americano Ice',
    totalHarga: 15000,
    metodeBayar: 'Tunai',
    waktu: '13:50 WIB',
    status: 'BATAL',
  },
  {
    id: '4',
    orderNumber: '#1039',
    tipePesanan: 'Meja 5',
    daftarMenu: '1x Matcha Latte, 1x Roti Toast Bakar',
    totalHarga: 34000,
    metodeBayar: 'QRIS',
    waktu: '13:15 WIB',
    status: 'TERJUAL',
  },
];

interface RiwayatPesananProps {
  onBack?: () => void;
}

export default function RiwayatPesanan({ onBack }: RiwayatPesananProps = {}) {
  const router = useRouter();
  const [pilihanFilter, setPilihanFilter] = useState<FilterStatus>('Semua');
  const [kataKunciCari, setKataKunciCari] = useState<string>('');

  const formatRupiah = (nominal: number): string => {
    return 'Rp ' + nominal.toLocaleString('id-ID');
  };

  const kembali = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const totalSemua = DATA_TRANSAKSI.length;
  const totalTerjual = DATA_TRANSAKSI.filter((item) => item.status === 'TERJUAL').length;
  const totalBatal = DATA_TRANSAKSI.filter((item) => item.status === 'BATAL').length;

  const transaksiTerfilter = useMemo(() => {
    return DATA_TRANSAKSI.filter((item) => {
      const cocokanFilter =
        pilihanFilter === 'Semua' ||
        (pilihanFilter === 'Terjual' && item.status === 'TERJUAL') ||
        (pilihanFilter === 'Batal' && item.status === 'BATAL');

      const pencarian = kataKunciCari.toLowerCase().trim();
      const PencarianCocok =
        !pencarian ||
        item.orderNumber.toLowerCase().includes(pencarian) ||
        item.tipePesanan.toLowerCase().includes(pencarian) ||
        item.daftarMenu.toLowerCase().includes(pencarian);

      return cocokanFilter && PencarianCocok;
    });
  }, [pilihanFilter, kataKunciCari]);

  const handlePencarian = (teks: string) => {
    setKataKunciCari(teks);

    const kataKunci = teks.toLowerCase().trim();

    if (kataKunci !== '' && pilihanFilter !== 'Semua') {
      const itemDiTabIni = DATA_TRANSAKSI.some((item) => {
        const cocokStatus =
          pilihanFilter === 'Terjual'
            ? item.status === 'TERJUAL'
            : item.status === 'BATAL';

        const cocokTeks =
          item.orderNumber.toLowerCase().includes(kataKunci) ||
          item.tipePesanan.toLowerCase().includes(kataKunci) ||
          item.daftarMenu.toLowerCase().includes(kataKunci);

        return cocokStatus && cocokTeks;
      });

      if (!itemDiTabIni) {
        const itemDiTabLain = DATA_TRANSAKSI.some((item) => {
          return (
            item.orderNumber.toLowerCase().includes(kataKunci) ||
            item.tipePesanan.toLowerCase().includes(kataKunci) ||
            item.daftarMenu.toLowerCase().includes(kataKunci)
          );
        });

        if (itemDiTabLain) {
          setPilihanFilter('Semua');
        }
      }
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

     
      <View role="navigation" aria-label="Navigasi Riwayat" style={styles.navbar}>
        <View style={styles.navbarLeft}>
          <TouchableOpacity
            role="button"
            aria-label="Kembali ke beranda"
            style={styles.backButton}
            onPress={kembali}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text role="heading" aria-level={1} style={styles.navTitle}>
            Riwayat Pesanan
          </Text>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pesanan..."
            placeholderTextColor="#94A3B8"
            value={kataKunciCari}
            onChangeText={handlePencarian}
            autoCapitalize="none"
          />
        </View>
      </View>

     
      <View role="main" style={styles.mainContainer}>
      
        <View role="tablist" aria-label="Filter Status" style={styles.filterRow}>
          <TouchableOpacity
            role="tab"
            aria-selected={pilihanFilter === 'Semua'}
            style={[
              styles.filterPill,
              pilihanFilter === 'Semua' && styles.filterPillActive,
            ]}
            onPress={() => setPilihanFilter('Semua')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                pilihanFilter === 'Semua' && styles.filterTextActive,
              ]}
            >
              Semua ({totalSemua})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            role="tab"
            aria-selected={pilihanFilter === 'Terjual'}
            style={[
              styles.filterPill,
              pilihanFilter === 'Terjual' && styles.filterPillActive,
            ]}
            onPress={() => setPilihanFilter('Terjual')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                pilihanFilter === 'Terjual' && styles.filterTextActive,
              ]}
            >
              Terjual ({totalTerjual})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            role="tab"
            aria-selected={pilihanFilter === 'Batal'}
            style={[
              styles.filterPill,
              pilihanFilter === 'Batal' && styles.filterPillActive,
            ]}
            onPress={() => setPilihanFilter('Batal')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                pilihanFilter === 'Batal' && styles.filterTextActive,
              ]}
            >
              Batal ({totalBatal})
            </Text>
          </TouchableOpacity>
        </View>

      
        <FlatList
          data={transaksiTerfilter}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada transaksi ditemukan</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <Text style={styles.orderTitle}>
                  {item.orderNumber} · {item.tipePesanan}
                </Text>
                <Text style={styles.orderMeta}>
                  {item.waktu} · {item.metodeBayar}
                </Text>
                <Text style={styles.orderMenu} numberOfLines={1}>
                  {item.daftarMenu}
                </Text>
              </View>

              <View style={styles.cardRight}>
                <Text style={styles.orderPrice}>
                  {formatRupiah(item.totalHarga)}
                </Text>
                {item.status === 'TERJUAL' ? (
                  <View style={styles.badgeTerjual}>
                    <Text style={styles.badgeTerjualText}>TERJUAL</Text>
                  </View>
                ) : (
                  <View style={styles.badgeBatal}>
                    <Text style={styles.badgeBatalText}>BATAL</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F766E',
  },
  navbar: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
    width: 170,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 12,
    color: '#0F172A',
    padding: 0,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    marginTop: -8,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#0F766E',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 28,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardLeft: {
    flex: 1,
    marginRight: 12,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  orderMeta: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  orderMenu: {
    fontSize: 12,
    color: '#334155',
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F766E',
    marginBottom: 6,
  },
  badgeTerjual: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeTerjualText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeBatal: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeBatalText: {
    color: '#B91C1C',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 40,
  },
});
