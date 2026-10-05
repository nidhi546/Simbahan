import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useI18n } from '../../i18n';

interface FundCardProps {
  id: string;
  title: string;
  description: string;
  goal: number;
  collected: number;
  startDate: string;
  endDate: string;
}

const fmt = (n: number, locale: string) =>
  '₱' + n.toLocaleString(locale, { minimumFractionDigits: 0 });

const FundCard = ({ id, title, description, goal, collected, startDate, endDate }: FundCardProps) => {
  const pct = Math.min(100, Math.round((collected / goal) * 100));
  const { t, language } = useI18n();
  const locale = language === 'en' ? 'en-PH' : 'fil-PH';

  const handlePress = useCallback(() => {
    router.push(`/donations/${id}` as never);
  }, [id]);

  return (
    <View style={styles.card}>
      <View style={styles.leftBorder} />
      <View style={styles.body}>
        <AppText variant="headingSm" color={Colors.navy}>{title}</AppText>
        <AppText variant="bodySm" color={Colors.textSecondary} style={styles.desc}>
          {description}
        </AppText>

        {/* Progress */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
        </View>
        <View style={styles.progressLabels}>
          <AppText variant="caption" color={Colors.gold}>{t('donations.percentReached', { pct })}</AppText>
          <AppText variant="caption" color={Colors.textMuted}>
            {fmt(collected, locale)} / {fmt(goal, locale)}
          </AppText>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <AppText variant="caption" color={Colors.textMuted}>
            {startDate} – {endDate}
          </AppText>
          <AppButton label={t('donations.donate')} onPress={handlePress} variant="secondary" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.textInverse,
    overflow: 'hidden',
  },
  leftBorder: {
    width: 4,
    backgroundColor: Colors.gold,
  },
  body: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  desc: {
    marginBottom: 2,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.cream2,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.gold,
    borderRadius: Radius.full,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
});

export default React.memo(FundCard);
