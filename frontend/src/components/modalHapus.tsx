import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';

interface ModalHapusProps {
  tampil: boolean;
  namaItem: string;
  onHapus: () => void;
  onBatal: () => void;
}

export default function ModalHapus({
  tampil,
  namaItem,
  onHapus,
  onBatal,
}: ModalHapusProps) {
  return (
    <Modal
      visible={tampil}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onBatal}
    >
      <View
        role="dialog"
        aria-label="Konfirmasi Hapus Item"
        aria-modal
        style={styles.overlay}
      >
        <View style={styles.card}>
          <Text role="heading" aria-level={2} style={styles.judul}>
            Apakah kamu ingin menghapus item
          </Text>
          <Text style={styles.pesan}>
            <Text style={styles.pesanNama}>{namaItem}</Text>
            {' '}akan dihapus dari pesanan.
          </Text>

          <View style={styles.barisTombol}>
            <TouchableOpacity
              role="button"
              aria-label="Hapus item dari pesanan"
              style={[styles.tombol, styles.tombolHapus]}
              onPress={onHapus}
              activeOpacity={0.8}
            >
              <Text style={styles.teksHapus}>Hapus</Text>
            </TouchableOpacity>

            <TouchableOpacity
              role="button"
              aria-label="Batal, kembali ke pesanan"
              style={[styles.tombol, styles.tombolBatal]}
              onPress={onBatal}
              activeOpacity={0.8}
            >
              <Text style={styles.teksBatal}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  judul: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
    textAlign: 'center',
  },
  pesan: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  pesanNama: {
    fontWeight: '600',
    color: '#0F172A',
  },
  barisTombol: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  tombol: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tombolHapus: {
    backgroundColor: '#0F766E',
  },
  tombolBatal: {
    backgroundColor: '#F1F5F9',
  },
  teksHapus: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  teksBatal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
});
