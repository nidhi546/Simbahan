import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import GradientView from '../../components/ui/GradientView';
import AppText from '../../components/ui/AppText';
import BackBar from '../../components/ui/BackBar';
import WebLayout from '../../components/ui/WebLayout';
import FundCard from '../../components/donations/FundCard';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useChurchStore } from '../../store/churchStore';
import fundsData from '../../data/donationFunds.json';
import { useI18n } from '../../i18n';

type Fund = typeof fundsData[number];

const isWeb = Platform.OS === 'web';
const keyExtractor = (item: Fund) => item.id;

export default function DonationsScreen() {
  const donations = useChurchStore((s) => s.donations);
  const { t, language } = useI18n();
  const total = donations.reduce((sum, d) => sum + d.amount, 0);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Fund>) => (
    <FundCard
      id={item.id}
      title={item.title}
      description={item.description}
      goal={item.goal}
      collected={item.collected}
      startDate={item.startDate}
      endDate={item.endDate}
    />
  ), []);

  const ListHeader = (
    <>
      <BackBar />
      <GradientView colors={[Colors.crimson, Colors.crimsonLight]} style={[styles.header, { marginHorizontal: -Spacing.md }]}>
        <AppText variant="displaySm" color={Colors.textInverse}>{t('donations.title')}</AppText>
        <AppText variant="bodySm" color="rgba(255,255,255,0.75)">
          {t('donations.subtitle')}
        </AppText>
      </GradientView>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <AppText variant="displayMd" color={Colors.navy} style={styles.totalAmt}>
            ₱{total.toLocaleString(language === 'en' ? 'en-PH' : 'fil-PH')}
          </AppText>
          <AppText variant="bodySm" color={Colors.textMuted}>
            {t('donations.count', { count: donations.length })}
          </AppText>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/donations/history' as never)}
          style={styles.historyBtn}
          accessible
          accessibilityLabel={t('donations.viewHistoryA11y')}
        >
          <AppText variant="label" color={Colors.navy}>{t('donations.historyShort')}</AppText>
          <Ionicons name="chevron-forward" size={14} color={Colors.navy} />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <AppText variant="headingSm" color={Colors.navy}>{t('donations.activeFunds')}</AppText>
      </View>
    </>
  );

  const list = (
    <FlatList
      data={fundsData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={5}
      maxToRenderPerBatch={5}
    />
  );

  if (isWeb) return <WebLayout><View style={styles.screen}>{list}</View></WebLayout>;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {list}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    gap: 4,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    margin: Spacing.md,
    marginBottom: 0,
  },
  summaryLeft: { flex: 1 },
  totalAmt: { lineHeight: 36 },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
});
