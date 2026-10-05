import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Img from './Img';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius, Shadows } from '../../constants/Layout';
import AppText from './AppText';
import { RsvpStatus } from '../../store/churchStore';
import { formatEventDate, formatTime } from '../../utils/dateHelpers';
import { useI18n } from '../../i18n';

type Props = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  rsvpEnabled: boolean;
  rsvpStatus: RsvpStatus;
  viewMode: 'list' | 'grid';
  onPress: (id: string) => void;
};

const RSVP_CONFIG = {
  Pupunta: { icon: 'checkmark-circle' as const, color: Colors.sage, labelKey: 'ui.rsvp.going' },
  Baka: { icon: 'help-circle' as const, color: Colors.gold, labelKey: 'ui.rsvp.maybe' },
  Hindi: { icon: 'close-circle' as const, color: Colors.crimson, labelKey: 'ui.rsvp.notGoing' },
};

const EventCard = ({ id, title, category, date, time, location, image, rsvpEnabled, rsvpStatus, viewMode, onPress }: Props) => {
  const handlePress = () => onPress(id);
  const { t, language } = useI18n();

  if (viewMode === 'grid') {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.gridCard, pressed && styles.pressed]}
        accessible
        accessibilityLabel={title}
      >
        <Img source={{ uri: image }} style={styles.gridImage} contentFit="cover" transition={200} />
        <View style={styles.gridBody}>
          <AppText variant="headingSm" color={Colors.navy} numberOfLines={2} style={styles.gridTitle}>
            {title}
          </AppText>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={11} color={Colors.textMuted} />
            <AppText variant="caption" color={Colors.textMuted} style={styles.metaText}>
              {formatEventDate(date, language)}
            </AppText>
          </View>
        </View>
      </Pressable>
    );
  }

  const rsvp = rsvpStatus ? RSVP_CONFIG[rsvpStatus] : null;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.listCard, pressed && styles.pressed]}
      accessible
      accessibilityLabel={title}
    >
      <Img source={{ uri: image }} style={styles.listImage} contentFit="cover" transition={200} />
      <View style={styles.listBody}>
        <View style={styles.badge}>
          <AppText variant="caption" color={Colors.navy}>{category}</AppText>
        </View>
        <AppText variant="headingSm" color={Colors.navy} numberOfLines={2} style={styles.listTitle}>
          {title}
        </AppText>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
          <AppText variant="caption" color={Colors.textMuted} style={styles.metaText}>{formatEventDate(date, language)}</AppText>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
          <AppText variant="caption" color={Colors.textMuted} style={styles.metaText}>{formatTime(time)}</AppText>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
          <AppText variant="caption" color={Colors.textMuted} style={styles.metaText} numberOfLines={1}>{location}</AppText>
        </View>
        {rsvpEnabled && rsvp && (
          <View style={styles.rsvpRow}>
            <Ionicons name={rsvp.icon} size={13} color={rsvp.color} />
            <AppText variant="caption" color={rsvp.color} style={styles.metaText}>{t(rsvp.labelKey)}</AppText>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // List
  listCard: {
    flexDirection: 'row',
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  listImage: { width: 80, height: 80, flexShrink: 0 },
  listBody: { flex: 1, padding: Spacing.sm, gap: 3 },
  listTitle: { marginTop: 2, marginBottom: 2 },
  badge: {
    backgroundColor: Colors.goldPale,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { marginLeft: 3 },
  rsvpRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  // Grid
  gridCard: {
    flex: 1,
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  gridImage: { width: '100%', height: 120, display: 'flex' },
  gridBody: { padding: Spacing.sm, gap: 4 },
  gridTitle: { fontSize: 13 },
  pressed: { opacity: 0.85 },
});

export default React.memo(EventCard);
