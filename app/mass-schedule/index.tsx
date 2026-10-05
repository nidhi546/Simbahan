import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GradientView from '../../components/ui/GradientView';
import AppText from '../../components/ui/AppText';
import BackBar from '../../components/ui/BackBar';
import WebLayout from '../../components/ui/WebLayout';
import MassRow from '../../components/mass/MassRow';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import massScheduleData from '../../data/massSchedule.json';
import confessionData from '../../data/confessionSchedule.json';
import { useI18n } from '../../i18n';

const TABS = ['Regular', 'Special', 'Confession'] as const;
type Tab = typeof TABS[number];

const TAB_LABEL_KEYS: Record<Tab, string> = {
  Regular: 'massSchedule.tabs.regular',
  Special: 'massSchedule.tabs.special',
  Confession: 'massSchedule.tabs.confession',
};

const PRESIDERS: Record<string, string> = {
  Sunday: 'Fr. Jose Maria Santos',
  Saturday: 'Fr. Roberto Cruz',
};

const SPECIAL_MASSES = [
  {
    eventKey: 'massSchedule.special.ashWednesday',
    dateKey: 'massSchedule.special.ashWednesdayDate',
    times: ['6:00 AM', '12:00 NN', '6:00 PM'],
    languages: ['Filipino', 'Filipino', 'Filipino'],
    fasting: true,
  },
  {
    eventKey: 'massSchedule.special.goodFriday',
    dateKey: 'massSchedule.special.goodFridayDate',
    times: ['9:00 AM', '3:00 PM'],
    languages: ['Filipino', 'Filipino'],
    fasting: true,
  },
];

const DAY_GROUPS = [
  { label: 'LINGGO', labelKey: 'massSchedule.groups.sunday', subtitleKey: 'massSchedule.groups.sundaySub', ids: ['ms_001'] },
  { label: 'SABADO', labelKey: 'massSchedule.groups.saturday', subtitleKey: 'massSchedule.groups.saturdaySub', ids: ['ms_007'] },
  {
    label: 'ARAW NG LINGGO', labelKey: 'massSchedule.groups.weekdays', subtitleKey: 'massSchedule.groups.weekdaysSub',
    ids: ['ms_002', 'ms_003', 'ms_004', 'ms_005', 'ms_006'],
  },
];

const isWeb = Platform.OS === 'web';

