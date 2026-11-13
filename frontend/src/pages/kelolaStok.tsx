import React, { useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, StockIcon, PencilIcon, TrashIcon } from '../icons';

export interface StockItemData {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  stokMinimum: number;
  stokMaksimum: number;
  keterangan?: string;
}

export type StatusStok = 'aman' | 'menipis' | 'kritis';

export interface FormErrorsStok {
  nama?: string;
  jumlah?: string;
  satuan?: string;
  stokMinimum?: string;
  stokMaksimum?: string;
}

const CONTOH_STOK: StockItemData[] = [
  { id: 's1', nama: 'Susu UHT Full Cream', jumlah: 2, satuan: 'kotak', stokMinimum: 4, stokMaksimum: 12 },
  { id: 's2', nama: 'Biji Kopi Espresso Blend', jumlah: 8, satuan: 'kg', stokMinimum: 3, stokMaksimum: 10 },
  { id: 's3', nama: 'Paper Cup Hot 16oz', jumlah: 25, satuan: 'pcs', stokMinimum: 30, stokMaksimum: 100 },
  { id: 's4', nama: 'Sirup Gula Aren Murni', jumlah: 5, satuan: 'botol', stokMinimum: 2, stokMaksimum: 8 },
  { id: 's5', nama: 'Kain Katun Toyobo', jumlah: 4, satuan: 'roll', stokMinimum: 3, stokMaksimum: 10 },
];

interface KelolaStokProps {
  onBack?: () => void;
}

