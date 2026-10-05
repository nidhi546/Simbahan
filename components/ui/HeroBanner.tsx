import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Img from '../ui/Img';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { useI18n } from '../../i18n';
import { Colors } from '../../constants/Colors';

const SLIDES = [
  {
    uri: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1400&q=80',
    titleKey: 'ui.hero.slide1Title',
    subtitleKey: 'ui.hero.slide1Subtitle',
  },
  {
    uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80',
    titleKey: 'ui.hero.slide2Title',
    subtitleKey: 'ui.hero.slide2Subtitle',
  },
  {
    uri: 'https://images.unsplash.com/photo-1519494080410-f9aa8f52f3c1?w=1400&q=80',
    titleKey: 'ui.hero.slide3Title',
    subtitleKey: 'ui.hero.slide3Subtitle',
  },
];

const INTERVAL = 4000;
const FADE_DURATION = 600;

type Props = { hideTitle?: boolean };

export default function HeroBanner({ hideTitle = false }: Props) {
  const { width } = useWindowDimensions();
  const [current, setCurrent] = useState(0);
  const { t } = useI18n();
  const opacity = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bannerHeight = width >= 1024 ? 520 : width >= 600 ? 380 : 260;

  const goTo = useCallback(
    (next: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION / 2,
        useNativeDriver: true,
      }).start(() => {
        setCurrent(next);
        Animated.timing(opacity, {
          toValue: 1,
          duration: FADE_DURATION / 2,
          useNativeDriver: true,
        }).start();
      });
    },
    [opacity],
  );

  const advance = useCallback(
    (dir: 1 | -1) => {
      const next = (current + dir + SLIDES.length) % SLIDES.length;
      goTo(next);
    },
    [current, goTo],
  );

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo((current + 1) % SLIDES.length);
    }, INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, goTo]);

  return (
    <View style={StyleSheet.flatten([styles.root, { height: bannerHeight }])}>
      {/* Slide image */}
      {/* Spread absoluteFillObject into a plain object so Animated.Value opacity
          is never inside a style array — fixes CSSStyleDeclaration crash on web */}
      <Animated.View style={{ ...StyleSheet.absoluteFillObject, opacity }}>
        <Img
          source={{ uri: SLIDES[current].uri }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={0}
          cachePolicy={Platform.OS !== 'web' ? 'memory-disk' : 'none'}
        />
      </Animated.View>

      {/* Gradient overlay — stronger at bottom for CTA legibility */}
      <View style={styles.overlayTop} />
      <View style={styles.overlayBottom} />

      {/* Title — upper center, hidden when parent overlays its own CTAs */}
      {!hideTitle && (
        <View style={styles.titleWrap} pointerEvents="none">
          <AppText variant="headingMd" color={Colors.textInverse} style={styles.title}>
            {t(SLIDES[current].titleKey)}
          </AppText>
          <AppText variant="bodySm" color={Colors.goldLight} style={styles.subtitle}>
            {t(SLIDES[current].subtitleKey)}
          </AppText>
        </View>
      )}

      {/* Left arrow */}
      <TouchableOpacity
        style={StyleSheet.flatten([styles.arrow, styles.arrowLeft])}
        onPress={() => advance(-1)}
        activeOpacity={0.75}
        accessible
        accessibilityLabel={t('ui.hero.prevSlide')}
      >
        <Ionicons name="chevron-back" size={22} color={Colors.textInverse} />
      </TouchableOpacity>

      {/* Right arrow */}
      <TouchableOpacity
        style={StyleSheet.flatten([styles.arrow, styles.arrowRight])}
        onPress={() => advance(1)}
        activeOpacity={0.75}
        accessible
        accessibilityLabel={t('ui.hero.nextSlide')}
      >
        <Ionicons name="chevron-forward" size={22} color={Colors.textInverse} />
      </TouchableOpacity>

      {/* Dots */}
      <View style={styles.dots} pointerEvents="box-none">
        {SLIDES.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => goTo(i)}
            accessible
            accessibilityLabel={t('ui.hero.goToSlide', { n: i + 1 })}
            style={StyleSheet.flatten([styles.dot, i === current && styles.dotActive])}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: Colors.navyDark,
    position: 'relative',
  },
  overlayTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,18,40,0.35)',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(10,18,40,0.45)',
  },
  titleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 48, // leave room for dots
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: { left: 16 },
  arrowRight: { right: 16 },
  dots: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    backgroundColor: Colors.gold,
    width: 24,
  },
});