export default function MassScheduleScreen() {
  const [tab, setTab] = useState<Tab>('Regular');
  const { t } = useI18n();

  const renderRegular = useCallback(() => (
    <View style={styles.section}>
      {DAY_GROUPS.map((group) => {
        const entries = massScheduleData.filter((m) => group.ids.includes(m.id));
        const allTimes = entries.flatMap((e) =>
          e.times.map((t, i) => ({ time: t, language: e.language[i] ?? 'Filipino', day: e.day, note: e.notes }))
        );
        return (
          <View key={group.label} style={styles.groupBlock}>
            <View style={styles.dayHeader}>
              <AppText variant="label" color={Colors.navy} style={styles.dayLabel}>
                {t(group.labelKey)}
              </AppText>
              <View style={styles.goldLine} />
              <AppText variant="caption" color={Colors.textMuted}>{t(group.subtitleKey)}</AppText>
            </View>
            <View style={styles.rows}>
              {allTimes.map((item, i) => (
                <MassRow
                  key={`${group.label}-${i}`}
                  time={item.time}
                  language={item.language}
                  presider={PRESIDERS[item.day]}
                  note={item.note || undefined}
                />
              ))}
            </View>
          </View>
        );
      })}

      {/* Notice */}
      <View style={styles.noticeCard}>
        <Ionicons name="information-circle-outline" size={18} color={Colors.navy} />
        <AppText variant="bodySm" color={Colors.textSecondary} style={styles.noticeText}>
          {t('massSchedule.notice')}
        </AppText>
      </View>
    </View>
  ), [t]);

  const renderSpecial = useCallback(() => (
    <View style={styles.section}>
      {SPECIAL_MASSES.map((s) => (
        <View key={s.eventKey} style={styles.groupBlock}>
          {s.fasting && (
            <View style={styles.fastingAlert}>
              <Ionicons name="warning-outline" size={14} color={Colors.textInverse} />
              <AppText variant="caption" color={Colors.textInverse} style={{ marginLeft: 4 }}>
                {t('massSchedule.fastingAbstinenceDay')}
              </AppText>
            </View>
          )}
          <View style={styles.specialCard}>
            <AppText variant="headingSm" color={Colors.crimson}>{t(s.eventKey)}</AppText>
            <View style={styles.dateBadge}>
              <AppText variant="caption" color={Colors.navy}>{t(s.dateKey)}</AppText>
            </View>
            <View style={styles.rows}>
              {s.times.map((t, i) => (
                <MassRow key={i} time={t} language={s.languages[i]} />
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  ), [t]);

  const renderConfession = useCallback(() => (
    <View style={styles.section}>
      {confessionData.map((c) => (
        <View key={c.id} style={styles.confessionRow}>
          <View style={styles.confessionLeft}>
            <AppText variant="headingSm" color={Colors.navy}>{c.day}</AppText>
            <AppText variant="bodySm" color={Colors.textMuted}>{c.time}</AppText>
          </View>
          <AppText variant="bodySm" color={Colors.textSecondary} numberOfLines={1} style={styles.confessionPriest}>
            {c.priest}
          </AppText>
        </View>
      ))}

      {/* Appointment card */}
      <View style={styles.appointmentCard}>
        <Ionicons name="call-outline" size={20} color={Colors.gold} />
        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
          <AppText variant="headingSm" color={Colors.navy}>{t('massSchedule.requestAppointment')}</AppText>
          <AppText variant="bodySm" color={Colors.textSecondary}>
            {t('massSchedule.appointmentHint')}
          </AppText>
        </View>
      </View>
    </View>
  ), [t]);

  const content = (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <BackBar />
      <GradientView colors={[Colors.navyDark, Colors.navy]} style={styles.header}>
        <AppText variant="displaySm" color={Colors.textInverse}>{t('massSchedule.title')}</AppText>
        <AppText variant="bodySm" color={Colors.goldLight}>{t('massSchedule.subtitle')}</AppText>
      </GradientView>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tabKey) => (
          <TouchableOpacity
            key={tabKey}
            onPress={() => setTab(tabKey)}
            style={[styles.tabBtn, tab === tabKey && styles.tabBtnActive]}
            accessible
            accessibilityLabel={t(TAB_LABEL_KEYS[tabKey])}
          >
            <AppText
              variant="label"
              color={tab === tabKey ? Colors.navy : Colors.textMuted}
            >
              {t(TAB_LABEL_KEYS[tabKey])}
            </AppText>
            {tab === tabKey && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'Regular' && renderRegular()}
      {tab === 'Special' && renderSpecial()}
      {tab === 'Confession' && renderConfession()}
    </ScrollView>
  );

  if (isWeb) return <WebLayout>{content}</WebLayout>;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  scrollContent: { paddingBottom: Spacing.xxl },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: 4,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.textInverse,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    position: 'relative',
  },
  tabBtnActive: {},
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: Colors.navy,
    borderRadius: 1,
  },
  section: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  groupBlock: { gap: Spacing.sm },
  dayHeader: { gap: 4 },
  dayLabel: { letterSpacing: 1 },
  goldLine: {
    height: 2,
    width: 32,
    backgroundColor: Colors.gold,
    borderRadius: 1,
  },
  rows: { gap: Spacing.sm },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.textInverse,
  },
  noticeText: { flex: 1 },
  fastingAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.crimson,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  specialCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    backgroundColor: Colors.textInverse,
    gap: Spacing.sm,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.cream2,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  confessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    backgroundColor: Colors.textInverse,
  },
  confessionLeft: { flex: 1, gap: 2 },
  confessionPriest: { flex: 1, textAlign: 'right' },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldPale,
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
});
