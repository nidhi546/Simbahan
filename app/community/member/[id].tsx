import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AppText from '../../../components/ui/AppText';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';
import WebLayout from '../../../components/ui/WebLayout';
import { Colors } from '../../../constants/Colors';
import { Spacing, Radius } from '../../../constants/Layout';
import { useMemberStore } from '../../../store/memberStore';
import { useI18n } from '../../../i18n';

const isWeb = Platform.OS === 'web';

export default function MemberDetailScreen() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const members = useMemberStore((s) => s.members);
  const families = useMemberStore((s) => s.families);

  const member = members.find((m) => m.id === id);
  const family = families.find((f) => f.id === member?.familyId);
  const familyMembers = family
    ? members.filter((m) => family.memberIds.includes(m.id) && m.id !== id)
    : [];

  if (!member) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <AppText variant="bodyMd" color={Colors.textMuted} style={{ padding: Spacing.lg }}>
          {t('member.notFound')}
        </AppText>
      </SafeAreaView>
    );
  }

  const infoRows = [
    { icon: 'location-outline' as const,  key: 'barangay', label: t('member.barangay'), value: member.barangay },
    { icon: 'calendar-outline' as const,  key: 'joined', label: t('member.joined'), value: member.joinedDate },
    { icon: 'person-outline' as const,    key: 'gender', label: t('member.gender'), value: member.gender === 'male' ? t('member.male') : t('member.female') },
    { icon: 'ribbon-outline' as const,    key: 'role', label: t('member.role'), value: member.role },
  ];

  const content = (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessible accessibilityLabel={t('member.back')}>
        <Ionicons name="arrow-back" size={20} color={Colors.navy} />
        <AppText variant="bodyMd" color={Colors.navy}>{t('member.back')}</AppText>
      </TouchableOpacity>

      {/* Avatar + name */}
      <View style={styles.profileSection}>
        <Avatar uri={member.avatar} name={member.fullName} size="lg" />
        <AppText variant="displaySm" color={Colors.navy} style={styles.name}>
          {member.fullName}
        </AppText>
        <AppText variant="bodySm" color={Colors.textMuted}>{member.barangay}</AppText>
      </View>

      {/* Ministries */}
      {member.ministries.length > 0 && (
        <View style={styles.card}>
          <AppText variant="headingSm" color={Colors.navy} style={styles.cardTitle}>{t('member.ministries')}</AppText>
          <View style={styles.badgeRow}>
            {member.ministries.map((m) => (
              <Badge key={m} label={m} variant="navy" size="md" />
            ))}
          </View>
        </View>
      )}

      {/* Info rows */}
      <View style={styles.card}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.cardTitle}>{t('member.information')}</AppText>
        {infoRows.map((row) => (
          <View key={row.key} style={styles.infoRow}>
            <Ionicons name={row.icon} size={16} color={Colors.gold} />
            <AppText variant="bodySm" color={Colors.textMuted} style={styles.infoLabel}>{row.label}</AppText>
            <AppText variant="bodyMd" color={Colors.textPrimary} style={{ flex: 1 }}>{row.value}</AppText>
          </View>
        ))}
      </View>

      {/* Family */}
      {family && (
        <View style={styles.card}>
          <AppText variant="headingSm" color={Colors.navy} style={styles.cardTitle}>
            {family.familyName}
          </AppText>
          {familyMembers.map((fm) => (
            <TouchableOpacity
              key={fm.id}
              style={styles.familyMemberRow}
              onPress={() => router.push(`/community/member/${fm.id}` as never)}
              activeOpacity={0.8}
            >
              <Avatar uri={fm.avatar} name={fm.fullName} size="sm" />
              <AppText variant="bodyMd" color={Colors.textPrimary} style={{ flex: 1 }}>
                {fm.fullName}
              </AppText>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );

  if (isWeb) return <WebLayout>{content}</WebLayout>;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.md },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  name: { textAlign: 'center', marginTop: Spacing.sm },
  card: {
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardTitle: { marginBottom: 4 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  infoLabel: { width: 80 },
  familyMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});
