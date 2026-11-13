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
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, PencilIcon, TrashIcon, CoffeeIcon } from '../icons';

export interface MenuItemData {
  id: string;
  nama: string;
  harga: number;
  kategori: string;
  deskripsi?: string;
  warna: string;
}

const CONTOH_MENU: MenuItemData[] = [
  { id: 'm1', nama: 'Kopi Susu Aren', harga: 18000, kategori: 'Minuman', warna: '#FEF3C7', deskripsi: 'Espresso bold dengan susu segar dan gula aren murni' },
  { id: 'm2', nama: 'Americano Ice', harga: 15000, kategori: 'Minuman', warna: '#F1F5F9', deskripsi: 'Double shot espresso dengan air dingin segar' },
  { id: 'm3', nama: 'Matcha Latte', harga: 20000, kategori: 'Minuman', warna: '#DCFCE7', deskripsi: 'Matcha Uji Jepang berpadu dengan susu creamy' },
  { id: 'm4', nama: 'Mie Nyemek Spesial', harga: 15000, kategori: 'Makanan', warna: '#FEE2E2', deskripsi: 'Mie kuah kental dengan telur orak-arik dan sayur segar' },
  { id: 'm5', nama: 'Nasi Goreng Telur', harga: 18000, kategori: 'Makanan', warna: '#FFEDD5', deskripsi: 'Nasi goreng bumbu racik khas gerai dengan telur ceplok' },
  { id: 'm6', nama: 'Ayam Geprek Pedas', harga: 22000, kategori: 'Makanan', warna: '#FCE7F3', deskripsi: 'Ayam krispi renyah diulek dengan sambal bawang pedas' },
  { id: 'm7', nama: 'Croissant Almond', harga: 22000, kategori: 'Snack', warna: '#FEF9C3', deskripsi: 'Pastry renyah berlapis dengan taburan almond panggang' },
  { id: 'm8', nama: 'Kentang Goreng', harga: 12000, kategori: 'Snack', warna: '#FEF3C7', deskripsi: 'French fries renyah dengan taburan bumbu gurih' },
  { id: 'm9', nama: 'Pisang Crispy Keju', harga: 10000, kategori: 'Snack', warna: '#F3E8FF', deskripsi: 'Pisang goreng krispi dengan limpahan keju dan susu kental' },
  { id: 'm10', nama: 'Pisang Crispy Keju', harga: 10000, kategori: 'Snack', warna: '#F3E8FF', deskripsi: 'Pisang goreng krispi dengan limpahan keju dan susu kental' },
];

interface KelolaMenuProps {
  onBack?: () => void;
  onTambahMenu?: () => void;
}

interface FormErrorsEdit {
  nama?: string;
  kategori?: string;
  harga?: string;
}

