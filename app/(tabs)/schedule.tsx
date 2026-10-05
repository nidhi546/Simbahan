import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, ListRenderItemInfo, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import WebLayout from '../../components/ui/WebLayout';
import massSchedule from '../../data/massSchedule.json';
import { useI18n } from '../../i18n';

type MassDay = (typeof massSchedule)[0];

const Fonts = {
  heading: 'PlayfairDisplay_700Bold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
} as const;

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const isWeb = Platform.OS === 'web';

export default function ScheduleScreen() {
  const { isWeb: isWebBreakpoint } = useBreakpoint();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { t, language } = useI18n();

  const selectedDay = useMemo(() => {
    return DAYS[new Date(selectedDate + 'T00:00:00').getDay()];
  }, [selectedDate]);

  const daySchedule = useMemo(
    () => massSchedule.find((d) => d.day === selectedDay),
    [selectedDay]
  );

  const renderTime = useCallback(
    ({ item }: ListRenderItemInfo<string>) => (
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{item}</Text>
        <Text style={styles.massLabel}>{t('massSchedule.holyMass')}</Text>
      </View>
    ),
    [t]
  );

  const dayMassesLabel = t('massSchedule.dayMasses', {
    day: t(`massSchedule.${selectedDay.toLowerCase()}`),
  });

  const calendarTheme = {
    backgroundColor: Colors.cream,
    calendarBackground: Colors.cream,
    selectedDayBackgroundColor: Colors.navy,
    selectedDayTextColor: Colors.textInverse,
    todayTextColor: Colors.gold,
    arrowColor: Colors.navy,
    textDayFontFamily: Fonts.body,
    textMonthFontFamily: Fonts.heading,
    textDayHeaderFontFamily: Fonts.bodyMedium,
  };

  const webContent = (
    <View style={styles.webLayout}>
      <View style={styles.webLeft}>
        <Text style={styles.webHeading}>{t('massSchedule.title')}</Text>
        <View style={styles.calendarCard}>
          <Calendar
            key={language}
            onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
            markedDates={{ [selectedDate]: { selected: true, selectedColor: Colors.navy } }}
            theme={calendarTheme}
          />
        </View>
      </View>
      <View style={styles.webRight}>
        <Text style={styles.webSubHeading}>{dayMassesLabel}</Text>
        {daySchedule ? (
          <FlatList
            data={daySchedule.times}
            renderItem={renderTime}
            keyExtractor={(t) => t}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>{t('massSchedule.noMasses')}</Text>
        )}
      </View>
    </View>
  );

  const mobileContent = (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.mobileHeader}>
        <Text style={styles.mobileHeading}>{t('massSchedule.title')}</Text>
      </View>
      <Calendar
        key={language}
        onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: Colors.navy } }}
        theme={calendarTheme}
      />
      <View style={styles.mobileBody}>
        <Text style={styles.mobileSubHeading}>{dayMassesLabel}</Text>
        {daySchedule ? (
          <FlatList
            data={daySchedule.times}
            renderItem={renderTime}
            keyExtractor={(t) => t}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>{t('massSchedule.noMasses')}</Text>
        )}
      </View>
    </ScrollView>
  );

  if (isWeb) {
    return (
      <WebLayout>
        <View style={styles.screen}>{webContent}</View>
      </WebLayout>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {mobileContent}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.textInverse,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
  },
  timeText: { fontFamily: 'DMSans_500Medium', color: Colors.navy, fontSize: 15 },
  massLabel: { fontFamily: 'DMSans_400Regular', color: '#6B7280', fontSize: 13, marginLeft: 8 },
  emptyText: { fontFamily: 'DMSans_400Regular', color: '#6B7280' },
  webLayout: { flexDirection: 'row', flex: 1, paddingHorizontal: 32, paddingTop: 16 },
  webLeft: { flex: 1, marginRight: 24 },
  webRight: { flex: 1, paddingTop: 64 },
  webHeading: { fontFamily: 'PlayfairDisplay_700Bold', color: Colors.textPrimary, fontSize: 32, marginBottom: 16 },
  webSubHeading: { fontFamily: 'PlayfairDisplay_700Bold', color: Colors.textPrimary, fontSize: 20, marginBottom: 12 },
  calendarCard: { backgroundColor: Colors.textInverse, borderRadius: 16, overflow: 'hidden' },
  mobileHeader: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  mobileHeading: { fontFamily: 'PlayfairDisplay_700Bold', color: Colors.textPrimary, fontSize: 26 },
  mobileBody: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.xxl },
  mobileSubHeading: { fontFamily: 'PlayfairDisplay_700Bold', color: Colors.textPrimary, fontSize: 18, marginBottom: 12 },
});
