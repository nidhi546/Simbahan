import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import AppText from '../../components/ui/AppText';
import Badge from '../../components/ui/Badge';
import { useChurchStore } from '../../store/churchStore';
import { formatEventDate } from '../../utils/dateHelpers';
import { useI18n } from '../../i18n';

export default function AnnouncementDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const announcements = useChurchStore((s) => s.announcements);
  const markRead = useChurchStore((s) => s.markAnnouncementAsRead);
  const { t, language } = useI18n();

  const item = announcements.find((a) => a.id === id);

  React.useEffect(() => {
    if (item && !item.isRead) markRead(id);
  }, [id]);

  const handleBack = useCallback(() => router.back(), []);

  const handleShare = useCallback(async () => {
    if (!item) return;
    const preview = item.description.slice(0, 200);
    await Share.share({
      title: item.title,
      message: `${item.title}\n\n${preview}\n\n– San Bartolome Parish`,
    });
  }, [item]);

  if (!item) {
    return (
      <SafeAreaView style={styles.center}>
        <AppText variant="bodyMd" color={Colors.textMuted}>{t('announcements.notFound')}</AppText>
        <TouchableOpacity onPress={handleBack} style={{ marginTop: Spacing.md }}>
          <AppText variant="label" color={Colors.navy}>{t('announcements.back')}</AppText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <AppText variant="headingSm" color={Colors.navy} numberOfLines={1} style={styles.headerTitle}>
          {item.category}
        </AppText>
        <TouchableOpacity onPress={handleShare} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.iconBtn}>
          <Ionicons name="share-outline" size={22} color={Colors.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero image */}
        <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" transition={200} />

        <View style={styles.body}>
          {/* Category + date */}
          <View style={styles.metaRow}>
            <Badge label={item.category} variant="gold" size="md" />
            <AppText variant="bodySm" color={Colors.textMuted}>{formatEventDate(item.date, language)}</AppText>
          </View>

          {/* Title */}
          <AppText variant="displaySm" color={Colors.navy} style={styles.title}>
            {item.title}
          </AppText>

          {/* Posted by */}
          <AppText variant="bodySm" color={Colors.textMuted} style={styles.author}>
            {t('announcements.postedBy', { author: item.author })}
          </AppText>

          {/* Gold divider */}
          <View style={styles.divider} />

          {/* Full content */}
          <AppText variant="bodyLg" color={Colors.textPrimary} style={styles.description}>
            {item.description}
          </AppText>

          {/* Pinned notice */}
          {item.isPinned && (
            <View style={styles.pinnedBox}>
              <Ionicons name="pin" size={14} color={Colors.gold} />
              <AppText variant="bodySm" color={Colors.gold} style={{ marginLeft: 4 }}>
                {t('announcements.pinnedByAdmin')}
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconBtn: { padding: Spacing.xs },
  headerTitle: { flex: 1, textAlign: 'center' },
  image: { width: '100%', height: 200 },
  body: { padding: Spacing.md },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  title: { marginBottom: Spacing.xs },
  author: { marginBottom: Spacing.md },
  divider: {
    height: 2,
    backgroundColor: Colors.gold,
    marginBottom: Spacing.md,
    width: 48,
    borderRadius: 2,
  },
  description: { lineHeight: 26 },
  pinnedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    padding: Spacing.sm,
    backgroundColor: Colors.goldPale,
    borderRadius: Radius.sm,
  },
  content: { paddingBottom: Spacing.xxl },
});