export default function KelolaMenu({ onBack, onTambahMenu }: KelolaMenuProps) {
  const router = useRouter();

  const [daftarMenu, setDaftarMenu] = useState<MenuItemData[]>(CONTOH_MENU);
  const [kataKunciCari, setKataKunciCari] = useState<string>('');

  const kategoriDinamis = useMemo(() => {
    return Array.from(new Set(daftarMenu.map((item) => item.kategori)));
  }, [daftarMenu]);

  const [pilihanKategori, setPilihanKategori] = useState<string>(
    kategoriDinamis[0] || ''
  );

  const [modalHapus, setModalHapus] = useState<{
    tampil: boolean;
    id: string;
    nama: string;
  }>({
    tampil: false,
    id: '',
    nama: '',
  });

  const [modalEdit, setModalEdit] = useState<{
    tampil: boolean;
    id: string;
    nama: string;
    harga: string;
    kategori: string;
    deskripsi: string;
  }>({
    tampil: false,
    id: '',
    nama: '',
    harga: '',
    kategori: '',
    deskripsi: '',
  });

  const [errorsEdit, setErrorsEdit] = useState<FormErrorsEdit>({});
  const shakeAnimEdit = useRef(new Animated.Value(0)).current;

  const triggerAnimasiEdit = () => {
    shakeAnimEdit.setValue(0);
    const apps = Platform.OS !== 'web';
    Animated.sequence([
      Animated.timing(shakeAnimEdit, { toValue: 10, duration: 70, useNativeDriver: apps }),
      Animated.timing(shakeAnimEdit, { toValue: -10, duration: 70, useNativeDriver: apps }),
      Animated.timing(shakeAnimEdit, { toValue: 8, duration: 70, useNativeDriver: apps }),
      Animated.timing(shakeAnimEdit, { toValue: -8, duration: 70, useNativeDriver: apps }),
      Animated.timing(shakeAnimEdit, { toValue: 5, duration: 70, useNativeDriver: apps }),
      Animated.timing(shakeAnimEdit, { toValue: -5, duration: 70, useNativeDriver: apps }),
      Animated.timing(shakeAnimEdit, { toValue: 3, duration: 70, useNativeDriver: apps }),
      Animated.timing(shakeAnimEdit, { toValue: -3, duration: 70, useNativeDriver: apps }),
      Animated.timing(shakeAnimEdit, { toValue: 1, duration: 70, useNativeDriver: apps }),
      Animated.timing(shakeAnimEdit, { toValue: 0, duration: 70, useNativeDriver: apps }),
    ]).start();
  };

  const kembali = () => {
    if (router.canGoBack()) {
      router.back();
    } else if (onBack) {
      onBack();
    } else {
      router.replace('/main');
    }
  };

  const bukaHalamanTambah = () => {
    if (onTambahMenu) {
      onTambahMenu();
    } else {
      router.push('/tambah-item');
    }
  };

  const konfirmasiHapus = (id: string, nama: string) => {
    setModalHapus({ tampil: true, id, nama });
  };

  const eksekusiHapus = () => {
    setDaftarMenu((prev) => prev.filter((item) => item.id !== modalHapus.id));
    setModalHapus({ tampil: false, id: '', nama: '' });
  };

  const batalHapus = () => {
    setModalHapus({ tampil: false, id: '', nama: '' });
  };

  const bukaModalEdit = (item: MenuItemData) => {
    setErrorsEdit({});
    setModalEdit({
      tampil: true,
      id: item.id,
      nama: item.nama,
      harga: item.harga.toString(),
      kategori: item.kategori,
      deskripsi: item.deskripsi || '',
    });
  };

  const tutupModalEdit = () => {
    setErrorsEdit({});
    setModalEdit({
      tampil: false,
      id: '',
      nama: '',
      harga: '',
      kategori: '',
      deskripsi: '',
    });
  };

  const simpanEditMenu = () => {
    const errorBaru: FormErrorsEdit = {};

    if (!modalEdit.nama.trim()) {
      errorBaru.nama = 'nama wajib diisi';
    } else if (/^\d+$/.test(modalEdit.nama.trim())) {
      errorBaru.nama = 'tidak boleh hanya angka';
    } else if (!/[a-zA-Z]/.test(modalEdit.nama.trim())) {
      errorBaru.nama = 'harus mengandung huruf';
    }

    if (!modalEdit.kategori.trim()) {
      errorBaru.kategori = 'kategori wajib diisi';
    } else if (/^\d+$/.test(modalEdit.kategori.trim())) {
      errorBaru.kategori = 'tidak boleh hanya angka';
    } else if (!/[a-zA-Z]/.test(modalEdit.kategori.trim())) {
      errorBaru.kategori = 'harus mengandung huruf';
    }

    if (!modalEdit.harga.trim()) {
      errorBaru.harga = 'harga wajib diisi';
    } else if (/\D/.test(modalEdit.harga.trim())) {
      errorBaru.harga = 'hanya boleh angka';
    } else if (Number(modalEdit.harga) <= 0) {
      errorBaru.harga = 'nominal tidak valid';
    }

    const jumlahError = Object.keys(errorBaru).length;
    if (jumlahError > 0) {
      setErrorsEdit(errorBaru);
      requestAnimationFrame(() => {
        triggerAnimasiEdit();
      });
      return;
    }

    setErrorsEdit({});

    const hargaNum = Number(modalEdit.harga);
    setDaftarMenu((menu) =>
      menu.map((item) =>
        item.id === modalEdit.id
          ? {
              ...item,
              nama: modalEdit.nama.trim(),
              harga: hargaNum,
              kategori: modalEdit.kategori.trim(),
              deskripsi: modalEdit.deskripsi.trim() || undefined,
            }
          : item
      )
    );

    tutupModalEdit();
  };

  const formatRupiah = (nominal: number) => {
    return 'Rp ' + nominal.toLocaleString('id-ID');
  };

  const tanganiPencarian = (teks: string) => {
    setKataKunciCari(teks);
    const kataKunci = teks.toLowerCase().trim();

    if (kataKunci === '') {
      setPilihanKategori(kategoriDinamis[0] || '');
      return;
    }

    const adaDiKategoriIni = daftarMenu.some((item) => {
      const cocokKategori = item.kategori.toLowerCase() === pilihanKategori.toLowerCase();
      const cocokTeks =
        item.nama.toLowerCase().includes(kataKunci) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(kataKunci));
      return cocokKategori && cocokTeks;
    });

    if (!adaDiKategoriIni) {
      const itemDitemukan = daftarMenu.find((item) => {
        return (
          item.nama.toLowerCase().includes(kataKunci) ||
          (item.deskripsi && item.deskripsi.toLowerCase().includes(kataKunci))
        );
      });

      if (itemDitemukan) {
        setPilihanKategori(itemDitemukan.kategori);
      }
    }
  };

  const menuTerfilter = useMemo(() => {
    return daftarMenu.filter((item) => {
      const cocokKategori = item.kategori.toLowerCase() === pilihanKategori.toLowerCase();
      const cari = kataKunciCari.toLowerCase().trim();
      const cocokCari =
        !cari ||
        item.nama.toLowerCase().includes(cari) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(cari));

      return cocokKategori && cocokCari;
    });
  }, [daftarMenu, pilihanKategori, kataKunciCari]);

  const totalSemuaMenu = daftarMenu.length;

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
          <View style={styles.modalCard}>
            <Text style={styles.modalJudul}>Hapus Menu?</Text>
            <Text style={styles.modalPesan}>
              Menu <Text style={styles.modalPesanNama}>{modalHapus.nama}</Text> akan dihapus permanen dari daftar produk.
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
                aria-label="Konfirmasi hapus menu"
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
        visible={modalEdit.tampil}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={tutupModalEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardEdit}>
            <Text style={styles.modalJudul}>Edit Menu</Text>

            <View style={styles.formGroupEdit}>
              <View style={styles.labelRowEdit}>
                <Text style={styles.labelEdit}>
                  Nama Menu <Text style={styles.wajib}>*</Text>
                </Text>
                {errorsEdit.nama ? (
                  <Animated.View
                    style={{ transform: [{ translateX: shakeAnimEdit }] }}
                  >
                    <Text role="alert" aria-live="assertive" style={styles.errorTeks}>
                      ({errorsEdit.nama})
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
              <TextInput
                style={[styles.inputEdit, errorsEdit.nama ? styles.inputError : null]}
                placeholder="Nama menu..."
                placeholderTextColor="#94A3B8"
                value={modalEdit.nama}
                onChangeText={(teks) => {
                  setModalEdit((prev) => ({ ...prev, nama: teks }));
                  if (errorsEdit.nama) {
                    setErrorsEdit((prev) => ({ ...prev, nama: undefined }));
                  }
                }}
              />
            </View>

            <View style={styles.formGroupEdit}>
              <View style={styles.labelRowEdit}>
                <Text style={styles.labelEdit}>
                  Kategori <Text style={styles.wajib}>*</Text>
                </Text>
                {errorsEdit.kategori ? (
                  <Animated.View
                    style={{ transform: [{ translateX: shakeAnimEdit }] }}
                  >
                    <Text role="alert" aria-live="assertive" style={styles.errorTeks}>
                      ({errorsEdit.kategori})
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
              <TextInput
                style={[styles.inputEdit, errorsEdit.kategori ? styles.inputError : null]}
                placeholder="Kategori menu..."
                placeholderTextColor="#94A3B8"
                value={modalEdit.kategori}
                onChangeText={(teks) => {
                  setModalEdit((prev) => ({ ...prev, kategori: teks }));
                  if (errorsEdit.kategori) {
                    setErrorsEdit((prev) => ({ ...prev, kategori: undefined }));
                  }
                }}
              />
            </View>

            <View style={styles.formGroupEdit}>
              <View style={styles.labelRowEdit}>
                <Text style={styles.labelEdit}>
                  Harga Jual (Rp) <Text style={styles.wajib}>*</Text>
                </Text>
                {errorsEdit.harga ? (
                  <Animated.View
                    style={{ transform: [{ translateX: shakeAnimEdit }] }}
                  >
                    <Text role="alert" aria-live="assertive" style={styles.errorTeks}>
                      ({errorsEdit.harga})
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
              <TextInput
                style={[styles.inputEdit, errorsEdit.harga ? styles.inputError : null]}
                placeholder="Nominal harga..."
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={modalEdit.harga}
                onChangeText={(teks) => {
                  setModalEdit((prev) => ({
                    ...prev,
                    harga: teks.replace(/\D/g, ''),
                  }));
                  if (errorsEdit.harga) {
                    setErrorsEdit((prev) => ({ ...prev, harga: undefined }));
                  }
                }}
              />
            </View>

            <View style={styles.formGroupEdit}>
              <View style={styles.labelRowEdit}>
                <Text style={styles.labelEdit}>Deskripsi item (opsional)</Text>
              </View>
              <TextInput
                style={[styles.inputEdit, styles.textAreaEdit]}
                placeholder="Ketik deskripsi item disini"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={modalEdit.deskripsi}
                onChangeText={(teks) =>
                  setModalEdit((prev) => ({ ...prev, deskripsi: teks }))
                }
              />
            </View>

            <View style={styles.modalTombolBaris}>
              <TouchableOpacity
                role="button"
                aria-label="Batalkan edit"
                style={styles.modalBtnBatal}
                onPress={tutupModalEdit}
                activeOpacity={0.7}
              >
                <Text style={styles.modalBtnBatalTeks}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                role="button"
                aria-label="Simpan perubahan menu"
                style={styles.modalBtnSimpan}
                onPress={simpanEditMenu}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnSimpanTeks}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View role="navigation" aria-label="Navigasi Kelola Menu" style={styles.navbar}>
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
            Kelola Item
          </Text>
        </View>
      </View>

      <View role="main" style={styles.mainContainer}>
        <View style={styles.topActionBar}>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>
              Total keseluruhan <Text style={styles.totalBadgeNumber}>{totalSemuaMenu}</Text> Item
            </Text>
          </View>

          <TouchableOpacity
            role="button"
            aria-label="Tambah Menu Baru"
            style={styles.btnTambah}
            onPress={bukaHalamanTambah}
            activeOpacity={0.8}
          >
            <Text style={styles.btnTambahText}>+ Tambah Menu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari menu..."
            placeholderTextColor="#94A3B8"
            value={kataKunciCari}
            onChangeText={tanganiPencarian}
            autoCapitalize="none"
          />
        </View>

        <View role="tablist" aria-label="Filter Kategori Dinamis" style={styles.categoryRow}>
          {kategoriDinamis.map((kat) => (
            <TouchableOpacity
              key={kat}
              role="tab"
              aria-selected={pilihanKategori.toLowerCase() === kat.toLowerCase()}
              style={[
                styles.categoryPill,
                pilihanKategori.toLowerCase() === kat.toLowerCase() && styles.categoryPillActive,
              ]}
              onPress={() => setPilihanKategori(kat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  pilihanKategori.toLowerCase() === kat.toLowerCase() && styles.categoryTextActive,
                ]}
              >
                {kat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={menuTerfilter}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada menu dalam kategori ini</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.menuCard}>
              <View style={[styles.avatarBox, { backgroundColor: item.warna }]}>
                <CoffeeIcon size={24} color="#0F766E" />
              </View>

              <View style={styles.cardDetails}>
                <Text style={styles.menuTitle}>{item.nama}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.kategori}</Text>
                  </View>
                </View>
                <Text style={styles.priceText}>{formatRupiah(item.harga)}</Text>
              </View>

              <View style={styles.actionIcons}>
                <TouchableOpacity
                  role="button"
                  aria-label={`Edit ${item.nama}`}
                  style={styles.iconBtn}
                  activeOpacity={0.7}
                  onPress={() => bukaModalEdit(item)}
                >
                  <PencilIcon size={19} color="#64748B" />
                </TouchableOpacity>

                <TouchableOpacity
                  role="button"
                  aria-label={`Hapus ${item.nama}`}
                  style={[styles.iconBtn, styles.iconBtnDelete]}
                  activeOpacity={0.7}
                  onPress={() => konfirmasiHapus(item.id, item.nama)}
                >
                  <TrashIcon size={19} color="#EF4444" />
                </TouchableOpacity>
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
    width: '100%',
    maxWidth: '100%',
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
    paddingHorizontal: 16,
    paddingTop: 18,
    width: '100%',
    maxWidth: '100%',
  },
  topActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  totalBadgeNumber: {
    color: '#0F766E',
    fontWeight: '800',
  },
  btnTambah: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnTambahText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 13,
    color: '#0F172A',
    width: '100%',
    padding: 0,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 40,
    gap: 12,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  cardDetails: {
    flex: 1,
    marginRight: 10,
    minWidth: 0,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDelete: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modalJudul: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
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
  modalTombolBaris: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalBtnBatal: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnBatalTeks: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  modalBtnHapus: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnHapusTeks: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCardEdit: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  formGroupEdit: {
    width: '100%',
    marginBottom: 12,
  },
  labelEdit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  labelRowEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
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
  inputEdit: {
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
  textAreaEdit: {
    minHeight: 68,
    paddingTop: 8,
  },
  modalBtnSimpan: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnSimpanTeks: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
