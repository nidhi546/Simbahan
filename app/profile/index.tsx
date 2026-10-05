import React, { useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppText from '../../components/ui/AppText';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import WebLayout from '../../components/ui/WebLayout';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useAuthStore } from '../../store/authStore';
import { useChurchStore } from '../../store/churchStore';
import { useMemberStore } from '../../store/memberStore';
import { useModule10Store } from '../../store/module10Store';
import churchData from '../../data/church.json';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';

function InfoRow({ icon, label, value, onPress }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string; value: string; onPress?: () => void;
}) {
  const inner = (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color={Colors.gold} />
      <AppText variant="bodySm" color={Colors.textMuted} style={styles.infoLabel}>{label}</AppText>
      <AppText variant="bodyMd" color={onPress ? Colors.navy : Colors.textPrimary} style={{ flex: 1 }}>
        {value}
      </AppText>
      {onPress && <Ionicons name="open-outline" size={14} color={Colors.navy} />}
    </View>
  );
  if (onPress) return <TouchableOpacity onPress={onPress} accessible accessibilityLabel={label}>{inner}</TouchableOpacity>;
  return inner;
}

export default function ProfileScreen() {
  const { t } = useI18n();
  const currentUser = useAuthStore((s) => s.currentUser);
  const donations = useChurchStore((s) => s.donations);
  const families = useMemberStore((s) => s.families);
  const profileEdits = useModule10Store((s) => s.profileEdits);

  const family = families.find((f) => f.id === currentUser?.familyId);
  const myDonations = donations.filter((d) => d.memberId === currentUser?.id);
  const totalDonated = myDonations.reduce((s, d) => s + d.amount, 0);

  // Merge live edits over base data
  const name = `${profileEdits.firstName ?? currentUser?.firstName ?? ''} ${profileEdits.lastName ?? currentUser?.lastName ?? ''}`.trim();
  const phone = profileEdits.phone ?? currentUser?.phone ?? '';
  const email = profileEdits.email ?? currentUser?.email ?? '';
  const barangay = profileEdits.barangay ?? currentUser?.barangay ?? '';
  const birthday = profileEdits.birthday ?? currentUser?.birthDate ?? '';
  const ministries = currentUser?.ministries ?? [];

  const handleEdit = useCallback(() => router.push('/profile/edit' as never), []);

  const content = (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <AppText variant="displaySm" color={Colors.textInverse}>{t('profile.header')}</AppText>
          <TouchableOpacity onPress={handleEdit} style={styles.editBtn} accessible accessibilityLabel={t('profile.editA11y')}>
            <Ionicons name="create-outline" size={22} color={Colors.goldLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.heroCard}>
        <View style={styles.avatarWrap}>
          <Avatar uri={currentUser?.avatar} name={name} size="lg" />
          <View style={styles.avatarBorder} />
        </View>
        <AppText variant="displaySm" color={Colors.navy} style={styles.heroName}>{name}</AppText>
        <AppText variant="caption" color={Colors.textMuted}>
          {t('profile.joinedOn', { date: currentUser?.joinedDate ?? '—' })}
        </AppText>
        {ministries.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeRow}>
            {ministries.map((m) => <Badge key={m} label={m} variant="navy" size="md" />)}
          </ScrollView>
        )}
      </View>

      {/* Personal */}
      <View style={styles.card}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.cardTitle}>{t('profile.personal')}</AppText>
        <InfoRow icon="calendar-outline" label={t('profile.birthday')} value={birthday || '—'} />
        <InfoRow icon="location-outline" label={t('profile.barangayLabel')} value={barangay || '—'} />
        <InfoRow icon="person-outline"   label={t('profile.gender')} value={currentUser?.gender === 'male' ? t('profile.male') : t('profile.female')} />
      </View>

      {/* Contact */}
      <View style={styles.card}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.cardTitle}>{t('profile.contact')}</AppText>
        <InfoRow icon="call-outline"  label={t('profile.phone')} value={phone || '—'} onPress={phone ? () => Linking.openURL(`tel:${phone}`) : undefined} />
        <InfoRow icon="mail-outline"  label={t('profile.email')} value={email || '—'} onPress={email ? () => Linking.openURL(`mailto:${email}`) : undefined} />
      </View>

      {/* Church */}
      <View style={styles.card}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.cardTitle}>{t('profile.church')}</AppText>
        <InfoRow icon="business-outline" label={t('profile.parish')} value={churchData.name} />
        <InfoRow icon="calendar-outline" label={t('profile.joined')} value={currentUser?.joinedDate ?? '—'} />
        <InfoRow icon="ribbon-outline"   label={t('profile.role')} value={currentUser?.role ?? '—'} />
        {family && <InfoRow icon="heart-outline" label={t('profile.family')} value={family.familyName} />}
      </View>

      {/* Ministries */}
      <View style={styles.card}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.cardTitle}>{t('profile.ministries')}</AppText>
        {ministries.length > 0 ? (
          <View style={styles.ministryBadges}>
            {ministries.map((m) => <Badge key={m} label={m} variant="gold" size="md" />)}
          </View>
        ) : (
          <EmptyState icon="ribbon-outline" title={t('profile.noMinistriesTitle')} message={t('profile.noMinistriesMessage')} />
        )}
      </View>

      {/* Donation summary */}
      <View style={styles.donationCard}>
        <Ionicons name="gift-outline" size={20} color={Colors.gold} />
        <View style={{ flex: 1 }}>
          <AppText variant="displaySm" color={Colors.navy}>₱{totalDonated.toLocaleString('en-PH')}</AppText>
          <AppText variant="caption" color={Colors.textMuted}>{t('profile.donationCount', { count: myDonations.length })}</AppText>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/donations/history' as never)}
          accessible
          accessibilityLabel={t('profile.donationHistoryA11y')}
        >
          <AppText variant="label" color={Colors.navy}>{t('profile.history')}</AppText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (isWeb) return <WebLayout>{content}</WebLayout>;
  return <SafeAreaView style={styles.screen} edges={['top']}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingBottom: Spacing.xxl },
  header: {
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl + Spacing.lg,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  editBtn: { padding: Spacing.xs },
  heroCard: {
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginTop: -(Spacing.xl),
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarWrap: { position: 'relative' },
  avatarBorder: {
    position: 'absolute',
    top: -3, left: -3, right: -3, bottom: -3,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  heroName: { textAlign: 'center', marginTop: Spacing.sm },
  badgeRow: { gap: Spacing.sm, paddingVertical: Spacing.xs },
  card: {
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    margin: Spacing.md,
    marginBottom: 0,
    gap: Spacing.xs,
  },
  cardTitle: { marginBottom: Spacing.xs },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  infoLabel: { width: 90 },
  ministryBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  donationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldPale,
    borderWidth: 1,
    borderColor: Colors.gold + '66',
    borderRadius: Radius.md,
    padding: Spacing.md,
    margin: Spacing.md,
    marginBottom: 0,
    gap: Spacing.sm,
  },
});
