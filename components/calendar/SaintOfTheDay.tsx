import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText } from '../ui';
import { useI18n } from '../../i18n';
import { formatRank } from '../../utils/liturgicalHelpers';

type Saint = {
  name: string;
  memorialType: string;
  description: string;
};

// Demo saint data keyed by month-day
const SAINTS: Record<string, Saint> = {
  '01-05': { name: 'Saint John Neumann', memorialType: 'Memorial', description: 'Bishop and missionary who served immigrants in America.' },
  '01-06': { name: 'Saint André Bessette', memorialType: 'Optional Memorial', description: 'Canadian lay brother known for his devotion to Saint Joseph.' },
  '01-12': { name: 'Saint Marguerite Bourgeoys', memorialType: 'Memorial', description: 'Founder of the Congregation of Notre Dame.' },
  '03-19': { name: 'Saint Joseph', memorialType: 'Solemnity', description: 'Husband of the Blessed Virgin Mary and foster father of Jesus.' },
  '03-25': { name: 'Annunciation of the Lord', memorialType: 'Solemnity', description: 'The announcement by the Angel Gabriel to Mary.' },
};

function getTodaySaint(): Saint | null {
  const d = new Date();
  const key = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return SAINTS[key] ?? null;
}

const SaintOfTheDay = () => {
  const { t } = useI18n();
  const saint = getTodaySaint();
  if (!saint) return null;

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="person-outline" size={22} color={Colors.gold} />
      </View>
      <View style={styles.content}>
        <AppText variant="label" color={Colors.gold} style={styles.sectionLabel}>
          {t('calendar.saintOfTheDay')}
        </AppText>
        <AppText variant="headingSm" color={Colors.navy}>{saint.name}</AppText>
        <AppText variant="caption" color={Colors.textMuted} style={styles.type}>
          {formatRank(saint.memorialType, t)}
        </AppText>
        <AppText variant="bodySm" color={Colors.textSecondary} numberOfLines={3}>
          {saint.description}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.goldPale,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gold + '40',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.gold + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: 2 },
  sectionLabel: { letterSpacing: 0.5 },
  type: { marginBottom: 2 },
});

export default React.memo(SaintOfTheDay);
