import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Spacing } from '../../constants/Layout';
import AppText from './AppText';
import { useI18n } from '../../i18n';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

const SectionHeader = ({ title, onSeeAll }: SectionHeaderProps) => {
  const handlePress = useCallback(() => onSeeAll?.(), [onSeeAll]);
  const { t } = useI18n();

  return (
    <View style={styles.row}>
      <AppText variant="headingMd" color={Colors.textPrimary}>{title}</AppText>
      {onSeeAll && (
        <TouchableOpacity
          onPress={handlePress}
          accessible
          accessibilityLabel={t('ui.seeAllA11y', { title })}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppText variant="label" color={Colors.gold}>{t('ui.seeAll')}</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
});

export default React.memo(SectionHeader);
