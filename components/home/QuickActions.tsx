import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText } from '../ui';
import { useI18n } from '../../i18n';

type Action = {
  id: string;
  labelKey: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  route: string;
  accent: string;
};

const ACTIONS: Action[] = [
  { id: '1', labelKey: 'home.actions.announcements', icon: 'newspaper-outline', route: '/(tabs)/announcements', accent: Colors.navy },
  { id: '2', labelKey: 'home.actions.events', icon: 'calendar-outline', route: '/(tabs)/schedule', accent: Colors.gold },
  { id: '3', labelKey: 'home.actions.donations', icon: 'gift-outline', route: '/(tabs)/more', accent: Colors.sage },
  { id: '4', labelKey: 'home.actions.prayers', icon: 'heart-outline', route: '/(tabs)/more', accent: Colors.crimson },
];

const ActionItem = React.memo(({ item }: { item: Action }) => {
  const handlePress = useCallback(() => router.push(item.route as never), [item.route]);
  const { t } = useI18n();
  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible
      accessibilityLabel={t(item.labelKey)}
      activeOpacity={0.75}
      style={styles.item}
    >
      <View style={StyleSheet.flatten([styles.iconWrap, { backgroundColor: item.accent + '18' }])}>
        <Ionicons name={item.icon} size={24} color={item.accent} />
      </View>
      <AppText variant="label" color={Colors.textPrimary} style={styles.label}>
        {t(item.labelKey)}
      </AppText>
    </TouchableOpacity>
  );
});

const QuickActions = () => (
  <View style={styles.grid}>
    {ACTIONS.map((a) => (
      <ActionItem key={a.id} item={a} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  item: {
    width: '47.5%',
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flexShrink: 1 },
});

export default React.memo(QuickActions);
