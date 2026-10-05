import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GradientView from '../../components/ui/GradientView';
import AppText from '../../components/ui/AppText';
import BackBar from '../../components/ui/BackBar';
import WebLayout from '../../components/ui/WebLayout';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useUiStore } from '../../store/uiStore';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';

const HOLY_DAYS = [
  {
    id: 'palm',
    dayKey: 'holyWeek.palm.day',
    altNameKey: 'holyWeek.palm.altName',
    color: Colors.sage,
    fasting: false,
    descriptionKey: 'holyWeek.palm.description',
    scheduleKey: 'holyWeek.palm.schedule',
    traditionsKey: 'holyWeek.palm.traditions',
  },
  {
    id: 'thursday',
    dayKey: 'holyWeek.thursday.day',
    altNameKey: 'holyWeek.thursday.altName',
    color: Colors.gold,
    fasting: false,
    descriptionKey: 'holyWeek.thursday.description',
    scheduleKey: 'holyWeek.thursday.schedule',
    traditionsKey: 'holyWeek.thursday.traditions',
  },
  {
    id: 'friday',
    dayKey: 'holyWeek.friday.day',
    altNameKey: 'holyWeek.friday.altName',
    color: Colors.crimson,
    fasting: true,
    descriptionKey: 'holyWeek.friday.description',
    scheduleKey: 'holyWeek.friday.schedule',
    traditionsKey: 'holyWeek.friday.traditions',
  },
  {
    id: 'saturday',
    dayKey: 'holyWeek.saturday.day',
    altNameKey: 'holyWeek.saturday.altName',
    color: Colors.textMuted,
    fasting: false,
    descriptionKey: 'holyWeek.saturday.description',
    scheduleKey: 'holyWeek.saturday.schedule',
    traditionsKey: 'holyWeek.saturday.traditions',
  },
  {
    id: 'easter',
    dayKey: 'holyWeek.easter.day',
    altNameKey: 'holyWeek.easter.altName',
    color: Colors.sage,
    fasting: false,
    descriptionKey: 'holyWeek.easter.description',
    scheduleKey: 'holyWeek.easter.schedule',
    traditionsKey: 'holyWeek.easter.traditions',
  },
];

const CHURCHES = [
  'Quiapo Church (Minor Basilica of the Black Nazarene)',
  'San Sebastian Basilica',
  'San Agustin Church (Intramuros)',
  'Manila Cathedral',
  'Malate Church',
  'Paco Church',
  'Ermita Church',
];

const VISITA_PRAYER_KEY = 'holyWeek.visitaPrayer';

function HolyDayCard({ item }: { item: typeof HOLY_DAYS[number] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.dayCard}>
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        style={styles.dayHeader}
        accessible
        accessibilityLabel={t(item.dayKey)}
      >
        <View style={[styles.dayDot, { backgroundColor: item.color }]} />
        <View style={{ flex: 1 }}>
          <AppText variant="headingSm" color={Colors.navy}>{t(item.dayKey)}</AppText>
          <AppText variant="caption" color={Colors.textMuted}>{t(item.altNameKey)}</AppText>
        </View>
        {item.fasting && (
          <View style={styles.fastingBadge}>
            <AppText variant="caption" color={Colors.crimson}>{t('holyWeek.fasting')}</AppText>
          </View>
        )}
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
      </TouchableOpacity>
      {open && (
        <View style={styles.dayBody}>
          <AppText variant="bodyMd" color={Colors.textSecondary}>{t(item.descriptionKey)}</AppText>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color={Colors.gold} />
            <AppText variant="bodySm" color={Colors.textPrimary} style={{ flex: 1 }}>{t(item.scheduleKey)}</AppText>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="star-outline" size={14} color={Colors.gold} />
            <AppText variant="bodySm" color={Colors.textPrimary} style={{ flex: 1 }}>{t(item.traditionsKey)}</AppText>
          </View>
        </View>
      )}
    </View>
  );
}

