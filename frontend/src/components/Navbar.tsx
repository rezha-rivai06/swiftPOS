import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface NavbarProps {
  cafeName?: string;
  title?: string;
  isOpen?: boolean;
}

export default function Navbar({
  cafeName = 'SwiftPOS',
  title = 'Kelola Bisnis Anda',
  isOpen = true,
}: NavbarProps) {
  return (
    <View role="navigation" style={styles.navbarContainer}>
      <View style={styles.headerLeft}>
        <View>
          <Text role="heading" aria-level={1} style={styles.brandTitle}>
            {cafeName}
          </Text>
          <Text style={styles.title}>
            {title}
          </Text>
        </View>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity 
          role="button" 
          aria-label="Status operasional kasir"
          style={[styles.statusPill, isOpen ? styles.statusOpen : styles.statusClosed]}
          activeOpacity={0.8}
        >
          <View style={[styles.statusDot, isOpen ? styles.dotOpen : styles.dotClosed]} />
          <Text style={styles.statusText}>{isOpen ? 'Kasir Buka' : 'Tutup'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          role="button" 
          aria-label="Pemberitahuan notifikasi"
          style={styles.bellButton}
          activeOpacity={0.7}
        >
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.unreadBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    fontSize: 22,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 12,
    color: '#CCFBF1',
    marginTop: 2,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusOpen: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    borderColor: '#34D399',
  },
  statusClosed: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1,
    borderColor: '#F87171',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotOpen: {
    backgroundColor: '#34D399',
  },
  dotClosed: {
    backgroundColor: '#F87171',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 16,
  },
  unreadBadge: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    borderWidth: 1.5,
    borderColor: '#0F766E',
  },
});
