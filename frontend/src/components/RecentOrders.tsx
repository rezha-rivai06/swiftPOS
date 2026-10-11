import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface OrderItem {
  id: string;
  orderNumber: string;
  target: string;
  menuSummary: string;
  total: string;
  paymentMethod: 'QRIS' | 'CASH' | 'DEBIT';
  time: string;
}

const SAMPLE_ORDERS: OrderItem[] = [
  {
    id: '1',
    orderNumber: '#1042',
    target: 'Meja 3',
    menuSummary: 'Iced Latte, Croissant Almond',
    total: 'Rp 48.000',
    paymentMethod: 'QRIS',
    time: '2 mnt lalu',
  },
  {
    id: '2',
    orderNumber: '#1041',
    target: 'Takeaway',
    menuSummary: 'Americano Extra Shot',
    total: 'Rp 25.000',
    paymentMethod: 'CASH',
    time: '8 mnt lalu',
  },
  {
    id: '3',
    orderNumber: '#1040',
    target: 'Meja 1',
    menuSummary: 'Caramel Macchiato, Waffle',
    total: 'Rp 56.000',
    paymentMethod: 'QRIS',
    time: '15 mnt lalu',
  },
];

interface RecentOrdersProps {
  onViewAll?: () => void;
}

export default function RecentOrders({ onViewAll }: RecentOrdersProps) {
  return (
    <View role="region" aria-label="Aktivitas Pesanan Terakhir" style={styles.container}>
      <View style={styles.headerRow}>
        <Text role="heading" aria-level={3} style={styles.title}>
          Pesanan Terakhir
        </Text>
        <TouchableOpacity 
          role="button" 
          aria-label="Lihat semua riwayat transaksi"
          onPress={onViewAll}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>Lihat Semua ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {SAMPLE_ORDERS.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.cardLeft}>
              <View style={styles.topMeta}>
                <Text style={styles.orderNum}>{order.orderNumber}</Text>
                <Text style={styles.dotSeparator}>•</Text>
                <Text style={styles.orderTarget}>{order.target}</Text>
                <Text style={styles.dotSeparator}>•</Text>
                <Text style={styles.orderTime}>{order.time}</Text>
              </View>
              <Text style={styles.menuText} numberOfLines={1}>
                {order.menuSummary}
              </Text>
            </View>

            <View style={styles.cardRight}>
              <Text style={styles.priceText}>{order.total}</Text>
              <View 
                style={[
                  styles.badgePayment, 
                  order.paymentMethod === 'QRIS' ? styles.badgeQris : styles.badgeCash
                ]}
              >
                <Text 
                  style={[
                    styles.badgePaymentText,
                    order.paymentMethod === 'QRIS' ? styles.textQris : styles.textCash
                  ]}
                >
                  {order.paymentMethod}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  list: {
    gap: 10,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardLeft: {
    flex: 1,
    marginRight: 10,
  },
  topMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderNum: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  dotSeparator: {
    marginHorizontal: 5,
    color: '#94A3B8',
    fontSize: 10,
  },
  orderTarget: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  orderTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  menuText: {
    fontSize: 12,
    color: '#64748B',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  badgePayment: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeQris: {
    backgroundColor: '#EFF6FF',
  },
  badgeCash: {
    backgroundColor: '#ECFDF5',
  },
  badgePaymentText: {
    fontSize: 9,
    fontWeight: '800',
  },
  textQris: {
    color: '#2563EB',
  },
  textCash: {
    color: '#059669',
  },
});
