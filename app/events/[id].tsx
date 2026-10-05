import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Share, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius, Shadows } from '../../constants/Layout';
import AppText from '../../components/ui/AppText';
import Badge from '../../components/ui/Badge';
import GradientView from '../../components/ui/GradientView';
import { useChurchStore, RsvpStatus } from '../../store/churchStore';
import { useUiStore } from '../../store/uiStore';
import { formatEventDate, formatTime } from '../../utils/dateHelpers';
import { useI18n } from '../../i18n';

const RSVP_OPTIONS: { status: RsvpStatus; labelKey: string; icon: React.ComponentProps<typeof Ionicons>['name']; color: string }[] = [
  { status: 'Pupunta', labelKey: 'events.rsvpGoing', icon: 'checkmark-circle-outline', color: Colors.sage },
  { status: 'Baka', labelKey: 'events.rsvpMaybe', icon: 'help-circle-outline', color: Colors.gold },
  { status: 'Hindi', labelKey: 'events.rsvpNotGoing', icon: 'close-circle-outline', color: Colors.crimson },
];

export default function EventDetail() {
  const { t, language } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const events = useChurchStore((s) => s.events);
  const setEventRsvp = useChurchStore((s) => s.setEventRsvp);
  const showToast = useUiStore((s) => s.showToast);

  const item = events.find((e) => e.id === id);

  const handleBack = useCallback(() => router.back(), []);

  const handleRsvp = useCallback((status: RsvpStatus) => {
    setEventRsvp(id, status);
    showToast(t('events.rsvpSaved'), 'success');
  }, [id, setEventRsvp, showToast, t]);

  const handleShare = useCallback(async () => {
    if (!item) return;
    await Share.share({
      title: item.title,
      message: `${item.title}\n📅 ${formatEventDate(item.date, language)} ${item.time}\n📍 ${item.location}\n\n– San Bartolome Parish`,
    });
  }, [item]);

  const handlePhone = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`);
  }, []);

  if (!item) {
    return (
      <SafeAreaView style={styles.center}>
        <AppText variant="bodyMd" color={Colors.textMuted}>{t('events.notFound')}</AppText>
        <TouchableOpacity onPress={handleBack} style={{ marginTop: Spacing.md }}>
          <AppText variant="label" color={Colors.navy}>{t('events.backLink')}</AppText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const initials = item.organizer.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Back button */}
      <TouchableOpacity onPress={handleBack} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityLabel={t('events.backA11y')}>
        <Ionicons name="chevron-back" size={24} color={Colors.textInverse} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero image with gradient overlay */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: item.image }} style={styles.heroImage} contentFit="cover" transition={200} />
          <GradientView colors={['rgba(15,26,58,0)', 'rgba(15,26,58,0.85)']} style={styles.heroOverlay}>
            <View style={styles.heroBody}>
              <Badge label={item.category} variant="gold" size="md" />
              <AppText variant="displaySm" color={Colors.textInverse} style={styles.heroTitle}>
                {item.title}
              </AppText>
            </View>
          </GradientView>
        </View>

        <View style={styles.body}>
          {/* 1. Date & Time Card */}
          <View style={styles.dateCard}>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.gold} />
              <AppText variant="bodyMd" color={Colors.textPrimary} style={styles.dateText}>
                {formatEventDate(item.date, language)}
              </AppText>
            </View>
            <View style={styles.dateRow}>
              <Ionicons name="time-outline" size={16} color={Colors.gold} />
              <AppText variant="bodyMd" color={Colors.textPrimary} style={styles.dateText}>
                {formatTime(item.time)}
                {item.endTime ? ` – ${item.endTime}` : ''}
              </AppText>
            </View>
            <View style={styles.dateRow}>
              <Ionicons name="location-outline" size={16} color={Colors.gold} />
              <AppText variant="bodyMd" color={Colors.textPrimary} style={styles.dateText}>
                {item.location}
              </AppText>
            </View>
          </View>

          {/* 2. Description */}
          <AppText variant="headingMd" color={Colors.navy} style={styles.sectionTitle}>
            {t('events.about')}
          </AppText>
          <AppText variant="bodyLg" color={Colors.textPrimary} style={styles.description}>
            {item.description}
          </AppText>

          {/* 3. Contact Block */}
          <AppText variant="headingMd" color={Colors.navy} style={styles.sectionTitle}>
            {t('events.inquiries')}
          </AppText>
          <View style={styles.contactBlock}>
            <View style={styles.avatar}>
              <AppText variant="label" color={Colors.textInverse}>{initials}</AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMd" color={Colors.textPrimary}>{item.organizer}</AppText>
              <TouchableOpacity onPress={() => handlePhone('09XX-XXX-XXXX')}>
                <AppText variant="bodySm" color={Colors.navy} style={styles.phone}>
                  09XX-XXX-XXXX
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. RSVP Section */}
          {item.rsvpEnabled && (
            <View style={styles.rsvpSection}>
              <AppText variant="headingMd" color={Colors.navy} style={styles.sectionTitle}>
                {t('events.rsvp')}
              </AppText>
              <View style={styles.rsvpCounts}>
                <View style={styles.rsvpCount}>
                  <AppText variant="headingMd" color={Colors.sage}>143</AppText>
                  <AppText variant="caption" color={Colors.textMuted}>{t('events.countGoing')}</AppText>
                </View>
                <View style={styles.rsvpCount}>
                  <AppText variant="headingMd" color={Colors.gold}>34</AppText>
                  <AppText variant="caption" color={Colors.textMuted}>{t('events.countMaybe')}</AppText>
                </View>
                <View style={styles.rsvpCount}>
                  <AppText variant="headingMd" color={Colors.crimson}>12</AppText>
                  <AppText variant="caption" color={Colors.textMuted}>{t('events.countNotGoing')}</AppText>
                </View>
              </View>
              <View style={styles.rsvpBtns}>
                {RSVP_OPTIONS.map(({ status, labelKey, color }) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => handleRsvp(status)}
                    style={StyleSheet.flatten([
                      styles.rsvpBtn,
                      { borderColor: color },
                      item.rsvpStatus === status && { backgroundColor: color },
                    ])}
                    accessible
                    accessibilityLabel={t(labelKey)}
                  >
                    <AppText
                      variant="label"
                      color={item.rsvpStatus === status ? Colors.textInverse : color}
                    >
                      {t(labelKey)}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 5. Share Button */}
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn} accessible accessibilityLabel={t('events.shareA11y')}>
            <Ionicons name="share-outline" size={18} color={Colors.navy} />
            <AppText variant="label" color={Colors.navy} style={{ marginLeft: Spacing.xs }}>
              {t('events.share')}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cream },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: Spacing.md,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: Radius.full,
    padding: Spacing.xs,
  },
  heroWrap: { position: 'relative' },
  heroImage: { width: '100%', height: 200 },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'flex-end',
  },
  heroBody: { padding: Spacing.md, gap: Spacing.xs },
  heroTitle: { marginTop: 4 },
  body: { padding: Spacing.md, gap: Spacing.sm },
  dateCard: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dateText: { flex: 1 },
  sectionTitle: { marginTop: Spacing.md, marginBottom: Spacing.xs },
  description: { lineHeight: 26 },
  contactBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: { textDecorationLine: 'underline', marginTop: 2 },
  rsvpSection: { gap: Spacing.xs },
  rsvpCounts: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  rsvpCount: { alignItems: 'center' },
  rsvpBtns: { flexDirection: 'row', gap: Spacing.sm },
  rsvpBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.navy,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  content: { paddingBottom: Spacing.xxl },
});
