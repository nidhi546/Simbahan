import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppText from './AppText';
import { Spacing } from '../../constants/Layout';
import { useTheme } from '../../theme/ThemeContext';
import { useI18n } from '../../i18n';

interface BackBarProps {
  label?: string;
  onBack?: () => void;
}

const BackBar = ({ label: labelProp, onBack }: BackBarProps) => {
  const { theme } = useTheme();
  const { t } = useI18n();
  const label = labelProp ?? t('nav.menuMore');

  const handleBack = useCallback(() => {
    if (onBack) { onBack(); return; }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/more' as never);
    }
  }, [onBack]);

  return (
    <View style={[styles.bar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <TouchableOpacity
        onPress={handleBack}
        style={styles.btn}
        activeOpacity={0.7}
        accessible
        accessibilityLabel={t('ui.backTo', { label })}
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="chevron-back" size={20} color={theme.primary} />
        <AppText variant="label" color={theme.primary}>{label}</AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
});

export default React.memo(BackBar);
