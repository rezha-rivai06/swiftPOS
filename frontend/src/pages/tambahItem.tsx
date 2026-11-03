import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeftIcon, CoffeeIcon } from '../icons';

interface TambahItemProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function TambahItem({ onBack, onSuccess }: TambahItemProps) {
  const router = useRouter();

  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('');
  const [harga, setHarga] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const kembali = () => {
    if (router.canGoBack()) {
      router.back();
    } else if (onBack) {
      onBack();
    } else {
      router.replace('/main');
    }
  };

  const simpanMenu = () => {
    if (!nama.trim()) {
      Alert.alert('Data Belum Lengkap', 'Silakan masukkan nama menu terlebih dahulu.');
      return;
    }

    if (!harga.trim() || isNaN(Number(harga)) || Number(harga) <= 0) {
      Alert.alert('Harga Tidak Valid', 'Silakan masukkan harga jual yang valid.');
      return;
    }

    if (!kategori.trim()) {
      Alert.alert('Kategori Kosong', 'Silakan pilih atau ketik kategori untuk menu ini.');
      return;
    }

    Alert.alert(
      'Menu Tersimpan',
      `Menu "${nama}" (Rp ${Number(harga).toLocaleString('id-ID')}) berhasil ditambahkan ke katalog.`,
      [
        {
          text: 'OK',
          onPress: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              kembali();
            }
          },
        },
      ]
    );
  };

  const formatPratinjauHarga = (val: string) => {
    const num = Number(val.replace(/\D/g, ''));
    if (!num) return 'Rp 0';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const fotoDenganKamera = async () => {
    const izinKamera = await ImagePicker.requestCameraPermissionsAsync();
    if (izinKamera.status !== 'granted') {
      Alert.alert('Izin Kamera Dibutuhkan', 'Izin kamera diperlukan untuk memotret item.');
      return;
    }

    const jalankanKamera = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!jalankanKamera.canceled) {
      setFotoUri(jalankanKamera.assets[0].uri);
    }
  };

  const ambilFotoDariGaleri = async () => {
    const izinGaleri = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (izinGaleri.status !== 'granted') {
      Alert.alert('Izin Galeri Dibutuhkan', 'Izin galeri diperlukan untuk memilih foto item.');
      return;
    }

    const hasilGaleri = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!hasilGaleri.canceled) {
      setFotoUri(hasilGaleri.assets[0].uri);
    }
  };

  const tampilkanOpsiFoto = () => {
    Alert.alert('Unggah Foto Item', 'Pilih sumber gambar:', [
      { text: 'Kamera', onPress: fotoDenganKamera },
      { text: 'Galeri', onPress: ambilFotoDariGaleri },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View role="navigation" aria-label="Navigasi Tambah Menu" style={styles.navbar}>
        <View style={styles.navbarLeft}>
          <TouchableOpacity
            role="button"
            aria-label="Kembali ke kelola menu"
            style={styles.backButton}
            onPress={kembali}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text role="heading" aria-level={1} style={styles.navTitle}>
            Tambah item baru
          </Text>
        </View>
      </View>

      <View role="main" style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardSection}>
            <Text style={styles.fieldLabel}>Foto item</Text>
            <TouchableOpacity
              role="button"
              aria-label="Unggah foto item"
              style={styles.uploadBox}
              activeOpacity={0.8}
              onPress={tampilkanOpsiFoto}
            >
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={styles.imagePreview} />
              ) : (
                <>
                  <View style={styles.uploadIconCircle}>
                    <CoffeeIcon size={28} color="#0F766E" />
                  </View>
                  <Text style={styles.uploadTitle}>Ketuk untuk Memilih Foto</Text>
                  <Text style={styles.uploadSubtitle}>Mendukung format JPG, PNG maks. 5MB</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Nama item <Text style={styles.wajib}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="ketik nama item disini"
                placeholderTextColor="#94A3B8"
                value={nama}
                onChangeText={setNama}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Kategori Menu <Text style={styles.wajib}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ketik kategori item disini"
                placeholderTextColor="#94A3B8"
                value={kategori}
                onChangeText={setKategori}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelWithPreview}>
                <Text style={styles.inputLabel}>
                  Harga Jual (Rp) <Text style={styles.wajib}>*</Text>
                </Text>
                {harga !== '' && (
                  <Text style={styles.pricePreview}>{formatPratinjauHarga(harga)}</Text>
                )}
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="masukkan nominal disini misal 15000"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={harga}
                onChangeText={(harga) => setHarga(harga.replace(/\D/g, ''))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Deskripsi Menu (opsional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Ketik deskripsi item disini"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={deskripsi}
                onChangeText={setDeskripsi}
              />
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              role="button"
              aria-label="Batalkan penambahan menu"
              style={styles.btnBatal}
              onPress={kembali}
              activeOpacity={0.7}
            >
              <Text style={styles.btnBatalText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              role="button"
              aria-label="Simpan menu baru"
              style={styles.btnSimpan}
              onPress={simpanMenu}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSimpanText}>Simpan Menu</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    width: '100%',
    maxWidth: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: '100%',
  },
  cardSection: {
    marginBottom: 16,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  uploadIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 2,
  },
  uploadSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    resizeMode: 'cover',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
    width: '100%',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  wajib: {
    color: '#EF4444',
  },
  labelWithPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pricePreview: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    width: '100%',
  },
  textArea: {
    minHeight: 76,
    paddingTop: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    width: '100%',
  },
  btnBatal: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  btnBatalText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  btnSimpan: {
    flex: 2,
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  btnSimpanText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
