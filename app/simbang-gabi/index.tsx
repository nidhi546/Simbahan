import React, { useState, useCallback, useMemo } from 'react';
import {
  View, ScrollView, TouchableOpacity, Modal,
  StyleSheet, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GradientView from '../../components/ui/GradientView';
import AppText from '../../components/ui/AppText';
import AppButton from '../../components/ui/AppButton';
import BackBar from '../../components/ui/BackBar';
import WebLayout from '../../components/ui/WebLayout';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useModule09Store } from '../../store/module09Store';
import { useUiStore } from '../../store/uiStore';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';

const DAYS_DATA = [
  { day: 1, dateNum: 16, gospelBookKey: 'simbangGabi.books.luke', gospelRef: '1:26-38', celebrationKey: 'simbangGabi.celebrations.day1' },
  { day: 2, dateNum: 17, gospelBookKey: 'simbangGabi.books.matthew', gospelRef: '1:1-17', celebrationKey: 'simbangGabi.celebrations.day2' },
  { day: 3, dateNum: 18, gospelBookKey: 'simbangGabi.books.matthew', gospelRef: '1:18-24', celebrationKey: 'simbangGabi.celebrations.day3' },
  { day: 4, dateNum: 19, gospelBookKey: 'simbangGabi.books.luke', gospelRef: '1:5-25', celebrationKey: 'simbangGabi.celebrations.day4' },
  { day: 5, dateNum: 20, gospelBookKey: 'simbangGabi.books.luke', gospelRef: '1:26-38', celebrationKey: 'simbangGabi.celebrations.day5' },
  { day: 6, dateNum: 21, gospelBookKey: 'simbangGabi.books.luke', gospelRef: '1:39-45', celebrationKey: 'simbangGabi.celebrations.day6' },
  { day: 7, dateNum: 22, gospelBookKey: 'simbangGabi.books.luke', gospelRef: '1:46-56', celebrationKey: 'simbangGabi.celebrations.day7' },
  { day: 8, dateNum: 23, gospelBookKey: 'simbangGabi.books.luke', gospelRef: '1:57-66', celebrationKey: 'simbangGabi.celebrations.day8' },
  { day: 9, dateNum: 24, gospelBookKey: 'simbangGabi.books.luke', gospelRef: '1:67-79', celebrationKey: 'simbangGabi.celebrations.day9' },
];

const FOODS = [
  { name: 'Puto Bumbong', icon: '🟣', descKey: 'simbangGabi.foods.putoBumbong' },
  { name: 'Bibingka',     icon: '🟡', descKey: 'simbangGabi.foods.bibingka' },
  { name: 'Hot Choco',    icon: '🍫', descKey: 'simbangGabi.foods.hotChoco' },
];

