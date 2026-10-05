import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText, Badge, SectionHeader } from '../ui';
import { useChurchStore } from '../../store/churchStore';
import { useI18n } from '../../i18n';

function timeAgo(dateStr: string, t: ReturnType<typeof useI18n>['t']): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return t('home.today');
  if (days === 1) return t('home.yesterday');
  if (days < 7) return t('home.daysAgo', { count: days });
  return t('home.weeksAgo', { count: Math.floor(days / 7) });
}

const AnnouncementPreview = () => {
  const announcements = useChurchStore((s) => s.announcements);
  const { t } = useI18n();

  const preview = useMemo(() => announcements.slice(0, 2), [announcements]);

  const handleSeeAll = useCallback(() => router.push('/(tabs)/announcements' as never), []);
  const handlePress = useCallback(
    (id: string) => router.push(`/announcements/${id}` as never),
    []
  );

  return (
    <View style={styles.wrap}>
      <SectionHeader title={t('announcements.title')} onSeeAll={handleSeeAll} />
      {preview.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handlePress(item.id)}
          accessible
          accessibilityLabel={item.title}
          activeOpacity={0.8}
          style={styles.card}
        >
          {!item.isRead && <View style={styles.unread} />}
          <View style={styles.cardBody}>
            <View style={styles.topRow}>
              <Badge label={item.category} variant="gold" />
              <AppText variant="caption" color={Colors.textMuted}>{timeAgo(item.date, t)}</AppText>
            </View>
            <AppText variant="headingSm" color={Colors.navy} numberOfLines={2} style={styles.title}>
              {item.title}
            </AppText>
            <AppText variant="bodySm" color={Colors.textSecondary} numberOfLines={2}>
              {item.description}
            </AppText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: Spacing.md },
  card: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  unread: {
    width: 4,
    backgroundColor: Colors.gold,
  },
  cardBody: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { marginTop: 2 },
});

export default React.memo(AnnouncementPreview);
