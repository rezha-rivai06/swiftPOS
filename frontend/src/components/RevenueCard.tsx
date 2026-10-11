import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface RevenueCardProps {
  amount?: string;
  transactionsCount?: number;
  cashAmount?: string;
  qrisAmount?: string;
}

export default function RevenueCard({
  amount = 'Rp 1.450.000',
  transactionsCount = 32,
  cashAmount = 'Rp 480.000',
  qrisAmount = 'Rp 970.000',
}: RevenueCardProps) {
  const [showNominal, setShowNominal] = useState(true);

  return (
    <View role="region" aria-label="Ringkasan Omset Kasir Hari Ini" style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>PENDAPATAN HARI INI</Text>
        </View>

        <TouchableOpacity 
          role="button" 
          aria-label={showNominal ? 'Sembunyikan nominal pendapatan' : 'Tampilkan nominal pendapatan'}
          onPress={() => setShowNominal(!showNominal)}
          style={styles.eyeBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.eyeBtnText}>
            {showNominal ? ' Sembunyikan' : 'Tampilkan'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text role="heading" aria-level={2} style={styles.nominalText}>
        {showNominal ? amount : 'Rp ••••••••'}
      </Text>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>{transactionsCount}</Text>
          <Text style={styles.statLabel}>Transaksi</Text>
        </View>

        <View style={styles.vDivider} />

        <View style={styles.statCol}>
          <Text style={styles.statNumber}>{showNominal ? cashAmount : '••••••'}</Text>
          <Text style={styles.statLabel}>Tunai (Laci)</Text>
        </View>

        <View style={styles.vDivider} />

        <View style={styles.statCol}>
          <Text style={styles.statNumber}>{showNominal ? qrisAmount : '••••••'}</Text>
          <Text style={styles.statLabel}>QRIS / Non-Tunai</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  eyeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eyeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2DD4BF',
  },
  nominalText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  vDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#334155',
  },
});
