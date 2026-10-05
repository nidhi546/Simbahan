import React, { useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Share, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText } from '../ui';
import { useChurchStore } from '../../store/churchStore';
import SaintOfTheDay from './SaintOfTheDay';
import { useI18n } from '../../i18n';

const TodayReadings = () => {
  const reading = useChurchStore((s) => s.todayReadings);
  const { t } = useI18n();

  const handleShare = useCallback(async () => {
    if (!reading) return;
    try {
      await Share.share({
        message: `${reading.title}\n\n${reading.gospel.reference}\n\n"${reading.gospel.text}"\n\n— Simbahan App`,
        title: t('readings.shareTitle'),
      });
    } catch (_) {}
  }, [reading, t]);

  if (!reading) {
    return (
      <View style={styles.empty}>
        <AppText variant="bodyMd" color={Colors.textMuted}>
          {t('readings.noReadingsToday')}
        </AppText>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      bounces={false}
    >
      {/* Date + Title */}
      <View style={styles.titleBlock}>
        <AppText variant="caption" color={Colors.textMuted} style={styles.weekday}>
          {reading.weekday}
        </AppText>
        <AppText variant="displaySm" color={Colors.navy}>{reading.title}</AppText>
      </View>

      {/* Saint of the Day */}
      <SaintOfTheDay />

      {/* First Reading */}
      <View style={StyleSheet.flatten([styles.readingCard, styles.firstReadingCard])}>
        <View style={styles.cardHeader}>
          <AppText variant="label" color={Colors.gold} style={styles.cardLabel}>
            {t('readings.firstReadingLabel')}
          </AppText>
          <AppText variant="bodySm" color={Colors.textMuted}>{reading.firstReading.reference}</AppText>
        </View>
        <AppText variant="caption" color={Colors.textSecondary} style={styles.bookName}>
          {reading.firstReading.book}
        </AppText>
        <AppText variant="bodyMd" color={Colors.textPrimary} selectable style={styles.readingText}>
          {reading.firstReading.text}
        </AppText>
      </View>

      {/* Psalm */}
      <View style={styles.psalmCard}>
        <AppText variant="label" color={Colors.sage} style={styles.cardLabel}>
          {t('readings.psalmLabel')}
        </AppText>
        <AppText variant="bodySm" color={Colors.textMuted} style={styles.psalmRef}>
          {reading.psalm.reference}
        </AppText>
        <AppText
          variant="bodyMd"
          color={Colors.gold}
          style={StyleSheet.flatten([styles.readingText, styles.psalmResponse])}
          selectable
        >
          ℟. {reading.psalm.response}
        </AppText>
      </View>

      {/* Second Reading (if exists) */}
      {reading.secondReading && (
        <View style={StyleSheet.flatten([styles.readingCard, styles.secondReadingCard])}>
          <View style={styles.cardHeader}>
            <AppText variant="label" color={Colors.navyLight} style={styles.cardLabel}>
              {t('readings.secondReadingLabel')}
            </AppText>
            <AppText variant="bodySm" color={Colors.textMuted}>
              {reading.secondReading.reference}
            </AppText>
          </View>
          <AppText variant="caption" color={Colors.textSecondary} style={styles.bookName}>
            {reading.secondReading.book}
          </AppText>
          <AppText variant="bodyMd" color={Colors.textPrimary} selectable style={styles.readingText}>
            {reading.secondReading.text}
          </AppText>
        </View>
      )}

      {/* Gospel */}
      <View style={StyleSheet.flatten([styles.readingCard, styles.gospelCard])}>
        <View style={styles.gospelBorder} />
        <View style={styles.gospelBody}>
          <AppText variant="label" color={Colors.crimson} style={styles.cardLabel}>
            {t('readings.gospelLabel')}
          </AppText>
          <AppText variant="headingMd" color={Colors.navy} style={styles.gospelTitle}>
            {reading.gospel.reference}
          </AppText>
          <View style={styles.goldSeparator} />
          <AppText variant="bodyLg" color={Colors.textPrimary} selectable style={styles.gospelText}>
            {reading.gospel.text}
          </AppText>
        </View>
      </View>

      {/* Reflection */}
      <View style={styles.reflectionCard}>
        <View style={styles.reflectionHeader}>
          <Ionicons name="bulb-outline" size={16} color={Colors.sage} />
          <AppText variant="label" color={Colors.sage} style={styles.cardLabel}>
            {t('readings.reflectionLabel')}
          </AppText>
        </View>
        <AppText
          variant="bodyMd"
          color={Colors.textSecondary}
          style={StyleSheet.flatten([styles.readingText, styles.reflectionText])}
          selectable
        >
          {t('readings.defaultReflection')}
        </AppText>
      </View>

      {/* Share Button */}
      <TouchableOpacity
        onPress={handleShare}
        accessible
        accessibilityLabel={t('readings.shareGospel')}
        activeOpacity={0.8}
        style={styles.shareBtn}
      >
        <Ionicons name="share-outline" size={18} color={Colors.textInverse} />
        <AppText variant="label" color={Colors.textInverse} style={styles.shareBtnText}>
          {t('readings.shareGospel')}
        </AppText>
      </TouchableOpacity>

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
};

const navyLight = '#2A3F7E';

const styles = StyleSheet.create({
  scroll: { padding: Spacing.md, gap: Spacing.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  titleBlock: { gap: Spacing.xs, marginBottom: Spacing.xs },
  weekday: { textTransform: 'uppercase', letterSpacing: 1 },
  readingCard: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  firstReadingCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.gold,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.md,
    paddingVertical: Spacing.md,
  },
  secondReadingCard: {
    borderLeftWidth: 4,
    borderLeftColor: navyLight,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.md,
    paddingVertical: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  cardLabel: { letterSpacing: 0.8 },
  bookName: { marginBottom: Spacing.xs, fontStyle: 'italic' },
  readingText: { lineHeight: 24 },
  psalmCard: {
    backgroundColor: Colors.sagePale,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.sage + '40',
    gap: Spacing.xs,
  },
  psalmRef: { marginBottom: 2 },
  psalmResponse: { fontStyle: 'italic' },
  gospelCard: {
    flexDirection: 'row',
    padding: 0,
  },
  gospelBorder: {
    width: 4,
    backgroundColor: Colors.crimson,
    borderTopLeftRadius: Radius.md,
    borderBottomLeftRadius: Radius.md,
  },
  gospelBody: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  gospelTitle: { marginTop: 2 },
  goldSeparator: {
    height: 2,
    backgroundColor: Colors.gold,
    width: 40,
    borderRadius: 1,
    marginVertical: Spacing.xs,
  },
  gospelText: { lineHeight: 26 },
  reflectionCard: {
    backgroundColor: Colors.sagePale,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.sage + '30',
    gap: Spacing.xs,
  },
  reflectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  reflectionText: { fontStyle: 'italic', lineHeight: 24 },
  shareBtn: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.md,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  shareBtnText: { fontSize: 14 },
  navyLight: { color: navyLight },
});

export default React.memo(TodayReadings);
