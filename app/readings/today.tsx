import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ScreenHeader } from '../../components/ui';
import TodayReadings from '../../components/calendar/TodayReadings';
import { useI18n } from '../../i18n';

export default function TodayReadingsScreen() {
  const handleBack = useCallback(() => router.back(), []);
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenHeader
        title={t('readings.todayTitle')}
        subtitle={t('readings.todaySubtitle')}
        onBack={handleBack}
      />
      <View style={styles.content}>
        <TodayReadings />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  content: { flex: 1 },
});
