import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppText from '../../components/ui/AppText';
import WebLayout from '../../components/ui/WebLayout';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';

const mysteryKeys = (set: string) => [1, 2, 3, 4, 5].map((n) => `rosary.${set}.m${n}`);
const MYSTERY_SETS = {
  glorious:  { labelKey: 'rosary.glorious.label',  mysteryKeys: mysteryKeys('glorious') },
  joyful:    { labelKey: 'rosary.joyful.label',    mysteryKeys: mysteryKeys('joyful') },
  sorrowful: { labelKey: 'rosary.sorrowful.label', mysteryKeys: mysteryKeys('sorrowful') },
  luminous:  { labelKey: 'rosary.luminous.label',  mysteryKeys: mysteryKeys('luminous') },
};

const MYSTERIES: Record<string, { labelKey: string; mysteryKeys: string[] }> = {
  Sunday:    MYSTERY_SETS.glorious,
  Monday:    MYSTERY_SETS.joyful,
  Tuesday:   MYSTERY_SETS.sorrowful,
  Wednesday: MYSTERY_SETS.glorious,
  Thursday:  MYSTERY_SETS.luminous,
  Friday:    MYSTERY_SETS.sorrowful,
  Saturday:  MYSTERY_SETS.joyful,
};

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const today = DAYS[new Date().getDay()];

const SECTIONS = [
  { id: 'opening', labelKey: 'rosary.sectionOpening', contentKey: 'rosary.sectionOpeningContent' },
  { id: 'decades', labelKey: 'rosary.sectionDecades', contentKey: 'rosary.sectionDecadesContent' },
  { id: 'closing', labelKey: 'rosary.sectionClosing', contentKey: 'rosary.sectionClosingContent' },
];

function AccordionSection({ label, content }: { label: string; content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.accordion}>
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        style={styles.accordionHeader}
        accessible
        accessibilityLabel={label}
      >
        <AppText variant="headingSm" color={Colors.navy} style={{ flex: 1 }}>{label}</AppText>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
      </TouchableOpacity>
      {open && (
        <View style={styles.accordionBody}>
          <AppText variant="bodyMd" color={Colors.textSecondary}>{content}</AppText>
        </View>
      )}
    </View>
  );
}

export default function RosaryScreen() {
  const { t } = useI18n();
  const [selectedDay, setSelectedDay] = useState(today);
  const mystery = MYSTERIES[selectedDay];

  const content = (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessible accessibilityLabel={t('common.back')}>
          <Ionicons name="arrow-back" size={20} color={Colors.navy} />
        </TouchableOpacity>
        <View>
          <AppText variant="displaySm" color={Colors.navy}>{t('rosary.title')}</AppText>
          <AppText variant="bodySm" color={Colors.textMuted}>{t('rosary.subtitle')}</AppText>
        </View>
      </View>

      {/* Day picker */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayRow}>
        {DAYS.map((d) => (
          <TouchableOpacity
            key={d}
            onPress={() => setSelectedDay(d)}
            style={[styles.dayChip, selectedDay === d && styles.dayChipActive]}
            accessible
            accessibilityLabel={t(`rosary.days.${d.toLowerCase()}`)}
          >
            <AppText variant="label" color={selectedDay === d ? Colors.textInverse : Colors.textMuted}>
              {t(`rosary.daysShort.${d.toLowerCase()}`)}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Mystery */}
      <View style={styles.mysteryCard}>
        <View style={styles.mysteryHeader}>
          <Ionicons name="ellipse-outline" size={20} color={Colors.gold} />
          <AppText variant="headingMd" color={Colors.navy}>{t(mystery.labelKey)}</AppText>
        </View>
        {mystery.mysteryKeys.map((m, i) => (
          <View key={m} style={styles.mysteryRow}>
            <View style={styles.mysteryNum}>
              <AppText variant="label" color={Colors.textInverse}>{i + 1}</AppText>
            </View>
            <AppText variant="bodyMd" color={Colors.textPrimary}>{t(m)}</AppText>
          </View>
        ))}
      </View>

      {/* Accordion sections */}
      <View style={styles.section}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.sectionTitle}>{t('rosary.partsTitle')}</AppText>
        {SECTIONS.map((s) => (
          <AccordionSection key={s.id} label={t(s.labelKey)} content={t(s.contentKey)} />
        ))}
      </View>
    </ScrollView>
  );

  if (isWeb) return <WebLayout>{content}</WebLayout>;
  return <SafeAreaView style={styles.screen} edges={['top']}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingBottom: Spacing.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.textInverse,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: Spacing.xs },
  dayRow: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.sm },
  dayChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.cream2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayChipActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  mysteryCard: {
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    margin: Spacing.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  mysteryHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs },
  mysteryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 2 },
  mysteryNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { padding: Spacing.md, gap: Spacing.sm },
  sectionTitle: { marginBottom: 4 },
  accordion: {
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  accordionBody: {
    padding: Spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
