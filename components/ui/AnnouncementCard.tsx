import React, { useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Img from './Img';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius, Shadows } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import AppText from './AppText';
import { formatShortDate, timeAgo } from '../../utils/dateHelpers';
import { useI18n } from '../../i18n';

type Props = {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  image?: string;
  isPinned: boolean;
  isRead: boolean;
  publishedBy: string;
  onPress: (id: string) => void;
};

const AnnouncementCard = ({ id, title, category, date, description, image, isPinned, isRead, publishedBy, onPress }: Props) => {
  const handlePress = useCallback(() => onPress(id), [id, onPress]);
  const { t, language } = useI18n();
  const preview = description.length > 120 ? description.slice(0, 120) + '...' : description;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, isPinned && styles.pinnedBorder, pressed && styles.pressed]}
      accessible
      accessibilityLabel={title}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.badgeWrap}>
          <View style={styles.badge}>
            <AppText variant="caption" color={Colors.navy}>{category}</AppText>
          </View>
          {!isRead && <View style={styles.unreadDot} />}
        </View>
        <AppText variant="caption" color={Colors.textMuted}>{formatShortDate(date, language)}</AppText>
      </View>

      {/* Image */}
      {!!image && (
        <Img
          source={{ uri: image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      )}

      {/* Title */}
      <AppText variant="headingSm" color={Colors.navy} style={styles.title} numberOfLines={2}>
        {title}
      </AppText>

      {/* Preview */}
      <AppText variant="bodySm" color={Colors.textSecondary} style={styles.preview}>
        {preview}
      </AppText>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View style={styles.metaItem}>
          <Ionicons name="person-outline" size={12} color={Colors.textMuted} />
          <AppText variant="caption" color={Colors.textMuted} style={styles.metaText}>
            {publishedBy}
          </AppText>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
          <AppText variant="caption" color={Colors.textMuted} style={styles.metaText}>
            {timeAgo(date, language)}
          </AppText>
        </View>
      </View>

      {/* Pinned label */}
      {isPinned && (
        <View style={styles.pinnedLabel}>
          <AppText variant="caption" color={Colors.gold}>{t('ui.pinned')}</AppText>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    ...Shadows.sm,
  },
  pinnedBorder: {
    borderLeftColor: Colors.gold,
  },
  pressed: { opacity: 0.85 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  badgeWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  badge: {
    backgroundColor: Colors.goldPale,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.crimson,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
    display: 'flex',
  },
  title: {
    marginBottom: Spacing.xs,
  },
  preview: {
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { marginLeft: 2 },
  pinnedLabel: { marginTop: Spacing.xs },
});

export default React.memo(AnnouncementCard);
