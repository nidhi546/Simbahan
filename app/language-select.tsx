/**
 * language-select.tsx
 *
 * Shown after country-select when the user picks India (or any country
 * with more than one available language).
 *
 * For Philippines (single language default), this screen is never shown.
 * Can also be reached from Settings > Change Language.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Spacing, Radius } from '../constants/Layout';
import AppText from '../components/ui/AppText';
import {
  useCountryStore,
  COUNTRIES,
  LanguageCode,
} from '../store/countryStore';
import { useI18n } from '../i18n';

export default function LanguageSelectScreen() {
  const { t } = useI18n();
  const country    = useCountryStore((s) => s.country);
  const language   = useCountryStore((s) => s.language);
  const setLanguage = useCountryStore((s) => s.setLanguage);

  // Derive available languages from the selected country; fallback to English only
  const countryConfig = country ? COUNTRIES[country] : null;
  const options = countryConfig?.availableLanguages ?? [
    { code: 'en' as LanguageCode, nativeName: 'English', englishName: 'English' },
  ];

  const [selected, setSelected] = useState<LanguageCode>(language);
  const [saving, setSaving]     = useState(false);

  const handleContinue = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    await setLanguage(selected);
    // Always go to the root redirect — index.tsx will route from there
    router.replace('/');
    setSaving(false);
  }, [selected, saving, setLanguage]);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* ── Back button (shown when coming from Settings) ── */}
      {router.canGoBack() && (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessible
          accessibilityRole="button"
          accessibilityLabel={t('languageSelect.goBackA11y')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.navy} />
          <AppText variant="bodySm" color={Colors.navy}>{t('common.back')}</AppText>
        </TouchableOpacity>
      )}

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.logoMark}>
          <Ionicons name="language-outline" size={32} color={Colors.textInverse} />
        </View>

        {countryConfig && (
          <View style={styles.countryBadge}>
            <AppText style={styles.countryFlag}>{countryConfig.flag}</AppText>
            <AppText variant="bodySm" color={Colors.textMuted}>
              {t(`countrySelect.countries.${country}`)}
            </AppText>
          </View>
        )}

        <AppText variant="displaySm" color={Colors.navy} style={styles.title}>
          {t('languageSelect.title')}
        </AppText>
        <AppText variant="bodyMd" color={Colors.textSecondary} style={styles.subtitle}>
          {t('languageSelect.subtitleMultiline')}
        </AppText>
      </View>

      {/* ── Language options ── */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {options.map((lang) => {
          const isSelected = selected === lang.code;

          return (
            <TouchableOpacity
              key={lang.code}
              onPress={() => setSelected(lang.code)}
              activeOpacity={0.78}
              accessible
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={t('languageSelect.selectLanguageA11y', { language: t(`languageSelect.languages.${lang.code}`) })}
              style={[styles.card, isSelected && styles.cardSelected]}
            >
              <View style={styles.cardLeft}>
                {/* Language name in native script */}
                <View
                  style={[
                    styles.nativeTag,
                    isSelected && styles.nativeTagSelected,
                  ]}
                >
                  <AppText
                    style={[
                      styles.nativeText,
                      isSelected && styles.nativeTextSelected,
                    ]}
                  >
                    {lang.nativeName}
                  </AppText>
                </View>

                {/* English label */}
                <AppText
                  variant="bodyMd"
                  color={isSelected ? Colors.navy : Colors.textSecondary}
                >
                  {t(`languageSelect.languages.${lang.code}`)}
                </AppText>
              </View>

              {/* Radio */}
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── CTA ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={saving}
          activeOpacity={0.85}
          accessible
          accessibilityRole="button"
          accessibilityLabel={t('languageSelect.continue')}
          accessibilityState={{ disabled: saving }}
          style={[styles.btn, saving && styles.btnDisabled]}
        >
          {saving ? (
            <AppText variant="label" color={Colors.textInverse}>
              {t('languageSelect.pleaseWait')}
            </AppText>
          ) : (
            <>
              <AppText variant="label" color={Colors.textInverse} style={styles.btnText}>
                {t('languageSelect.continue')}
              </AppText>
              <Ionicons name="arrow-forward" size={18} color={Colors.textInverse} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.cream,
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: 2,
    alignSelf: 'flex-start',
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: Colors.navy,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.cream2,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  countryFlag: {
    fontSize: 16,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Cards ───────────────────────────────────────────────────────────────────
  list: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  cardSelected: {
    borderColor: Colors.navy,
    backgroundColor: '#EEF1F9',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },

  // Native script tag (e.g. "हिन्दी", "తెలుగు")
  nativeTag: {
    minWidth: 80,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    backgroundColor: Colors.cream2,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  nativeTagSelected: {
    backgroundColor: Colors.navy + '1A',
  },
  nativeText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  nativeTextSelected: {
    color: Colors.navy,
  },

  // ── Radio ────────────────────────────────────────────────────────────────────
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  radioSelected: {
    borderColor: Colors.navy,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.navy,
  },

  // ── Footer ───────────────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  btn: {
    height: 54,
    backgroundColor: Colors.navy,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: Colors.navy,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  btnDisabled: {
    backgroundColor: Colors.borderDark,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    fontSize: 15,
  },
});