export default function KelolaStok({ onBack }: KelolaStokProps) {
  const router = useRouter();

  const [daftarStok, setDaftarStok] = useState<StockItemData[]>(CONTOH_STOK);
  const [kataKunciCari, setKataKunciCari] = useState<string>('');

  const [modalTambah, setModalTambah] = useState({
    tampil: false,
    nama: '',
    jumlah: '',
    satuan: '',
    stokMinimum: '',
    stokMaksimum: '',
  });

  const [modalRestok, setModalRestok] = useState<{
    tampil: boolean;
    item: StockItemData | null;
    jumlahTambah: string;
  }>({
    tampil: false,
    item: null,
    jumlahTambah: '',
  });

  const [modalHapus, setModalHapus] = useState<{
    tampil: boolean;
    id: string;
    nama: string;
  }>({
    tampil: false,
    id: '',
    nama: '',
  });

  const [errorsTambah, setErrorsTambah] = useState<FormErrorsStok>({});
  const shakeAnimTambah = useRef(new Animated.Value(0)).current;

  const triggerAnimasiTambah = () => {
    shakeAnimTambah.setValue(0);
    const useNative = Platform.OS !== 'web';
    Animated.sequence([
      Animated.timing(shakeAnimTambah, { toValue: 10, duration: 70, useNativeDriver: useNative }),
      Animated.timing(shakeAnimTambah, { toValue: -10, duration: 70, useNativeDriver: useNative }),
      Animated.timing(shakeAnimTambah, { toValue: 8, duration: 70, useNativeDriver: useNative }),
      Animated.timing(shakeAnimTambah, { toValue: -8, duration: 70, useNativeDriver: useNative }),
      Animated.timing(shakeAnimTambah, { toValue: 5, duration: 70, useNativeDriver: useNative }),
      Animated.timing(shakeAnimTambah, { toValue: -5, duration: 70, useNativeDriver: useNative }),
      Animated.timing(shakeAnimTambah, { toValue: 3, duration: 70, useNativeDriver: useNative }),
      Animated.timing(shakeAnimTambah, { toValue: -3, duration: 70, useNativeDriver: useNative }),
      Animated.timing(shakeAnimTambah, { toValue: 1, duration: 70, useNativeDriver: useNative }),
      Animated.timing(shakeAnimTambah, { toValue: 0, duration: 70, useNativeDriver: useNative }),
    ]).start();
  };

  const jumlahStok = (jumlah: number, maks: number): number => {
    if (maks <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((jumlah / maks) * 100)));
  };

  const statusStok = (jumlah: number, min: number, maks: number) => {
    const persen = jumlahStok(jumlah, maks);
    if (jumlah <= min || persen <= 25) {
      return { 
        warna: '#EF4444', 
        label: 'Hampir Habis', 
        status: 'kritis' as StatusStok 
      };
    }
    if (persen <= 50) {
      return { 
        warna: '#F59E0B', 
        label: 'Perlu Restok', 
        status: 'menipis' as StatusStok 
      };
    }
    return { 
      warna: '#10B981', 
      label: 'Stok Aman', 
      status: 'aman' as StatusStok 
    };
  };

  const stokTerfilter = useMemo(() => {
    const keyword = kataKunciCari.toLowerCase().trim();
    if (!keyword) return daftarStok;
    return daftarStok.filter(
      (item) =>
        item.nama.toLowerCase().includes(keyword) ||
        item.satuan.toLowerCase().includes(keyword)
    );
  }, [daftarStok, kataKunciCari]);

  const totalBahan = daftarStok.length;
  const totalKritis = useMemo(() => {
    return daftarStok.filter((item) => item.jumlah <= item.stokMinimum).length;
  }, [daftarStok]);

  const kembali = () => {
    if (router.canGoBack()) {
      router.back();
    } else if (onBack) {
      onBack();
    } else {
      router.replace('/main');
    }
  };

  const bukaModalTambah = () => {
    setErrorsTambah({});
    setModalTambah({
      tampil: true,
      nama: '',
      jumlah: '',
      satuan: '',
      stokMinimum: '',
      stokMaksimum: '',
    });
  };

  const tutupModalTambah = () => {
    setErrorsTambah({});
    setModalTambah({
      tampil: false,
      nama: '',
      jumlah: '',
      satuan: '',
      stokMinimum: '',
      stokMaksimum: '',
    });
  };

  const bukaModalRestok = (item: StockItemData) => {
    setModalRestok({
      tampil: true,
      item,
      jumlahTambah: '',
    });
  };

  const tutupModalRestok = () => {
    setModalRestok({
      tampil: false,
      item: null,
      jumlahTambah: '',
    });
  };

  const konfirmasiHapus = (id: string, nama: string) => {
    setModalHapus({ tampil: true, id, nama });
  };

  const batalHapus = () => {
    setModalHapus({ tampil: false, id: '', nama: '' });
  };

  const eksekusiRestokCepat = () => {
    if (!modalRestok.item) return;
    const angka = Number(modalRestok.jumlahTambah);
    if (isNaN(angka) || angka === 0) {
      tutupModalRestok();
      return;
    }

    setDaftarStok((prev) =>
      prev.map((item) =>
        item.id === modalRestok.item?.id
          ? { ...item, jumlah: Math.max(0, item.jumlah + angka) }
          : item
      )
    );
    tutupModalRestok();
  };

  const simpanStokBaru = () => {
    const errorBaru: FormErrorsStok = {};

    if (!modalTambah.nama.trim()) {
      errorBaru.nama = 'nama wajib diisi';
    } else if (!/[a-zA-Z]/.test(modalTambah.nama.trim())) {
      errorBaru.nama = 'harus mengandung huruf';
    }

    if (!modalTambah.satuan.trim()) {
      errorBaru.satuan = 'satuan wajib diisi';
    }

    if (modalTambah.jumlah === '' || isNaN(Number(modalTambah.jumlah)) || Number(modalTambah.jumlah) < 0) {
      errorBaru.jumlah = 'jumlah valid wajib diisi';
    }

    if (modalTambah.stokMinimum === '' || isNaN(Number(modalTambah.stokMinimum)) || Number(modalTambah.stokMinimum) < 0) {
      errorBaru.stokMinimum = 'angka valid wajib';
    }

    if (modalTambah.stokMaksimum === '' || isNaN(Number(modalTambah.stokMaksimum)) || Number(modalTambah.stokMaksimum) <= 0) {
      errorBaru.stokMaksimum = 'harus lebih dari 0';
    }

    const jumlahError = Object.keys(errorBaru).length;
    if (jumlahError > 0) {
      setErrorsTambah(errorBaru);
      requestAnimationFrame(() => {
        triggerAnimasiTambah();
      });
      return;
    }

    setErrorsTambah({});

    const itemBaru: StockItemData = {
      id: 's_' + Date.now(),
      nama: modalTambah.nama.trim(),
      jumlah: Number(modalTambah.jumlah),
      satuan: modalTambah.satuan.trim().toLowerCase(),
      stokMinimum: Number(modalTambah.stokMinimum),
      stokMaksimum: Number(modalTambah.stokMaksimum),
    };

    setDaftarStok((prev) => [itemBaru, ...prev]);
    tutupModalTambah();
  };

  const eksekusiHapus = () => {
    setDaftarStok((prev) => prev.filter((item) => item.id !== modalHapus.id));
    batalHapus();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <Modal
        visible={modalHapus.tampil}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={batalHapus}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardHapus}>
            <Text style={styles.modalJudul}>Hapus Stok Bahan?</Text>
            <Text style={styles.modalPesan}>
              Bahan <Text style={styles.modalPesanNama}>{modalHapus.nama}</Text> akan dihapus permanen dari daftar.
            </Text>
            <View style={styles.modalTombolBaris}>
              <TouchableOpacity
                role="button"
                aria-label="Batalkan hapus"
                style={styles.modalBtnBatal}
                onPress={batalHapus}
                activeOpacity={0.7}
              >
                <Text style={styles.modalBtnBatalTeks}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                role="button"
                aria-label="Konfirmasi hapus stok"
                style={styles.modalBtnHapus}
                onPress={eksekusiHapus}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnHapusTeks}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalRestok.tampil}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={tutupModalRestok}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardRestok}>
            <Text style={styles.modalJudul}>Restok Cepat</Text>
            <Text style={styles.modalSubjudul}>
              {modalRestok.item?.nama} (Sisa: {modalRestok.item?.jumlah} {modalRestok.item?.satuan})
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Jumlah Penambahan ({modalRestok.item?.satuan})</Text>
              <TextInput
                style={styles.textInputModal}
                placeholder="Contoh: 10 untuk tambah, -2 untuk kurangi"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={modalRestok.jumlahTambah}
                onChangeText={(val) => setModalRestok((prev) => ({ ...prev, jumlahTambah: val }))}
              />
            </View>

            <View style={styles.modalTombolBaris}>
              <TouchableOpacity
                role="button"
                aria-label="Batalkan restok"
                style={styles.modalBtnBatal}
                onPress={tutupModalRestok}
                activeOpacity={0.7}
              >
                <Text style={styles.modalBtnBatalTeks}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                role="button"
                aria-label="Simpan restok"
                style={styles.modalBtnSimpan}
                onPress={eksekusiRestokCepat}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnSimpanTeks}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalTambah.tampil}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={tutupModalTambah}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardTambah}>
            <Text style={styles.modalJudul}>Tambah Stok Bahan Baru</Text>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.formLabel}>
                  Nama Bahan / Barang <Text style={styles.wajib}>*</Text>
                </Text>
                {errorsTambah.nama ? (
                  <Animated.View style={{ transform: [{ translateX: shakeAnimTambah }] }}>
                    <Text role="alert" aria-live="assertive" style={styles.errorTeks}>
                      ({errorsTambah.nama})
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
              <TextInput
                style={[styles.textInputModal, errorsTambah.nama ? styles.inputError : null]}
                placeholder="Contoh: Susu UHT, Biji Kopi, Kain Katun"
                placeholderTextColor="#94A3B8"
                value={modalTambah.nama}
                onChangeText={(teks) => {
                  setModalTambah((prev) => ({ ...prev, nama: teks }));
                  if (errorsTambah.nama) setErrorsTambah((prev) => ({ ...prev, nama: undefined }));
                }}
              />
            </View>

            <View style={styles.formRowDuaKolom}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <View style={styles.labelRow}>
                  <Text style={styles.formLabel}>
                    Jumlah Saat Ini <Text style={styles.wajib}>*</Text>
                  </Text>
                  {errorsTambah.jumlah ? (
                    <Animated.View style={{ transform: [{ translateX: shakeAnimTambah }] }}>
                      <Text role="alert" aria-live="assertive" style={styles.errorTeks}>
                        ({errorsTambah.jumlah})
                      </Text>
                    </Animated.View>
                  ) : null}
                </View>
                <TextInput
                  style={[styles.textInputModal, errorsTambah.jumlah ? styles.inputError : null]}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={modalTambah.jumlah}
                  onChangeText={(val) => {
                    setModalTambah((prev) => ({ ...prev, jumlah: val.replace(/\D/g, '') }));
                    if (errorsTambah.jumlah) setErrorsTambah((prev) => ({ ...prev, jumlah: undefined }));
                  }}
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <View style={styles.labelRow}>
                  <Text style={styles.formLabel}>
                    Satuan <Text style={styles.wajib}>*</Text>
                  </Text>
                  {errorsTambah.satuan ? (
                    <Animated.View style={{ transform: [{ translateX: shakeAnimTambah }] }}>
                      <Text role="alert" aria-live="assertive" style={styles.errorTeks}>
                        ({errorsTambah.satuan})
                      </Text>
                    </Animated.View>
                  ) : null}
                </View>
                <TextInput
                  style={[styles.textInputModal, errorsTambah.satuan ? styles.inputError : null]}
                  placeholder="kg / roll / pcs"
                  placeholderTextColor="#94A3B8"
                  value={modalTambah.satuan}
                  onChangeText={(val) => {
                    setModalTambah((prev) => ({ ...prev, satuan: val }));
                    if (errorsTambah.satuan) setErrorsTambah((prev) => ({ ...prev, satuan: undefined }));
                  }}
                />
              </View>
            </View>

            <View style={styles.formRowDuaKolom}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <View style={styles.labelRow}>
                  <Text style={styles.formLabel}>
                    Batas Minimum <Text style={styles.wajib}>*</Text>
                  </Text>
                  {errorsTambah.stokMinimum ? (
                    <Animated.View style={{ transform: [{ translateX: shakeAnimTambah }] }}>
                      <Text role="alert" aria-live="assertive" style={styles.errorTeks}>
                        ({errorsTambah.stokMinimum})
                      </Text>
                    </Animated.View>
                  ) : null}
                </View>
                <TextInput
                  style={[styles.textInputModal, errorsTambah.stokMinimum ? styles.inputError : null]}
                  placeholder="Contoh: 3"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={modalTambah.stokMinimum}
                  onChangeText={(val) => {
                    setModalTambah((prev) => ({ ...prev, stokMinimum: val.replace(/\D/g, '') }));
                    if (errorsTambah.stokMinimum) setErrorsTambah((prev) => ({ ...prev, stokMinimum: undefined }));
                  }}
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <View style={styles.labelRow}>
                  <Text style={styles.formLabel}>
                    Kapasitas Maks <Text style={styles.wajib}>*</Text>
                  </Text>
                  {errorsTambah.stokMaksimum ? (
                    <Animated.View style={{ transform: [{ translateX: shakeAnimTambah }] }}>
                      <Text role="alert" aria-live="assertive" style={styles.errorTeks}>
                        ({errorsTambah.stokMaksimum})
                      </Text>
                    </Animated.View>
                  ) : null}
                </View>
                <TextInput
                  style={[styles.textInputModal, errorsTambah.stokMaksimum ? styles.inputError : null]}
                  placeholder="Contoh: 10"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={modalTambah.stokMaksimum}
                  onChangeText={(val) => {
                    setModalTambah((prev) => ({ ...prev, stokMaksimum: val.replace(/\D/g, '') }));
                    if (errorsTambah.stokMaksimum) setErrorsTambah((prev) => ({ ...prev, stokMaksimum: undefined }));
                  }}
                />
              </View>
            </View>

            <View style={styles.modalTombolBaris}>
              <TouchableOpacity
                role="button"
                aria-label="Batalkan tambah bahan"
                style={styles.modalBtnBatal}
                onPress={tutupModalTambah}
                activeOpacity={0.7}
              >
                <Text style={styles.modalBtnBatalTeks}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                role="button"
                aria-label="Simpan bahan baru"
                style={styles.modalBtnSimpan}
                onPress={simpanStokBaru}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnSimpanTeks}>Simpan Bahan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View role="navigation" aria-label="Navigasi Kelola Stok" style={styles.navbar}>
        <View style={styles.navbarLeft}>
          <TouchableOpacity
            role="button"
            aria-label="Kembali ke dashboard"
            style={styles.backButton}
            onPress={kembali}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text role="heading" aria-level={1} style={styles.navTitle}>
            Kelola Stok Bahan
          </Text>
        </View>
      </View>

      <View role="main" style={styles.mainContainer}>
        <View style={styles.topActionBar}>
          <View style={styles.statusBadgesGroup}>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>
                Total <Text style={styles.totalBadgeNumber}>{totalBahan}</Text> Bahan
              </Text>
            </View>
            {totalKritis > 0 && (
              <View style={styles.kritisBadge}>
                <Text style={styles.kritisBadgeText}>
                  {totalKritis} Hampir Habis
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            role="button"
            aria-label="Tambah stok bahan baru"
            style={styles.btnTambahStok}
            onPress={bukaModalTambah}
            activeOpacity={0.8}
          >
            <Text style={styles.btnTambahStokTeks}>+ Tambah Stok</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari nama bahan atau barang..."
              placeholderTextColor="#94A3B8"
              value={kataKunciCari}
              onChangeText={setKataKunciCari}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        <FlatList
          data={stokTerfilter}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <StockIcon size={32} color="#0F766E" />
              </View>
              <Text style={styles.emptyTitle}>Bahan Tidak Ditemukan</Text>
              <Text style={styles.emptySubtitle}>
                Tidak ada bahan yang cocok dengan pencarian "{kataKunciCari}".
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const statusInfo = statusStok(item.jumlah, item.stokMinimum, item.stokMaksimum);
            const persentase = jumlahStok(item.jumlah, item.stokMaksimum);

            return (
              <View style={styles.stockCard}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardTitleCol}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.nama}
                    </Text>
                    <Text style={styles.itemCapacity}>
                      Batas aman: min {item.stokMinimum} {item.satuan} / maks {item.stokMaksimum} {item.satuan}
                    </Text>
                  </View>

                  <View style={[styles.unitPill, { borderColor: statusInfo.warna + '40', backgroundColor: statusInfo.warna + '12' }]}>
                    <Text style={[styles.unitPillNumber, { color: statusInfo.warna }]}>
                      {item.jumlah}
                    </Text>
                    <Text style={[styles.unitPillSatuan, { color: statusInfo.warna }]}>
                      {item.satuan}
                    </Text>
                  </View>
                </View>

                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${persentase}%`,
                          backgroundColor: statusInfo.warna,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.cardFooterRow}>
                  <View style={[styles.statusBadgePill, { backgroundColor: statusInfo.warna + '15' }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusInfo.warna }]} />
                    <Text style={[styles.statusBadgeTeks, { color: statusInfo.warna }]}>
                      {statusInfo.label} ({persentase}%)
                    </Text>
                  </View>

                  <View style={styles.cardActionsGroup}>
                    <TouchableOpacity
                      role="button"
                      aria-label={`Restok cepat ${item.nama}`}
                      style={styles.quickRestockBtn}
                      activeOpacity={0.7}
                      onPress={() => bukaModalRestok(item)}
                    >
                      <Text style={styles.quickRestockBtnText}>+ Restok</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      role="button"
                      aria-label={`Hapus ${item.nama}`}
                      style={styles.iconActionBtn}
                      activeOpacity={0.7}
                      onPress={() => konfirmasiHapus(item.id, item.nama)}
                    >
                      <TrashIcon size={16} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F766E',
    width: '100%',
  },
  navbar: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    marginTop: -8,
    width: '100%',
  },
  topActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    width: '100%',
  },
  statusBadgesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  totalBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  totalBadgeNumber: {
    fontWeight: '800',
    color: '#0F766E',
  },
  kritisBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  kritisBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  btnTambahStok: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnTambahStokTeks: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 12,
  },
  stockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleCol: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  itemCapacity: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
  unitPill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  unitPillNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  unitPillSatuan: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressBarWrapper: {
    marginBottom: 14,
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 99,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  statusBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeTeks: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickRestockBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickRestockBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  iconActionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCardTambah: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modalCardRestok: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modalCardHapus: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalJudul: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSubjudul: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  modalPesan: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  modalPesanNama: {
    fontWeight: '700',
    color: '#0F172A',
  },
  formGroup: {
    marginBottom: 12,
  },
  formRowDuaKolom: {
    flexDirection: 'row',
    gap: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  wajib: {
    color: '#EF4444',
  },
  errorTeks: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textInputModal: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    width: '100%',
  },
  modalTombolBaris: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalBtnBatal: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalBtnBatalTeks: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  modalBtnSimpan: {
    flex: 1.4,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnSimpanTeks: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalBtnHapus: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnHapusTeks: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

