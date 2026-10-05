import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Img from '../ui/Img';
import { router } from 'expo-router';
import AppText from '../ui/AppText';
import Badge from '../ui/Badge';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useI18n } from '../../i18n';

interface NovenaCardProps {
  id: string;
  patron: string;
  feastDate: string;
  image?: string;
  completedDays?: number[];
}

const NovenaCard = ({ id, patron, feastDate, image, completedDays = [] }: NovenaCardProps) => {
  const { t } = useI18n();
  const handlePress = useCallback(() => router.push(`/novenas/${id}` as never), [id]);
  const progress = completedDays.length;

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card} activeOpacity={0.8} accessible accessibilityLabel={patron}>
      <View style={styles.imgWrap}>
        {image ? (
          <Img source={{ uri: image }} style={styles.img} contentFit="cover" transition={200} />
        ) : (
          <View style={styles.imgFallback}>
            <Ionicons name="book-outline" size={28} color={Colors.gold} />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <AppText variant="headingSm" color={Colors.navy} numberOfLines={2}>{patron}</AppText>
        <AppText variant="caption" color={Colors.textMuted}>{feastDate}</AppText>
        <Badge label={t('novenas.badge')} variant="gold" />
        {progress > 0 && (
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(progress / 9) * 100}%` as any }]} />
            </View>
            <AppText variant="caption" color={Colors.sage}>{progress}/9</AppText>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
    gap: Spacing.sm,
    paddingRight: Spacing.sm,
  },
  imgWrap: { width: 72, height: 80 },
  img: { width: 72, height: 80 },
  imgFallback: {
    width: 72,
    height: 80,
    backgroundColor: Colors.goldPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, paddingVertical: Spacing.sm, gap: 4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  progressTrack: { flex: 1, height: 4, backgroundColor: Colors.cream2, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.sage, borderRadius: 2 },
});

export default React.memo(NovenaCard);
