import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Radius, Spacing } from '../../constants/Layout';
import AppText from './AppText';
import { useI18n } from '../../i18n';

type Season = 'advent' | 'lent' | 'christmas' | 'ordinary' | 'easter' | 'pentecost';

interface LiturgicalBadgeProps {
  season: Season;
}

const seasonConfig: Record<Season, { bg: string; text: string; labelKey: string }> = {
  advent: { bg: Colors.advent, text: Colors.textInverse, labelKey: 'liturgical.seasons.advent' },
  lent: { bg: Colors.lent, text: Colors.textInverse, labelKey: 'liturgical.seasons.lent' },
  christmas: { bg: Colors.goldPale, text: Colors.navy, labelKey: 'liturgical.seasons.christmas' },
  ordinary: { bg: Colors.sagePale, text: Colors.sage, labelKey: 'liturgical.seasons.ordinary' },
  easter: { bg: Colors.goldPale, text: Colors.navy, labelKey: 'liturgical.seasons.easter' },
  pentecost: { bg: Colors.crimsonPale, text: Colors.crimson, labelKey: 'liturgical.seasons.pentecost' },
};

const LiturgicalBadge = ({ season }: LiturgicalBadgeProps) => {
  const { t } = useI18n();
  const { bg, text, labelKey } = seasonConfig[season];
  return (
    <View style={StyleSheet.flatten([styles.badge, { backgroundColor: bg }])}>
      <View style={StyleSheet.flatten([styles.dot, { backgroundColor: text }])} />
      <AppText variant="caption" color={text}>{t(labelKey)}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default React.memo(LiturgicalBadge);
