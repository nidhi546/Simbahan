import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Platform, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GradientView from '../../components/ui/GradientView';
import AppText from '../../components/ui/AppText';
import EmptyState from '../../components/ui/EmptyState';
import WebLayout from '../../components/ui/WebLayout';
import NotificationItem from '../../components/notifications/NotificationItem';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useModule10Store, Notification, NotifType } from '../../store/module10Store';
import BackBar from '../../components/ui/BackBar';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';

const FILTERS: { labelKey: string; key: 'all' | NotifType }[] = [
  { labelKey: 'notifications.filterAll', key: 'all'          },
  { labelKey: 'notifications.filterUnread', key: 'general'    },
  { labelKey: 'notifications.filterAnnouncement', key: 'announcement' },
  { labelKey: 'notifications.filterEvent', key: 'event'        },
  { labelKey: 'notifications.filterSacrament', key: 'sacrament'    },
];

const keyExtractor = (item: Notification) => item.id;

export default function NotificationsScreen() {
  const { t } = useI18n();
  const notifications = useModule10Store((s) => s.notifications);
  const markNotifRead = useModule10Store((s) => s.markNotifRead);
  const markAllRead   = useModule10Store((s) => s.markAllRead);
  const [filter, setFilter] = useState<'all' | NotifType | 'unread'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    if (filter === 'general') return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handlePress = useCallback((id: string) => markNotifRead(id), [markNotifRead]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Notification>) => (
    <NotificationItem item={item} onPress={handlePress} />
  ), [handlePress]);

  const ListHeader = (
    <>
     <BackBar />
      <GradientView colors={[Colors.navyDark, Colors.navy]} style={[styles.header, { marginHorizontal: -Spacing.md }]}>
        <View style={styles.headerRow}>
          <AppText variant="displaySm" color={Colors.textInverse}>{t('notifications.title')}</AppText>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllRead}
              style={styles.markAllBtn}
              accessible
              accessibilityLabel={t('notifications.markAllA11y')}
            >
              <AppText variant="label" color={Colors.goldLight}>{t('notifications.markAll')}</AppText>
            </TouchableOpacity>
          )}
        </View>
        {unreadCount > 0 && (
          <AppText variant="bodySm" color={Colors.goldLight}>{t('notifications.unreadCount', { count: unreadCount })}</AppText>
        )}
      </GradientView>

      {/* Filter tabs */}
      <View style={styles.filterWrap}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key as any)}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            accessible
            accessibilityLabel={t(f.labelKey)}
          >
            <AppText variant="label" color={filter === f.key ? Colors.textInverse : Colors.textMuted}>
              {t(f.labelKey)}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const content = (
    <FlatList
      data={filtered}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={
        <EmptyState
          icon="notifications-off-outline"
          title={t('notifications.emptyTitle')}
          message={t('notifications.emptyMessage')}
        />
      }
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={8}
      maxToRenderPerBatch={8}
    />
  );

  if (isWeb) return <WebLayout><View style={styles.screen}>{content}</View></WebLayout>;
  return <SafeAreaView style={styles.screen} edges={['top']}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xl, gap: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  markAllBtn: {
    borderWidth: 1, borderColor: Colors.goldLight + '66',
    borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2,
  },
  filterWrap: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
    padding: Spacing.md, backgroundColor: Colors.textInverse,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: Radius.full, backgroundColor: Colors.cream2,
  },
  filterChipActive: { backgroundColor: Colors.navy },
  listContent: { padding: Spacing.md, paddingBottom: Spacing.xxl },
});
