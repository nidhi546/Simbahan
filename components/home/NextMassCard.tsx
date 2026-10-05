import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius, Shadows } from '../../constants/Layout';
import { AppText, Badge } from '../ui';
import { useChurchStore } from '../../store/churchStore';
import { useI18n } from '../../i18n';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getNextMass(schedule: { day: string; times: string[]; dayIndex: number }[]): {
  time: string;
  day: string;
} {
  const now = new Date();
  const todayIdx = now.getDay();
  const todayEntry = schedule.find((s) => s.dayIndex === todayIdx);

  if (todayEntry) {
    for (const t of todayEntry.times) {
      const [timePart, period] = t.split(' ');
      const [h, m] = timePart.split(':').map(Number);
      let hour = h;
      if (period === 'PM' && h !== 12) hour += 12;
      if (period === 'AM' && h === 12) hour = 0;
      if (hour > now.getHours() || (hour === now.getHours() && (m ?? 0) > now.getMinutes())) {
        return { time: t, day: todayEntry.day };
      }
    }
  }

  // Find next day with masses
  for (let i = 1; i <= 7; i++) {
    const nextIdx = (todayIdx + i) % 7;
    const entry = schedule.find((s) => s.dayIndex === nextIdx);
    if (entry && entry.times.length > 0) {
      return { time: entry.times[0], day: entry.day };
    }
  }

  return { time: '7:00 AM', day: 'Sunday' };
}

const NextMassCard = () => {
  const massSchedule = useChurchStore((s) => s.massSchedule);
  const { t } = useI18n();

  const { time, day } = useMemo(() => getNextMass(massSchedule as any), [massSchedule]);

  const handlePress = useCallback(() => router.push('/(tabs)/schedule' as never), []);

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible
      accessibilityLabel={t('home.viewMassScheduleA11y')}
      activeOpacity={0.85}
      style={styles.card}
    >
      <View style={styles.leftBorder} />
      <View style={styles.content}>
        <AppText variant="label" color={Colors.gold} style={styles.label}>
          {t('home.nextMassLabel')}
        </AppText>
        <AppText variant="displayMd" color={Colors.navy} style={styles.time}>
          {time}
        </AppText>
        <View style={styles.row}>
          <Badge label={DAYS.includes(day) ? t(`massSchedule.${day.toLowerCase()}`) : day} variant="navy" size="sm" />
          <AppText variant="bodySm" color={Colors.textMuted} style={styles.presider}>
            Fr. Jose Maria Santos
          </AppText>
        </View>
      </View>
      <View style={styles.linkWrap}>
        <AppText variant="label" color={Colors.gold}>{t('home.seeAll')}</AppText>
        <Ionicons name="arrow-forward" size={14} color={Colors.gold} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.md,
    marginTop: -Spacing.md,
    marginHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...(Shadows.md as object),
  },
  leftBorder: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: Colors.gold,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  label: { letterSpacing: 1 },
  time: { lineHeight: 34 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  presider: { flexShrink: 1 },
  linkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: Spacing.md,
  },
});

export default React.memo(NextMassCard);
