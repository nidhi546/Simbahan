/**
 * country-select.tsx
 *
 * Shown once on first launch (when country === null).
 * After selection, navigates to language-select (India only)
 * or directly to the existing app flow (Philippines).
 *
 * Skipped entirely for returning users — handled in index.tsx.
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
  CountryCode,
} from '../store/countryStore';
import { useI18n } from '../i18n';

const COUNTRY_LIST: CountryCode[] = ['PH', 'IN'];

export default function CountrySelectScreen() {
  const { t } = useI18n();
  const setCountry = useCountryStore((s) => s.setCountry);
  const [selected, setSelected] = useState<CountryCode | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSelect = useCallback((code: CountryCode) => {
    setSelected(code);
  }, []);

  const handleContinue = useCallback(async () => {
    if (!selected || saving) return;
    setSaving(true);
    await setCountry(selected);

    // India → show language selection; Philippines → go straight to app
    if (selected === 'IN') {
      router.replace('/language-select');
    } else {
      router.replace('/');
    }
    setSaving(false);
  }, [selected, saving, setCountry]);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.logoMark}>
          <Ionicons name="globe-outline" size={32} color={Colors.textInverse} />
        </View>
        <AppText variant="displaySm" color={Colors.navy} style={styles.title}>
          {t('countrySelect.title')}
        </AppText>
        <AppText variant="bodyMd" color={Colors.textSecondary} style={styles.subtitle}>
          {t('countrySelect.subtitleMultiline')}
        </AppText>
      </View>

      {/* ── Country cards ── */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {COUNTRY_LIST.map((code) => {
          const config = COUNTRIES[code];
          const isSelected = selected === code;

          return (
            <TouchableOpacity
              key={code}
              onPress={() => handleSelect(code)}
              activeOpacity={0.78}
              accessible
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={t('countrySelect.selectCountryA11y', { country: t(`countrySelect.countries.${code}`) })}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
            >
              {/* Flag + name */}
              <View style={styles.cardLeft}>
                <AppText style={styles.flag}>{config?.flag}</AppText>
                <View>
                  <AppText
                    variant="headingSm"
                    color={isSelected ? Colors.navy : Colors.textPrimary}
                  >
                    {t(`countrySelect.countries.${code}`)}
                  </AppText>
                  <AppText variant="bodySm" color={Colors.textMuted}>
                    {config?.availableLanguages?.map((l) => l.nativeName).join(' · ')}
                  </AppText>
                </View>
              </View>

              {/* Selection indicator */}
              <View
                style={[
                  styles.radio,
                  isSelected && styles.radioSelected,
                ]}
              >
                {isSelected && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── CTA ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selected || saving}
          activeOpacity={0.85}
          accessible
          accessibilityRole="button"
          accessibilityLabel={t('countrySelect.continue')}
          accessibilityState={{ disabled: !selected || saving }}
          style={[
            styles.btn,
            (!selected || saving) && styles.btnDisabled,
          ]}
        >
          {saving ? (
            <AppText variant="label" color={Colors.textInverse}>
              {t('countrySelect.pleaseWait')}
            </AppText>
          ) : (
            <>
              <AppText variant="label" color={Colors.textInverse} style={styles.btnText}>
                {t('countrySelect.continue')}
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

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
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
    marginBottom: Spacing.sm,
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
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    color: Colors.textSecondary,
  },

  // ── Cards ───────────────────────────────────────────────────────────────────
  list: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.lg,
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
  flag: {
    fontSize: 44,
    lineHeight: 52,
  },

  // ── Radio button ────────────────────────────────────────────────────────────
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

  // ── Footer / CTA ────────────────────────────────────────────────────────────
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
