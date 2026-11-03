import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  StatusBar,
  useWindowDimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { 
  Navbar,
  ModalNotif, 
  RevenueCard, 
  QuickActions, 
  AlertBanner, 
  RecentOrders,
  RingkasanPenjualan,
  ActionId,
} from '../components';

export default function Main() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const tablet = width >= 768;

  const [notif, setNotif] = useState({
    visible: false,
    judul: '',
    pesan: '',
  });

  const bukaNotif = (judul: string, pesan: string) => {
    setNotif({ visible: true, judul, pesan });
  };

  const tutupNotif = () => {
    setNotif((notif) => ({ ...notif, visible: false }));
  };

  const aksi = (id: string) => {
    switch (id as ActionId) {
      case 'pos':
        router.push('/pos');
        break;
      case 'riwayat':
        router.push('/riwayat');
        break;
      case 'kelolaMenu':
        router.push('/kelolaMenu');
        break;
      case 'stock':
        bukaNotif('Kelola Stok', 'Fitur ini masih dalam tahap pengembangan.');
        break;
      case 'report':
        bukaNotif('Kelola Laporan', 'Fitur ini masih dalam tahap pengembangan.');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      <ModalNotif
        visible={notif.visible}
        judul={notif.judul}
        pesan={notif.pesan}
        teksTombol="Mengerti"
        onClose={tutupNotif}
      />

      <Navbar
        onNotificationPress={() =>
          bukaNotif(
            'Pemberitahuan Sistem',
            '2 Bahan Baku Kritis: Susu UHT sisa 2 kotak dan Paper Cup 16oz tersisa 20 pcs. Harap segera restok.'
          )
        }
      />

      <View role="main" style={styles.mainContainer}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            tablet && styles.scrollContentTablet
          ]} 
          showsVerticalScrollIndicator={false}
        >
          {tablet ? (
            <>
              <View style={styles.tabletRow}>
                <View style={styles.tabletLeftCol}>
                  <RevenueCard />
                  <QuickActions onActionPress={aksi} />
                </View>
                <View style={styles.tabletRightCol}>
                  <RecentOrders />
                </View>
              </View>
              <RingkasanPenjualan />
            </>
          ) : (
            <>
              <RevenueCard />
              <QuickActions onActionPress={aksi} />
              <RingkasanPenjualan />
              <RecentOrders />
            </>
          )}
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
    paddingTop: 22,
    paddingBottom: 40,
    width: '100%',
    maxWidth: '100%',
  },
  scrollContentTablet: {
    paddingHorizontal: 28,
    paddingTop: 28,
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
  },
  tabletRow: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'flex-start',
  },
  tabletLeftCol: {
    flex: 1.15,
  },
  tabletRightCol: {
    flex: 0.85,
  },
});

