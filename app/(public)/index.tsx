import React, { useCallback, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText } from '../../components/ui';
import churchData from '../../data/church.json';
import { useI18n } from '../../i18n';

const FEATURES = [
  { icon: 'calendar-outline' as const, titleKey: 'publicHome.featureMassTitle', descKey: 'publicHome.featureMassDesc', color: Colors.navy },
  { icon: 'newspaper-outline' as const, titleKey: 'publicHome.featureAnnouncementsTitle', descKey: 'publicHome.featureAnnouncementsDesc', color: Colors.gold },
  { icon: 'book-outline' as const, titleKey: 'publicHome.featureReadingsTitle', descKey: 'publicHome.featureReadingsDesc', color: Colors.sage },
  { icon: 'people-outline' as const, titleKey: 'publicHome.featureCommunityTitle', descKey: 'publicHome.featureCommunityDesc', color: Colors.crimson },
  { icon: 'heart-outline' as const, titleKey: 'publicHome.featurePrayerTitle', descKey: 'publicHome.featurePrayerDesc', color: Colors.gold },
  { icon: 'gift-outline' as const, titleKey: 'publicHome.featureDonationsTitle', descKey: 'publicHome.featureDonationsDesc', color: Colors.navy },
];

const STATS = [
  { value: '1,200+', labelKey: 'publicHome.statParishioners', icon: 'people' as const },
  { value: '9', labelKey: 'publicHome.statMinistries', icon: 'layers' as const },
  { valueKey: 'publicHome.statDailyValue', labelKey: 'publicHome.statReadings', icon: 'book' as const },
  { valueKey: 'publicHome.statFreeValue', labelKey: 'publicHome.statForever', icon: 'heart' as const },
];

const EASE = Easing.out(Easing.cubic);

function useFadeSlide(delay = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(32);
  const triggered = useRef(false);
  const visible = useSharedValue(false);

  const trigger = useCallback(() => {
    if (triggered.current) return;
    triggered.current = true;
    visible.value = true;
    opacity.value = withDelay(delay, withTiming(1, { duration: 600, easing: EASE }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600, easing: EASE }));
  }, [delay, opacity, translateY, visible]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { animStyle, trigger, visible };
}

