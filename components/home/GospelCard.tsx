import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText } from '../ui';
import { useChurchStore } from '../../store/churchStore';
import { useI18n } from '../../i18n';

const GospelCard = () => {
  const reading = useChurchStore((s) => s.todayReadings);
  const { t } = useI18n();

  const handlePress = useCallback(() => router.push('/(tabs)/schedule' as never), []);

  if (!reading) return null;

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible
      accessibilityLabel={t('home.readGospelA11y')}
      activeOpacity={0.85}
      style={styles.card}
    >
      <View style={styles.topBorder} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Ionicons name="book-outline" size={16} color={Colors.gold} />
          <AppText variant="label" color={Colors.gold} style={styles.sectionLabel}>
            {t('home.gospelTodayLabel')}
          </AppText>
        </View>
        <AppText variant="headingSm" color={Colors.navy} style={styles.title} numberOfLines={2}>
          {reading.title}
        </AppText>
        <View style={styles.refRow}>
          <AppText variant="bodySm" color={Colors.textMuted}>{reading.gospel.reference}</AppText>
          <View style={styles.dot} />
          <AppText variant="bodySm" color={Colors.textMuted}>{reading.weekday}</AppText>
        </View>
        <AppText variant="bodyMd" color={Colors.textSecondary} numberOfLines={3} style={styles.excerpt}>
          {reading.gospel.text}
        </AppText>
        <View style={styles.readRow}>
          <AppText variant="label" color={Colors.gold}>{t('home.readMore')}</AppText>
          <Ionicons name="arrow-forward" size={13} color={Colors.gold} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  topBorder: {
    height: 4,
    backgroundColor: Colors.gold,
  },
  body: { padding: Spacing.md, gap: Spacing.xs },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sectionLabel: { letterSpacing: 0.8 },
  title: { marginTop: 2 },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  excerpt: { lineHeight: 22 },
  readRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
});

export default React.memo(GospelCard);
