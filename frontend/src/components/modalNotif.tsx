import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export interface ModalNotifTipeData {
  visible: boolean;
  judul?: string;
  pesan: string;
  teksTombol?: string;
  onClose: () => void;
}

export default function ModalNotif({
  visible = false,
  judul = 'Notifikasi',
  pesan,
  teksTombol = 'Tutup',
  onClose,
}: ModalNotifTipeData) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        role="dialog"
        aria-modal
        aria-label={judul}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text role="heading" aria-level={2} style={styles.modalTitle}>
            {judul}
          </Text>
          <Text style={styles.modalMessage}>{pesan}</Text>
          <TouchableOpacity
            role="button"
            aria-label="Tutup dialog notifikasi"
            activeOpacity={0.8}
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>{teksTombol}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    width: '100%',
    backgroundColor: '#0F766E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});