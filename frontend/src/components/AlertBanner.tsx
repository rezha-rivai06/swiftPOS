import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface AlertBannerProps {
  title?: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => void;
}

export default function AlertBanner({
  title = '2 Bahan Baku Kritis!',
  description = 'Susu UHT sisa 2 kotak, Paper Cup 16oz tersisa 20 pcs.',
  actionText = 'Restok',
  onActionPress,
}: AlertBannerProps) {
  return (
    <View role="alert" aria-label={title} style={styles.alertBox}>
      <View style={styles.iconCircle}>
        <Text style={styles.alertIcon}>⚠️</Text>
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertDesc} numberOfLines={2}>
          {description}
        </Text>
      </View>

      {actionText && (
        <TouchableOpacity
          role="button"
          aria-label={actionText}
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={onActionPress}
        >
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDE047',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 18,
  },
  textWrap: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  alertDesc: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 15,
  },
  actionButton: {
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
