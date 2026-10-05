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
import AppText from '../../components/ui/AppText';
import WebLayout from '../../components/ui/WebLayout';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useChurchStore } from '../../store/churchStore';
import { useI18n } from '../../i18n';

type Donation = ReturnType<typeof useChurchStore.getState>['donations'][number];

const isWeb = Platform.OS === 'web';
const keyExtractor = (item: Donation) => item.id;

export default function DonationHistoryScreen() {
  const donations = useChurchStore((s) => s.donations);
  const { t, language } = useI18n();
  const locale = language === 'en' ? 'en-PH' : 'fil-PH';
  const total = donations.reduce((sum, d) => sum + d.amount, 0);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Donation>) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <AppText variant="headingSm" color={Colors.textPrimary} numberOfLines={1}>
          {item.category}
        </AppText>
        <AppText variant="caption" color={Colors.textMuted}>{item.date}</AppText>
        {!!item.notes && (
          <AppText variant="caption" color={Colors.textMuted} numberOfLines={1}>
            {item.notes}
          </AppText>
        )}
      </View>
      <AppText variant="headingSm" color={Colors.gold}>
        ₱{item.amount.toLocaleString(locale)}
      </AppText>
    </View>
  ), [locale]);

  const ListHeader = (
    <>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessible accessibilityLabel={t('donationHistory.back')}>
          <Ionicons name="arrow-back" size={20} color={Colors.navy} />
          <AppText variant="bodyMd" color={Colors.navy}>{t('donationHistory.back')}</AppText>
        </TouchableOpacity>
        <AppText variant="headingMd" color={Colors.navy}>{t('donations.history')}</AppText>
      </View>

      <View style={styles.summaryCard}>
        <AppText variant="displaySm" color={Colors.navy}>
          ₱{total.toLocaleString(locale)}
        </AppText>
        <AppText variant="bodySm" color={Colors.textMuted}>
          {t('donationHistory.totalCount', { count: donations.length })}
        </AppText>
      </View>
    </>
  );

  const list = (
    <FlatList
      data={donations}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={10}
      maxToRenderPerBatch={10}
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
  topBar: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  summaryCard: {
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    gap: 4,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  rowLeft: { flex: 1, gap: 2 },
});
