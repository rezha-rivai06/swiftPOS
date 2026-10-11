import React from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';

import { 
  Navbar, 
  RevenueCard, 
  QuickActions, 
  AlertBanner, 
  RecentOrders 
} from '../components';

export default function Main() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />
      
      <Navbar />

      <View role="main" style={styles.mainContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <RevenueCard />
          <QuickActions />
          <AlertBanner />
          <RecentOrders />
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
});
