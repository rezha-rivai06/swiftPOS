import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { 
  CartIcon, 
  OrdersIcon, 
  CoffeeIcon, 
  StockIcon, 
  ReportIcon, 
  CustomersIcon, 
  PrinterIcon, 
  ShiftIcon 
} from '../icons';

export interface ActionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  badge?: string;
  badgeColor?: string;
}

const DEFAULT_ACTIONS: ActionItem[] = [
  { id: 'pos', title: 'Kasir POS', icon: <CartIcon size={24} color="#10B981" />, bgColor: '#10B981', badge: 'Utama', badgeColor: '#059669' },
  { id: 'orders', title: 'Riwayat', icon: <OrdersIcon size={24} color="#3B82F6" />, bgColor: '#3B82F6' },
  { id: 'menu', title: 'Menu Kopi', icon: <CoffeeIcon size={24} color="#D97706" />, bgColor: '#D97706' },
  { id: 'stock', title: 'Stok Bahan', icon: <StockIcon size={24} color="#EF4444" />, bgColor: '#EF4444', badge: 'Habis', badgeColor: '#DC2626' },
  { id: 'report', title: 'Laporan', icon: <ReportIcon size={24} color="#8B5CF6" />, bgColor: '#8B5CF6' },
  { id: 'customer', title: 'Pelanggan', icon: <CustomersIcon size={24} color="#06B6D4" />, bgColor: '#06B6D4' },
  { id: 'printer', title: 'Printer', icon: <PrinterIcon size={24} color="#64748B" />, bgColor: '#64748B' },
  { id: 'shift', title: 'Tutup Shift', icon: <ShiftIcon size={24} color="#475569" />, bgColor: '#475569' },
];

interface QuickActionsProps {
  onActionPress?: (id: string) => void;
}

export default function QuickActions({ onActionPress }: QuickActionsProps) {
  return (
    <View role="region" aria-label="Menu Akses Cepat" style={styles.sectionContainer}>
      <Text role="heading" aria-level={3} style={styles.sectionTitle}>
        Akses Cepat Kasir
      </Text>

      <View role="menu" style={styles.grid}>
        {DEFAULT_ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            role="menuitem"
            aria-label={item.title}
            style={styles.gridItem}
            activeOpacity={0.7}
            onPress={() => onActionPress && onActionPress(item.id)}
          >
            <View style={[styles.iconBox, { backgroundColor: item.bgColor + '18' }]}>
              {item.icon}
              {item.badge && (
                <View style={[styles.miniBadge, { backgroundColor: item.badgeColor || item.bgColor }]}>
                  <Text style={styles.miniBadgeText}>{item.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    paddingBottom: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  gridItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  miniBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  miniBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
});
