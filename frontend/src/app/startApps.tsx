import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';

export default function StartApps() {
  const router = useRouter();

  const layarOpasitas = useRef(new Animated.Value(1)).current;

  const atasOpasitas = useRef(new Animated.Value(0)).current;
  const atasGeser = useRef(new Animated.Value(38)).current;

  const bawahOpasitas = useRef(new Animated.Value(0)).current;
  const bawahGeser = useRef(new Animated.Value(-38)).current;

  const swiftOpasitas = useRef(new Animated.Value(0)).current;
  const swiftGeser = useRef(new Animated.Value(16)).current;

  const posOpasitas = useRef(new Animated.Value(0)).current;
  const posGeser = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(atasOpasitas, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(atasGeser, {
          toValue: 0,
          friction: 8,
          tension: 55,
          useNativeDriver: true,
        }),
        Animated.timing(bawahOpasitas, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(bawahGeser, {
          toValue: 0,
          friction: 8,
          tension: 55,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(swiftOpasitas, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(swiftGeser, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.parallel([
        Animated.timing(posOpasitas, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(posGeser, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.delay(820),
      Animated.parallel([
        Animated.timing(layarOpasitas, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(atasGeser, {
          toValue: -6,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(bawahGeser, {
          toValue: 6,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]),
    ]).start(() => {
      router.replace('/main');
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />

      <Animated.View
        role="region"
        aria-label="Layar Pembuka SwiftPOS"
        style={[styles.contentContainer, { opacity: layarOpasitas }]}
      >
        <View style={styles.logoWrapper}>
          <Animated.View
            style={[
              styles.atasWrapper,
              {
                opacity: atasOpasitas,
                transform: [{ translateY: atasGeser }],
              },
            ]}
          >
            <Svg width={110} height={64} viewBox="0 0 100 58" fill="none">
              <Path
                d="M 74 26 C 62 16, 38 16, 28 26 C 18 36, 20 46, 32 50 L 46 53"
                stroke="#FFFFFF"
                strokeWidth={12}
                strokeLinecap="round"
              />
            </Svg>
          </Animated.View>

          <Animated.View
            style={[
              styles.bawahWrapper,
              {
                opacity: bawahOpasitas,
                transform: [{ translateY: bawahGeser }],
              },
            ]}
          >
            <Svg width={110} height={64} viewBox="0 42 100 58" fill="none">
              <Path
                d="M 54 47 L 68 50 C 80 54, 82 64, 72 74 C 62 84, 38 84, 26 74"
                stroke="#FFFFFF"
                strokeWidth={12}
                strokeLinecap="round"
              />
            </Svg>
          </Animated.View>
        </View>

        <View style={styles.teksWrapper}>
          <Animated.Text
            role="heading"
            aria-level={1}
            style={[
              styles.brandSwift,
              {
                opacity: swiftOpasitas,
                transform: [{ translateY: swiftGeser }],
              },
            ]}
          >
            Swift
          </Animated.Text>
          <Animated.Text
            style={[
              styles.brandPos,
              {
                opacity: posOpasitas,
                transform: [{ translateY: posGeser }],
              },
            ]}
          >
            POS
          </Animated.Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F766E',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    width: 110,
    height: 110,
    position: 'relative',
  },
  atasWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bawahWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  teksWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 22,
  },
  brandSwift: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  brandPos: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});

