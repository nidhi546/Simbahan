import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText } from '../ui';
import churchData from '../../data/church.json';
import { useI18n } from '../../i18n';

function getDaysUntilFeast(feastDay: string): number {
  const [month, day] = feastDay.split(' ');
  const months: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };
  const now = new Date();
  let feast = new Date(now.getFullYear(), months[month], parseInt(day));
  if (feast < now) feast = new Date(now.getFullYear() + 1, months[month], parseInt(day));
  return Math.ceil((feast.getTime() - now.getTime()) / 86400000);
}

const FeastCountdown = () => {
  const days = useMemo(() => getDaysUntilFeast(churchData.feastDay), []);
  const { t } = useI18n();

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Ionicons name="star-outline" size={20} color={Colors.crimsonLight} />
        </View>
        <View style={styles.info}>
          <AppText variant="label" color={Colors.crimsonLight} style={styles.label}>
            {t('home.parishFeastLabel')}
          </AppText>
          <AppText variant="headingSm" color={Colors.textInverse} numberOfLines={2}>
            {t('home.feastOf', { patron: churchData.patron })}
          </AppText>
          <AppText variant="caption" color={Colors.crimsonPale}>{churchData.feastDay}</AppText>
          <AppText variant="caption" color={Colors.crimsonPale} style={styles.novena}>
            {t('home.novenaHint')}
          </AppText>
        </View>
      </View>
      <View style={styles.countdown}>
        <AppText variant="displayMd" color={Colors.textInverse} style={styles.days}>
          {days}
        </AppText>
        <AppText variant="caption" color={Colors.crimsonPale}>{t('home.daysLeft')}</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.crimson,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, gap: Spacing.sm },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  label: { letterSpacing: 0.5 },
  novena: { marginTop: 2, opacity: 0.8 },
  countdown: { alignItems: 'center', marginLeft: Spacing.md },
  days: { lineHeight: 34 },
});

export default React.memo(FeastCountdown);