export default function SimbangGabiScreen() {
  const { t } = useI18n();
  const attendedDays = useModule09Store((s) => s.simbangGabi.attendedDays);
  const checkIn = useModule09Store((s) => s.checkInSimbangGabi);
  const showToast = useUiStore((s) => s.showToast);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showComplete, setShowComplete] = useState(false);

  const isComplete = attendedDays.length === 9;
  const activeDay = useMemo(() => {
    for (let i = 1; i <= 9; i++) {
      if (!attendedDays.includes(i)) return i;
    }
    return 9;
  }, [attendedDays]);

  const handleCheckIn = useCallback(() => {
    if (!selectedDay) return;
    checkIn(selectedDay);
    showToast(t('simbangGabi.checkedInToast', { day: selectedDay }), 'success');
    if (attendedDays.length + 1 === 9) setShowComplete(true);
    setSelectedDay(null);
  }, [selectedDay, checkIn, showToast, attendedDays.length, t]);

  const dayInfo = selectedDay ? DAYS_DATA.find((d) => d.day === selectedDay) : null;

  const content = (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <BackBar />
      {/* Header */}
      <GradientView colors={[Colors.navyDark, Colors.navy]} style={styles.header}>
        <View style={styles.starsRow}>
          {['✦','✧','✦','✧','✦'].map((s, i) => (
            <AppText key={i} variant="caption" color={Colors.goldLight}>{s}</AppText>
          ))}
        </View>
        <AppText variant="displaySm" color={Colors.textInverse}>Simbang Gabi</AppText>
        <AppText variant="bodySm" color={Colors.goldLight}>
          {t('simbangGabi.attendedCount', { count: attendedDays.length })}
        </AppText>
      </GradientView>

      {/* 9-day grid */}
      <View style={styles.section}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.sectionTitle}>{t('simbangGabi.tracker')}</AppText>
        <View style={styles.grid}>
          {DAYS_DATA.map(({ day, dateNum }) => {
            const date = t('simbangGabi.dateDec', { day: dateNum });
            const done = attendedDays.includes(day);
            const isActive = day === activeDay && !done;
            return (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDay(day)}
                style={[
                  styles.dayCell,
                  done && styles.dayCellDone,
                  isActive && styles.dayCellActive,
                  selectedDay === day && styles.dayCellSelected,
                ]}
                accessible
                accessibilityLabel={t('simbangGabi.dayCellA11y', { day, date })}
              >
                {done ? (
                  <Ionicons name="checkmark-circle" size={22} color={Colors.textInverse} />
                ) : (
                  <AppText variant="headingSm" color={isActive ? Colors.navyDark : Colors.textMuted}>
                    {day}
                  </AppText>
                )}
                <AppText
                  variant="caption"
                  color={done ? Colors.textInverse : isActive ? Colors.navyDark : Colors.textMuted}
                >
                  {date}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Day detail */}
      {dayInfo && (
        <View style={styles.card}>
          <AppText variant="headingSm" color={Colors.navy}>
            {t('simbangGabi.dayTitle', { day: dayInfo.day, date: t('simbangGabi.dateDec', { day: dayInfo.dateNum }) })}
          </AppText>
          <AppText variant="bodyMd" color={Colors.textSecondary}>{t(dayInfo.celebrationKey)}</AppText>
          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={14} color={Colors.gold} />
            <AppText variant="bodySm" color={Colors.textMuted} style={{ marginLeft: 4 }}>
              {t('simbangGabi.gospel', { ref: `${t(dayInfo.gospelBookKey)} ${dayInfo.gospelRef}` })}
            </AppText>
          </View>
          <AppText variant="bodySm" color={Colors.textMuted}>
            {t('simbangGabi.massInfo')}
          </AppText>
          {!attendedDays.includes(dayInfo.day) ? (
            <AppButton label={t('simbangGabi.checkInDay', { day: dayInfo.day })} onPress={handleCheckIn} />
          ) : (
            <View style={styles.checkedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.sage} />
              <AppText variant="label" color={Colors.sage}>{t('simbangGabi.checkedIn')}</AppText>
            </View>
          )}
        </View>
      )}

      {/* Food section */}
      <View style={styles.section}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.sectionTitle}>
          {t('simbangGabi.foodTitle')}
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.foodRow}>
          {FOODS.map((f) => (
            <View key={f.name} style={styles.foodCard}>
              <AppText style={styles.foodIcon}>{f.icon}</AppText>
              <AppText variant="headingSm" color={Colors.navy}>{f.name}</AppText>
              <AppText variant="caption" color={Colors.textMuted}>{t(f.descKey)}</AppText>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );

  return (
    <>
      {isWeb ? (
        <WebLayout>{content}</WebLayout>
      ) : (
        <SafeAreaView style={styles.screen} edges={['top']}>{content}</SafeAreaView>
      )}

      {/* Completion overlay */}
      <Modal visible={showComplete} transparent animationType="fade" onRequestClose={() => setShowComplete(false)}>
        <View style={styles.completionOverlay}>
          <View style={styles.completionCard}>
            <AppText style={styles.completionStars}>✦ ✧ ✦ ✧ ✦</AppText>
            <Ionicons name="star" size={64} color={Colors.gold} />
            <AppText variant="displaySm" color={Colors.navy} style={{ textAlign: 'center' }}>
              {t('simbangGabi.congrats')}
            </AppText>
            <AppText variant="bodyMd" color={Colors.textSecondary} style={{ textAlign: 'center' }}>
              {t('simbangGabi.completeMessage')}
            </AppText>
            <AppButton label={t('simbangGabi.share')} onPress={() => setShowComplete(false)} />
            <TouchableOpacity onPress={() => setShowComplete(false)} accessible accessibilityLabel={t('simbangGabi.close')}>
              <AppText variant="bodySm" color={Colors.textMuted}>{t('simbangGabi.close')}</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingBottom: Spacing.xxl },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xl, gap: 4, alignItems: 'center' },
  starsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xs },
  section: { padding: Spacing.md, gap: Spacing.sm },
  sectionTitle: { marginBottom: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dayCell: {
    width: '30%',
    aspectRatio: 1.2,
    backgroundColor: Colors.cream2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayCellDone: { backgroundColor: Colors.sage, borderColor: Colors.sage },
  dayCellActive: { backgroundColor: Colors.goldPale, borderColor: Colors.gold, borderWidth: 2 },
  dayCellSelected: { borderColor: Colors.navy, borderWidth: 2 },
  card: {
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  checkedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.sagePale,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  foodRow: { gap: Spacing.md, paddingVertical: Spacing.xs },
  foodCard: {
    width: 140,
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 4,
    alignItems: 'center',
  },
  foodIcon: { fontSize: 36 },
  completionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  completionCard: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
    maxWidth: 360,
  },
  completionStars: { fontSize: 24, color: Colors.gold, letterSpacing: 8 },
});
