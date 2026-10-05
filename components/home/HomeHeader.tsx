import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Spacing } from '../../constants/Layout';
import { AppText, FloatingCross, LiturgicalBadge } from '../ui';
import { useAuthStore } from '../../store/authStore';
import { useChurchStore } from '../../store/churchStore';
import { useUiStore } from '../../store/uiStore';
import churchData from '../../data/church.json';
import { useI18n } from '../../i18n';
import type { LanguageCode } from '../../store/countryStore';

const isWeb = Platform.OS === 'web';

type Season = 'advent' | 'lent' | 'christmas' | 'ordinary' | 'easter' | 'pentecost';

function getGreetingKey(): string {
  const h = new Date().getHours();
  if (h < 12) return 'home.greeting';
  if (h < 18) return 'home.greetingAfternoon';
  return 'home.greetingEvening';
}

function getFilipinDate(language: LanguageCode): string {
  return new Date().toLocaleDateString(language === 'en' ? 'en-PH' : 'fil-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getCurrentSeason(calendar: { season: string; startDate: string; endDate: string }[]): Season {
  const today = new Date().toISOString().split('T')[0];
  const entry = calendar.find((c) => today >= c.startDate && today <= c.endDate);
  return (entry?.season as Season) ?? 'ordinary';
}

interface HomeHeaderProps {
  hasUnread: boolean;
}

const HomeHeader = ({ hasUnread }: HomeHeaderProps) => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const liturgicalCalendar = useChurchStore((s) => s.liturgicalCalendar);
  const openSidebar = useUiStore((s) => s.openSidebar);
  const { t, language } = useI18n();

  const greeting = useMemo(() => t(getGreetingKey()), [t]);
  const dateStr = useMemo(() => getFilipinDate(language), [language]);
  const season = useMemo(() => getCurrentSeason(liturgicalCalendar), [liturgicalCalendar]);

  const handleMenu = useCallback(() => openSidebar(), [openSidebar]);

  return (
    <View style={styles.container}>
      <FloatingCross size={140} color={Colors.textInverse} opacity={0.05} style={styles.cross} />

        <View style={styles.topRow}>
          {!isWeb ? (
            <TouchableOpacity
              onPress={handleMenu}
              accessible
              accessibilityLabel={t('nav.openMenu')}
              style={styles.menuBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color={Colors.textInverse} />
            </TouchableOpacity>
          ) : (
            <AppText variant="headingMd" color={Colors.textInverse} style={styles.logo}>
              ✝ Simbahan
            </AppText>
          )}
          <TouchableOpacity
            accessible
            accessibilityLabel={t('home.notificationsA11y')}
            style={styles.notifBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.textInverse} />
            {hasUnread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <AppText variant="bodySm" color={Colors.goldLight}>{greeting},</AppText>
          <AppText variant="displaySm" color={Colors.textInverse} numberOfLines={1}>
            {currentUser?.firstName ?? t('home.guestName')}
          </AppText>
          <AppText variant="bodyMd" color={Colors.gold} style={styles.churchName} numberOfLines={1}>
            {churchData.name}
          </AppText>
          <View style={styles.metaRow}>
            <LiturgicalBadge season={season} />
            <AppText variant="caption" color={Colors.textInverse} style={styles.dateText} numberOfLines={1}>
              {dateStr}
            </AppText>
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.navyDark,
    minHeight: 220,
    overflow: 'hidden',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  cross: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  logo: { letterSpacing: 0.5 },
  menuBtn: { padding: Spacing.xs },
  notifBtn: { padding: Spacing.xs, position: 'relative' },
  unreadDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
    borderWidth: 1.5,
    borderColor: Colors.navyDark,
  },
  body: { gap: Spacing.xs },
  churchName: { marginTop: 2 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    flexWrap: 'wrap',
  },
  dateText: { opacity: 0.75, flexShrink: 1 },
});

export default React.memo(HomeHeader);
