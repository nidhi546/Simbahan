import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { Spacing, Radius } from '../constants/Layout';
import AppText from '../components/ui/AppText';
import LanguageToggle from '../components/ui/LanguageToggle';
import { useAuthStore } from '../store/authStore';
import { useI18n } from '../i18n';

const STEPS = [
  {
    icon: 'book-outline' as const,
    iconBg: Colors.navy,
    accentColor: Colors.navy,
    titleKey: 'welcome.step1Title',
    descriptionKey: 'welcome.step1Description',
  },
  {
    icon: 'calendar-outline' as const,
    iconBg: Colors.gold,
    accentColor: Colors.gold,
    titleKey: 'welcome.step2Title',
    descriptionKey: 'welcome.step2Description',
  },
  {
    icon: 'people-outline' as const,
    iconBg: Colors.sage,
    accentColor: Colors.sage,
    titleKey: 'welcome.step3Title',
    descriptionKey: 'welcome.step3Description',
  },
];

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const { t } = useI18n();
  const scrollRef = useRef<ScrollView>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const scrollX = useSharedValue(0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollX.value = e.nativeEvent.contentOffset.x;
      const step = Math.round(e.nativeEvent.contentOffset.x / width);
      setCurrentStep(Math.max(0, Math.min(step, STEPS.length - 1)));
    },
    [width, scrollX],
  );

  const goToStep = useCallback(
    (step: number) => {
      scrollRef.current?.scrollTo({ x: step * width, animated: true });
      setCurrentStep(step);
    },
    [width],
  );

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const handleFinish = useCallback(async () => {
    await setOnboarded();
    router.replace('/(auth)/login');
  }, [setOnboarded]);

  const isLast = currentStep === STEPS.length - 1;
  const activeStep = STEPS[currentStep];

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Top bar: step indicator + skip */}
      <View style={styles.topBar}>
        <AppText variant="caption" color={Colors.textMuted}>
          {currentStep + 1} / {STEPS.length}
        </AppText>
        <View style={styles.topBarRight}>
          <LanguageToggle />
          {!isLast && (
            <TouchableOpacity
              onPress={handleFinish}
              accessible
              accessibilityLabel={t('welcome.skipA11y')}
              activeOpacity={0.7}
              style={styles.skipBtn}
            >
              <AppText variant="bodySm" color={Colors.textMuted}>
                {t('common.skip')}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.slider}
        decelerationRate="fast"
      >
        {STEPS.map((step, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            {/* Illustration */}
            <View style={styles.illustrationWrap}>
              <View
                style={[
                  styles.outerRing,
                  { borderColor: step.accentColor + '15' },
                ]}
              />
              <View
                style={[
                  styles.middleRing,
                  { borderColor: step.accentColor + '25' },
                ]}
              />
              <View
                style={[
                  styles.illustrationCircle,
                  { backgroundColor: step.accentColor + '12' },
                ]}
              >
                <View
                  style={[
                    styles.iconInner,
                    { backgroundColor: step.iconBg },
                  ]}
                >
                  <Ionicons
                    name={step.icon}
                    size={52}
                    color={Colors.textInverse}
                  />
                </View>
              </View>
            </View>

            {/* Text content */}
            <View style={styles.textBlock}>
              <AppText
                variant="displaySm"
                color={Colors.navy}
                style={styles.title}
              >
                {t(step.titleKey)}
              </AppText>
              <AppText
                variant="bodyMd"
                color={Colors.textSecondary}
                style={styles.description}
              >
                {t(step.descriptionKey)}
              </AppText>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom: dots + CTA */}
      <View style={styles.bottom}>
        {/* Animated pagination dots */}
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <AnimatedDot
              key={i}
              index={i}
              scrollX={scrollX}
              width={width}
              accentColor={STEPS[i].accentColor}
              onPress={() => goToStep(i)}
            />
          ))}
        </View>

        {/* CTA button */}
        <TouchableOpacity
          onPress={isLast ? handleFinish : handleNext}
          accessible
          accessibilityLabel={isLast ? t('welcome.continueA11y') : t('welcome.nextA11y')}
          activeOpacity={0.85}
          style={[
            styles.ctaBtn,
            { backgroundColor: activeStep.accentColor },
          ]}
        >
          <AppText
            variant="label"
            color={Colors.textInverse}
            style={styles.ctaBtnText}
          >
            {isLast ? t('welcome.getStarted') : t('common.next')}
          </AppText>
          <Ionicons
            name={isLast ? 'checkmark-circle-outline' : 'arrow-forward'}
            size={20}
            color={Colors.textInverse}
          />
        </TouchableOpacity>

        {/* Login shortcut */}
        <View style={styles.loginRow}>
          <AppText variant="bodySm" color={Colors.textMuted}>
            {t('auth.hasAccount')}{' '}
          </AppText>
          <TouchableOpacity
            onPress={handleFinish}
            accessible
            accessibilityLabel={t('welcome.loginA11y')}
            activeOpacity={0.7}
          >
            <AppText variant="bodySm" color={Colors.navy}>
              {t('welcome.login')}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function AnimatedDot({
  index,
  scrollX,
  width,
  accentColor,
  onPress,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
  width: number;
  accentColor: string;
  onPress: () => void;
}) {
  const { t } = useI18n();
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [8, 28, 8],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.35, 1, 0.35],
      Extrapolation.CLAMP,
    );
    return {
      width: withTiming(dotWidth, { duration: 220 }),
      opacity,
      backgroundColor: accentColor,
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityLabel={t('welcome.stepA11y', { step: index + 1 })}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
    >
      <Animated.View style={[styles.dot, dotStyle]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
    minHeight: 44,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  skipBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },

  slider: { flex: 1 },

  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },

  illustrationWrap: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  outerRing: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 1.5,
  },
  middleRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1.5,
  },
  illustrationCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textBlock: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  title: {
    textAlign: 'center',
    lineHeight: 34,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },

  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
  },

  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },

  ctaBtn: {
    borderRadius: Radius.md,
    height: 52,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  ctaBtnText: { fontSize: 15 },

  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.xs,
  },
});
