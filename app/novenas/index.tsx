import React, { useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import GradientView from '../../components/ui/GradientView';
import AppText from '../../components/ui/AppText';
import BackBar from '../../components/ui/BackBar';
import WebLayout from '../../components/ui/WebLayout';
import NovenaCard from '../../components/novenas/NovenaCard';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useModule09Store } from '../../store/module09Store';
import novenasData from '../../data/novenas.json';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';

const DEVOTIONS = [
  { id: 'rosary',  labelKey: 'novenas.devotionRosary',  icon: 'ellipse-outline'   as const, route: '/novenas/rosary' },
  { id: 'chaplet', labelKey: 'novenas.devotionChaplet',  icon: 'infinite-outline'  as const, route: '/novenas/rosary' },
  { id: 'angelus', labelKey: 'novenas.devotionAngelus',  icon: 'sunny-outline'     as const, route: '/novenas/rosary' },
  { id: 'litany',  labelKey: 'novenas.devotionLitany',  icon: 'list-outline'      as const, route: '/novenas/rosary' },
];

export default function NovenasScreen() {
  const { t } = useI18n();
  const novenaProgress = useModule09Store((s) => s.novenaProgress);
  const featured = novenasData[0];

  const getProgress = useCallback(
    (id: string) => novenaProgress.find((p) => p.novenaId === id)?.completedDays ?? [],
    [novenaProgress]
  );

  const content = (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <BackBar />
      <GradientView colors={[Colors.gold, Colors.goldLight]} style={styles.header}>
        <AppText variant="displaySm" color={Colors.navyDark}>{t('novenas.headerTitle')}</AppText>
        <AppText variant="bodySm" color={Colors.navyDark} style={{ opacity: 0.7 }}>
          {t('novenas.headerSubtitle')}
        </AppText>
      </GradientView>

      {/* Featured novena */}
      <View style={styles.section}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.sectionTitle}>{t('novenas.featured')}</AppText>
        <GradientView colors={[Colors.crimson, Colors.crimsonLight]} style={styles.featuredCard}>
          <AppText variant="caption" color="rgba(255,255,255,0.7)">{t('novenas.currentNovena')}</AppText>
          <AppText variant="headingMd" color={Colors.textInverse}>{featured.patron}</AppText>
          <View style={styles.featuredMeta}>
            <View style={styles.dayBadge}>
              <AppText variant="label" color={Colors.crimson}>{t('novenas.dayOfNine', { day: 1 })}</AppText>
            </View>
            <AppText variant="caption" color="rgba(255,255,255,0.8)">{featured.feastDate}</AppText>
          </View>
          <TouchableOpacity
            onPress={() => router.push(`/novenas/${featured.id}` as never)}
            style={styles.continueBtn}
            accessible
            accessibilityLabel={t('novenas.continueA11y')}
          >
            <AppText variant="label" color={Colors.crimson}>{t('novenas.continue')}</AppText>
          </TouchableOpacity>
        </GradientView>
      </View>

      {/* Novena list */}
      <View style={styles.section}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.sectionTitle}>{t('novenas.allNovenas')}</AppText>
        <View style={styles.list}>
          {novenasData.map((n) => (
            <NovenaCard
              key={n.id}
              id={n.id}
              patron={n.patron}
              feastDate={n.feastDate}
              image={n.image}
              completedDays={getProgress(n.id)}
            />
          ))}
        </View>
      </View>

      {/* Devotions grid */}
      <View style={styles.section}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.sectionTitle}>{t('novenas.devotions')}</AppText>
        <View style={styles.grid}>
          {DEVOTIONS.map((d) => (
            <TouchableOpacity
              key={d.id}
              onPress={() => router.push(d.route as never)}
              style={styles.devotionCard}
              accessible
              accessibilityLabel={t(d.labelKey)}
              activeOpacity={0.8}
            >
              <Ionicons name={d.icon} size={28} color={Colors.gold} />
              <AppText variant="label" color={Colors.navy} style={styles.devotionLabel}>{t(d.labelKey)}</AppText>
            </TouchableOpacity>
          ))}
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
  featuredCard: { borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.sm },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dayBadge: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  continueBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginTop: Spacing.xs,
  },
  list: { gap: Spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  devotionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  devotionLabel: { textAlign: 'center' },
});
