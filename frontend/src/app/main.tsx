import React from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  useWindowDimensions 
} from 'react-native';
import { useRouter } from 'expo-router';

import { 
  Navbar, 
  RevenueCard, 
  QuickActions, 
  AlertBanner, 
  RecentOrders 
} from '../components';

export default function Main() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const tablet = width >= 768;

  const aksi = (id: string) => {
    if (id === 'pos') {
      router.push('/pos');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />
      
      <Navbar />

      <View role="main" style={styles.mainContainer}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            tablet && styles.scrollContentTablet
          ]} 
          showsVerticalScrollIndicator={false}
        >
          {tablet ? (
            <View style={styles.tabletRow}>
              <View style={styles.tabletLeftCol}>
                <RevenueCard />
                <QuickActions onActionPress={aksi} />
                <AlertBanner />
              </View>
              <View style={styles.tabletRightCol}>
                <RecentOrders />
              </View>
            </View>
          ) : (
            <>
              <RevenueCard />
              <QuickActions onActionPress={aksi} />
              <AlertBanner />
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
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    marginTop: -12,
  },
  scrollContent: {
    padding: 18,
    paddingTop: 22,
    paddingBottom: 40,
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