export default function HolyWeekScreen() {
  const { t } = useI18n();
  const showToast = useUiStore((s) => s.showToast);
  const [visitaStarted, setVisitaStarted] = useState(false);

  const handleVisita = useCallback(() => {
    setVisitaStarted(true);
    showToast(t('holyWeek.visitaToast'), 'info');
  }, [showToast, t]);

  const content = (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <BackBar />
      <GradientView colors={[Colors.crimson, Colors.navy]} style={styles.header}>
        <AppText variant="displaySm" color={Colors.textInverse}>{t('holyWeek.title')}</AppText>
        <AppText variant="bodySm" color="rgba(255,255,255,0.75)">{t('holyWeek.subtitle')}</AppText>
      </GradientView>

      {/* Timeline */}
      <View style={styles.section}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.sectionTitle}>
          {t('holyWeek.daysTitle')}
        </AppText>
        <View style={styles.timeline}>
          {HOLY_DAYS.map((d, i) => (
            <View key={d.id} style={styles.timelineItem}>
              {i < HOLY_DAYS.length - 1 && <View style={styles.timelineLine} />}
              <HolyDayCard item={d} />
            </View>
          ))}
        </View>
      </View>

      {/* Visita Iglesia */}
      <View style={styles.section}>
        <View style={styles.visitaCard}>
          <View style={styles.visitaHeader}>
            <Ionicons name="navigate-outline" size={20} color={Colors.crimson} />
            <AppText variant="headingSm" color={Colors.crimson}>Visita Iglesia</AppText>
          </View>
          <AppText variant="bodySm" color={Colors.textSecondary}>
            {t('holyWeek.visitaDescription')}
          </AppText>
          <View style={styles.churchList}>
            {CHURCHES.map((c, i) => (
              <View key={c} style={styles.churchRow}>
                <View style={styles.churchNum}>
                  <AppText variant="label" color={Colors.textInverse}>{i + 1}</AppText>
                </View>
                <AppText variant="bodySm" color={Colors.textPrimary} style={{ flex: 1 }}>{c}</AppText>
              </View>
            ))}
          </View>
          {visitaStarted && (
            <View style={styles.visitaPrayer}>
              <AppText variant="caption" color={Colors.gold}>{t('holyWeek.prayer')}</AppText>
              <AppText variant="bodySm" color={Colors.textSecondary} style={{ fontStyle: 'italic' }}>
                {t(VISITA_PRAYER_KEY)}
              </AppText>
            </View>
          )}
          <TouchableOpacity
            onPress={handleVisita}
            style={styles.visitaBtn}
            accessible
            accessibilityLabel={t('holyWeek.startVisitaA11y')}
          >
            <Ionicons name="walk-outline" size={18} color={Colors.textInverse} />
            <AppText variant="label" color={Colors.textInverse}>
              {visitaStarted ? t('holyWeek.inProgress') : t('holyWeek.startVisita')}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  if (isWeb) return <WebLayout>{content}</WebLayout>;
  return <SafeAreaView style={styles.screen} edges={['top']}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingBottom: Spacing.xxl },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xl, gap: 4 },
  section: { padding: Spacing.md, gap: Spacing.sm },
  sectionTitle: { marginBottom: 4 },
  timeline: { gap: Spacing.sm },
  timelineItem: { position: 'relative' },
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 44,
    bottom: -Spacing.sm,
    width: 2,
    backgroundColor: Colors.border,
    zIndex: 0,
  },
  dayCard: {
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  dayDot: { width: 12, height: 12, borderRadius: 6 },
  fastingBadge: {
    borderWidth: 1,
    borderColor: Colors.crimson,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  dayBody: {
    padding: Spacing.md,
    paddingTop: 0,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs },
  visitaCard: {
    backgroundColor: Colors.crimsonPale,
    borderWidth: 1,
    borderColor: Colors.crimson + '44',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  visitaHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  churchList: { gap: Spacing.xs },
  churchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  churchNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitaPrayer: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    gap: 4,
  },
  visitaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.crimson,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 2,
    marginTop: Spacing.xs,
  },
});
