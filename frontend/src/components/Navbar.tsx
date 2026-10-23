import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BellIcon } from '../icons';

interface NavbarProps {
  cafeName?: string;
  title?: string;
  isOpen?: boolean;
  onNotificationPress?: () => void;
}

export default function Navbar({
  cafeName = 'SwiftPOS',
  title = 'Kelola Bisnis Anda',
  isOpen = true,
  onNotificationPress,
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
          aria-label="Pemberitahuan notifikasi"
          style={styles.bellButton}
          activeOpacity={0.7}
          onPress={onNotificationPress}
        >
          <BellIcon size={18} color="#FFFFFF" />
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
