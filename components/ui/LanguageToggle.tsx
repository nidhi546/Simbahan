/**
 * LanguageToggle — compact segmented switch (e.g. EN | FIL).
 *
 * Switches the app language instantly and persists it via countryStore.
 * Options come from the current country's availableLanguages.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../../theme/ThemeContext';
import { useI18n } from '../../i18n';
import { useCountryStore, COUNTRIES, LanguageCode } from '../../store/countryStore';

const SHORT_LABELS: Record<LanguageCode, string> = {
  en: 'EN',
  fil: 'FIL',
  hi: 'HI',
  te: 'TE',
  ta: 'TA',
};

const LanguageToggle = () => {
  const { theme } = useTheme();
  const { language, setLanguage } = useI18n();
  const country = useCountryStore((s) => s.country);
  const options = COUNTRIES[country ?? 'PH'].availableLanguages;

  return (
    <View
      style={[styles.container, { borderColor: theme.border, backgroundColor: theme.surface }]}
      accessibilityRole="radiogroup"
    >
      {options.map((opt) => {
        const selected = opt.code === language;
        return (
          <TouchableOpacity
            key={opt.code}
            onPress={() => !selected && setLanguage(opt.code)}
            activeOpacity={0.8}
            accessible
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={opt.englishName}
            style={[styles.option, selected && { backgroundColor: theme.primary }]}
          >
            <AppText
              variant="label"
              color={selected ? '#FFFFFF' : theme.textSecondary}
              style={styles.label}
            >
              {SHORT_LABELS[opt.code]}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 999,
    padding: 2,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    minWidth: 44,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

export default React.memo(LanguageToggle);