export default function LandingPage() {
  const { t } = useI18n();
  const { width, height } = useWindowDimensions();
  const isWide = width >= 768;

  const handleLogin = useCallback(() => router.push('/(auth)/login'), []);
  const handleSignup = useCallback(() => router.push('/(auth)/register'), []);

  // Section refs for scroll-trigger offsets
  const statsY = useRef(0);
  const featuresY = useRef(0);
  const quoteY = useRef(0);
  const ctaY = useRef(0);
  const ministriesY = useRef(0);

  const stats = useFadeSlide(0);
  const features = useFadeSlide(0);
  const quote = useFadeSlide(0);
  const cta = useFadeSlide(0);
  const ministries = useFadeSlide(0);

  // Hero content fades in on mount
  const heroOpacity = useSharedValue(0);
  const heroY = useSharedValue(24);
  React.useEffect(() => {
    heroOpacity.value = withDelay(200, withTiming(1, { duration: 700, easing: EASE }));
    heroY.value = withDelay(200, withTiming(0, { duration: 700, easing: EASE }));
  }, []);
  const heroAnimStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroY.value }],
  }));

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const trigger = height * 0.75;
      if (y + trigger > statsY.current) stats.trigger();
      if (y + trigger > featuresY.current) features.trigger();
      if (y + trigger > quoteY.current) quote.trigger();
      if (y + trigger > ctaY.current) cta.trigger();
      if (y + trigger > ministriesY.current) ministries.trigger();
    },
    [height, stats, features, quote, cta, ministries],
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* ── Navbar ── */}
      <View style={styles.nav}>
        <View style={styles.navBrand}>
          <View style={styles.navCross}>
            <AppText variant="headingMd" color={Colors.textInverse}>✝</AppText>
          </View>
          <View>
            <AppText variant="headingMd" color={Colors.navy}>Simbahan</AppText>
            <AppText variant="caption" color={Colors.textMuted}>{t('auth.tagline')}</AppText>
          </View>
        </View>
        <View style={styles.navActions}>
          <TouchableOpacity onPress={handleLogin} style={styles.navLogin} activeOpacity={0.8} accessible accessibilityLabel={t('publicHome.login')}>
            <AppText variant="label" color={Colors.navy}>{t('publicHome.login')}</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignup} style={styles.navSignup} activeOpacity={0.8} accessible accessibilityLabel={t('publicHome.signUpA11y')}>
            <AppText variant="label" color={Colors.textInverse}>{t('auth.signUp')}</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* ── Hero ── */}
        <ImageBackground
          source={{ uri: 'https://picsum.photos/id/1060/1200/700' }}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.heroScrim} />
          <Animated.View style={[StyleSheet.flatten(styles.heroContent), heroAnimStyle]}>
            <View style={styles.heroPill}>
              <Ionicons name="location" size={12} color={Colors.gold} />
              <AppText variant="caption" color={Colors.gold}> {churchData.diocese}</AppText>
            </View>
            <AppText variant="displaySm" color={Colors.textInverse} style={styles.heroTitle}>
              {churchData.name}
            </AppText>
            <AppText variant="bodyMd" color={Colors.goldLight} style={styles.heroSub}>
              {t('publicHome.established', { year: churchData.founded, city: churchData.city })}
            </AppText>
            <View style={styles.heroCtas}>
              <TouchableOpacity onPress={handleSignup} style={styles.heroPrimary} activeOpacity={0.85} accessible accessibilityLabel={t('publicHome.getStartedA11y')}>
                <AppText variant="label" color={Colors.navyDark}>{t('publicHome.getStartedFree')}</AppText>
                <Ionicons name="arrow-forward" size={14} color={Colors.navyDark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogin} style={styles.heroSecondary} activeOpacity={0.85} accessible accessibilityLabel={t('auth.signInLower')}>
                <AppText variant="label" color={Colors.textInverse}>{t('auth.signIn')}</AppText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ImageBackground>

        {/* ── Stats bar ── */}
        <Animated.View
          style={stats.animStyle}
          onLayout={(e) => { statsY.current = e.nativeEvent.layout.y; }}
        >
          <View style={styles.statsBar}>
            {STATS.map((s, i) => (
              <React.Fragment key={s.labelKey}>
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons name={s.icon} size={16} color={Colors.gold} />
                  </View>
                  <AppText variant="headingSm" color={Colors.navy}>{s.valueKey ? t(s.valueKey) : s.value}</AppText>
                  <AppText variant="caption" color={Colors.textMuted}>{t(s.labelKey)}</AppText>
                </View>
                {i < STATS.length - 1 && <View style={styles.statDivider} />}
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* ── Features ── */}
        <Animated.View
          style={features.animStyle}
          onLayout={(e) => { featuresY.current = e.nativeEvent.layout.y; }}
        >
          <View style={styles.featuresSection}>
            <View style={styles.sectionBadge}>
              <AppText variant="caption" color={Colors.gold}>{t('publicHome.featuresBadge')}</AppText>
            </View>
            <AppText variant="displaySm" color={Colors.navy} style={styles.sectionTitle}>
              {t('publicHome.featuresTitle')}
            </AppText>
            <AppText variant="bodyMd" color={Colors.textSecondary} style={styles.sectionDesc}>
              {t('publicHome.featuresSubtitle')}
            </AppText>
            <View style={StyleSheet.flatten([styles.grid, isWide && styles.gridWide])}>
              {FEATURES.map((f, i) => (
                <FeatureCard key={f.titleKey} f={f} isWide={isWide} index={i} visible={features.visible} />
              ))}
            </View>
          </View>
        </Animated.View>

        {/* ── Quote strip ── */}
        <Animated.View
          style={quote.animStyle}
          onLayout={(e) => { quoteY.current = e.nativeEvent.layout.y; }}
        >
          <View style={styles.quoteStrip}>
            <Ionicons name="chatbubble-ellipses" size={28} color={Colors.goldLight} style={{ marginBottom: Spacing.sm }} />
            <AppText variant="bodyLg" color={Colors.textInverse} style={styles.quoteText}>
              {t('publicHome.quote')}
            </AppText>
            <AppText variant="caption" color={Colors.goldLight} style={{ marginTop: Spacing.sm }}>
              — {churchData.pastor}
            </AppText>
          </View>
        </Animated.View>

        {/* ── Bottom CTA ── */}
        <Animated.View
          style={cta.animStyle}
          onLayout={(e) => { ctaY.current = e.nativeEvent.layout.y; }}
        >
          <View style={styles.ctaSection}>
            <View style={styles.ctaCard}>
              <View style={styles.ctaCross}>
                <AppText style={{ fontSize: 32, color: Colors.gold }}>✝</AppText>
              </View>
              <AppText variant="displaySm" color={Colors.navy} style={styles.ctaTitle}>
                {t('publicHome.ctaTitle', { church: churchData.name })}
              </AppText>
              <AppText variant="bodyMd" color={Colors.textSecondary} style={styles.ctaDesc}>
                {t('publicHome.ctaDescription')}
              </AppText>
              <TouchableOpacity onPress={handleSignup} style={styles.ctaBtn} activeOpacity={0.85} accessible accessibilityLabel={t('publicHome.createFreeAccountA11y')}>
                <AppText variant="label" color={Colors.textInverse}>{t('publicHome.createFreeAccount')}</AppText>
                <Ionicons name="person-add" size={16} color={Colors.textInverse} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogin} activeOpacity={0.7} accessible accessibilityLabel={t('publicHome.hasAccountA11y')}>
                <AppText variant="bodySm" color={Colors.textMuted}>
                  {t('auth.hasAccount')}{' '}
                  <AppText variant="bodySm" color={Colors.navy}>{t('auth.signInLower')}</AppText>
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* ── Ministries & Social Banner ── */}
        <Animated.View
          style={ministries.animStyle}
          onLayout={(e) => { ministriesY.current = e.nativeEvent.layout.y; }}
        >
          <ImageBackground
            source={{ uri: 'https://picsum.photos/id/1060/1200/700' }}
            style={styles.ministriesBanner}
            resizeMode="cover"
          >
            <View style={styles.ministriesScrim} />
            <View style={styles.ministriesLeft}>
              <View style={styles.ministriesBadge}>
                <Ionicons name="layers-outline" size={13} color={Colors.gold} />
                <AppText variant="caption" color={Colors.gold}> {t('publicHome.ministriesBadge')}</AppText>
              </View>
              <AppText variant="headingMd" color={Colors.textInverse} style={{ marginBottom: Spacing.sm }}>
                {t('publicHome.activeMinistries', { count: 9 })}
              </AppText>
              <View style={styles.ministriesList}>
                {churchData.ministries.slice(0, 6).map((m) => (
                  <View key={m} style={styles.ministryPill}>
                    <AppText variant="caption" color={Colors.goldLight}>{m}</AppText>
                  </View>
                ))}
                <View style={styles.ministryPill}>
                  <AppText variant="caption" color={Colors.goldLight}>{t('publicHome.moreMinistries', { count: churchData.ministries.length - 6 })}</AppText>
                </View>
              </View>
            </View>
            <View style={styles.ministriesDivider} />
            <View style={styles.socialCol}>
              <AppText variant="label" color={Colors.textInverse} style={{ marginBottom: Spacing.sm }}>{t('publicHome.followUs')}</AppText>
              <TouchableOpacity style={styles.socialRow} activeOpacity={0.75} accessible accessibilityLabel="Facebook">
                <View style={styles.socialIcon}>
                  <Ionicons name="logo-facebook" size={18} color={Colors.navy} />
                </View>
                <AppText variant="bodySm" color={Colors.goldLight}>Facebook</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialRow} activeOpacity={0.75} accessible accessibilityLabel="YouTube">
                <View style={styles.socialIcon}>
                  <Ionicons name="logo-youtube" size={18} color={Colors.crimson} />
                </View>
                <AppText variant="bodySm" color={Colors.goldLight}>YouTube</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialRow} activeOpacity={0.75} accessible accessibilityLabel="Instagram">
                <View style={styles.socialIcon}>
                  <Ionicons name="logo-instagram" size={18} color={Colors.gold} />
                </View>
                <AppText variant="bodySm" color={Colors.goldLight}>Instagram</AppText>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </Animated.View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerBrand}>
            <AppText variant="headingSm" color={Colors.navy}>✝ Simbahan</AppText>
          </View>
          <View style={styles.footerLinks}>
            <Ionicons name="call-outline" size={13} color={Colors.textMuted} />
            <AppText variant="caption" color={Colors.textMuted}> {churchData.phone}</AppText>
            <AppText variant="caption" color={Colors.border}>  ·  </AppText>
            <Ionicons name="mail-outline" size={13} color={Colors.textMuted} />
            <AppText variant="caption" color={Colors.textMuted}> {churchData.email}</AppText>
          </View>
          <AppText variant="caption" color={Colors.textMuted}>
            © 2025 {churchData.name} · {churchData.diocese}
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Feature card with scroll-triggered stagger + press scale
function FeatureCard({
  f, isWide, index, visible,
}: {
  f: typeof FEATURES[0];
  isWide: boolean;
  index: number;
  visible: Animated.SharedValue<boolean>;
}) {
  const { t } = useI18n();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    const delay = index * 90;
    opacity.value = withDelay(delay, withTiming(1, { duration: 500, easing: EASE }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500, easing: EASE }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessible
      accessibilityLabel={t(f.titleKey)}
    >
      <Animated.View style={[StyleSheet.flatten([styles.featureCard, isWide && styles.featureCardWide]), animStyle]}>
        <View style={StyleSheet.flatten([styles.featureIconWrap, { backgroundColor: f.color + '15' }])}>
          <Ionicons name={f.icon} size={22} color={f.color} />
        </View>
        <AppText variant="headingSm" color={Colors.navy}>{t(f.titleKey)}</AppText>
        <AppText variant="bodySm" color={Colors.textSecondary}>{t(f.descKey)}</AppText>
        <View style={StyleSheet.flatten([styles.featureAccent, { backgroundColor: f.color }])} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },

  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.textInverse,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
  },
  navBrand: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  navCross: {
    width: 36, height: 36, borderRadius: Radius.sm,
    backgroundColor: Colors.navy, alignItems: 'center', justifyContent: 'center',
  },
  navActions: { flexDirection: 'row', gap: Spacing.sm },
  navLogin: {
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.navy,
  },
  navSignup: {
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    borderRadius: Radius.full, backgroundColor: Colors.navy,
  },

  scroll: { paddingBottom: Spacing.xxl },

  hero: { height: 480, justifyContent: 'flex-end' },
  heroScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,18,50,0.62)' },
  heroContent: { padding: Spacing.xl, paddingBottom: Spacing.xxl, gap: Spacing.sm },
  heroPill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,146,42,0.18)', borderWidth: 1,
    borderColor: 'rgba(201,146,42,0.4)', paddingHorizontal: Spacing.sm,
    paddingVertical: 3, borderRadius: Radius.full, marginBottom: Spacing.xs,
  },
  heroTitle: {
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
  },
  heroSub: { marginBottom: Spacing.md },
  heroCtas: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  heroPrimary: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.gold, paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2, borderRadius: Radius.full,
  },
  heroSecondary: {
    borderWidth: 1.5, borderColor: Colors.textInverse,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2, borderRadius: Radius.full,
  },

  statsBar: {
    flexDirection: 'row', backgroundColor: Colors.textInverse,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingVertical: Spacing.lg, paddingHorizontal: Spacing.md,
    justifyContent: 'space-around', alignItems: 'center',
  },
  statItem: { alignItems: 'center', gap: 4, flex: 1 },
  statIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.goldPale, alignItems: 'center',
    justifyContent: 'center', marginBottom: 2,
  },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },

  featuresSection: {
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xxl,
    backgroundColor: Colors.cream2, alignItems: 'center', gap: Spacing.sm,
  },
  sectionBadge: {
    backgroundColor: Colors.goldPale, paddingHorizontal: Spacing.md,
    paddingVertical: 4, borderRadius: Radius.full, marginBottom: Spacing.xs,
  },
  sectionTitle: { textAlign: 'center' },
  sectionDesc: { textAlign: 'center', marginBottom: Spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'center', width: '100%' },
  gridWide: { justifyContent: 'center' },
  featureCard: {
    backgroundColor: Colors.textInverse, borderRadius: Radius.lg,
    padding: Spacing.lg, width: '100%', gap: Spacing.xs,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  featureCardWide: { width: 260 },
  featureIconWrap: {
    width: 44, height: 44, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs,
  },
  featureAccent: {
    position: 'absolute', top: 0, left: 0, width: 4, height: '100%',
    borderTopLeftRadius: Radius.lg, borderBottomLeftRadius: Radius.lg,
  },

  quoteStrip: {
    backgroundColor: Colors.navyDark, paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl, alignItems: 'center',
  },
  quoteText: { textAlign: 'center', fontStyle: 'italic', maxWidth: 480, lineHeight: 28 },

  ctaSection: {
    backgroundColor: Colors.cream, paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl, alignItems: 'center',
  },
  ctaCard: {
    backgroundColor: Colors.textInverse, borderRadius: Radius.lg,
    padding: Spacing.xxl, alignItems: 'center', gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, maxWidth: 480, width: '100%',
    shadowColor: Colors.navy, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  ctaCross: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.goldPale, alignItems: 'center',
    justifyContent: 'center', marginBottom: Spacing.xs,
  },
  ctaTitle: { textAlign: 'center' },
  ctaDesc: { textAlign: 'center', maxWidth: 340 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.navy, borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm + 4, marginTop: Spacing.xs,
  },

  ministriesBanner: {
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xxl,
    flexDirection: 'row', gap: Spacing.xl, flexWrap: 'wrap',
  },
  ministriesScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,18,50,0.78)' },
  ministriesLeft: { flex: 1, minWidth: 220, gap: Spacing.sm },
  ministriesBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,146,42,0.15)', borderWidth: 1,
    borderColor: 'rgba(201,146,42,0.35)', paddingHorizontal: Spacing.sm,
    paddingVertical: 3, borderRadius: Radius.full,
  },
  ministriesList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  ministryPill: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)', paddingHorizontal: Spacing.sm,
    paddingVertical: 3, borderRadius: Radius.full,
  },
  ministriesDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' },
  socialCol: { gap: Spacing.sm, justifyContent: 'center', minWidth: 140 },
  socialRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  socialIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.textInverse, alignItems: 'center', justifyContent: 'center',
  },

  footer: {
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
    alignItems: 'center', gap: Spacing.xs,
    borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.textInverse,
  },
  footerBrand: { marginBottom: Spacing.xs },
  footerLinks: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' },
});
