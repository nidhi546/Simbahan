import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText } from '../../components/ui';
import WebLayout from '../../components/ui/WebLayout';
import LiturgicalCalendarView from '../../components/calendar/LiturgicalCalendarView';
import TodayReadings from '../../components/calendar/TodayReadings';
import { useUiStore } from '../../store/uiStore';
import { useI18n } from '../../i18n';

type Tab = 'kalendaryo' | 'pagbasa';

const TABS: { key: Tab; labelKey: string }[] = [
  { key: 'kalendaryo', labelKey: 'calendar.tabCalendar' },
  { key: 'pagbasa', labelKey: 'calendar.tabReadings' },
];

const isWeb = Platform.OS === 'web';

export default function CalendarScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('kalendaryo');
  const handleTab = useCallback((key: Tab) => setActiveTab(key), []);
  const openSidebar = useUiStore((s) => s.openSidebar);
  const { t } = useI18n();

  const header = (
    <View style={styles.switcherWrap}>
      {!isWeb && (
        <TouchableOpacity
          onPress={openSidebar}
          style={styles.menuBtn}
          activeOpacity={0.7}
          accessible
          accessibilityLabel={t('nav.openMenu')}
        >
          <Ionicons name="menu" size={24} color={Colors.navy} />
        </TouchableOpacity>
      )}
      <View style={styles.switcher}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => handleTab(tab.key)}
              accessible
              accessibilityLabel={t(tab.labelKey)}
              accessibilityRole="tab"
              activeOpacity={0.8}
              style={[styles.switcherBtn, active && styles.switcherBtnActive]}
            >
              <AppText
                variant="label"
                color={active ? Colors.textInverse : Colors.textMuted}
                style={styles.switcherLabel}
              >
                {t(tab.labelKey)}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const content = (
    <View style={styles.screen}>
      {header}
      <View style={styles.content}>
        {activeTab === 'kalendaryo' ? <LiturgicalCalendarView /> : <TodayReadings />}
      </View>
    </View>
  );

  if (isWeb) return <WebLayout>{content}</WebLayout>;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {header}
      <View style={styles.content}>
        {activeTab === 'kalendaryo' ? <LiturgicalCalendarView /> : <TodayReadings />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  switcherWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  menuBtn: { padding: Spacing.xs },
  switcher: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.cream2,
    borderRadius: Radius.md,
    padding: 3,
    height: 38,
  },
  switcherBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  switcherBtnActive: { backgroundColor: Colors.navy },
  switcherLabel: { fontSize: 12 },
  content: { flex: 1 },
});
