import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Img from '../ui/Img';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText } from '../ui';
import { useAuthStore } from '../../store/authStore';
import { useMemberStore } from '../../store/memberStore';
import { useI18n } from '../../i18n';

const FamilyCard = () => {
  const { t } = useI18n();
  const currentUser = useAuthStore((s) => s.currentUser);
  const families = useMemberStore((s) => s.families);
  const members = useMemberStore((s) => s.members);

  const family = useMemo(
    () => families.find((f) => f.id === currentUser?.familyId),
    [families, currentUser]
  );

  const familyMembers = useMemo(
    () => (family ? members.filter((m) => family.memberIds.includes(m.id)) : []),
    [family, members]
  );

  const handlePress = useCallback(() => router.push('/(tabs)/more' as never), []);

  if (!family) return null;

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible
      accessibilityLabel={t('family.cardViewA11y', { name: family.familyName })}
      activeOpacity={0.85}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="people-outline" size={18} color={Colors.sage} />
        </View>
        <AppText variant="label" color={Colors.sage} style={styles.sectionLabel}>
          {t('family.cardTitle')}
        </AppText>
      </View>
      <AppText variant="headingSm" color={Colors.navy} style={styles.familyName}>
        {family.familyName}
      </AppText>
      <View style={styles.bottomRow}>
        <View style={styles.avatarRow}>
          {familyMembers.slice(0, 4).map((m, i) => (
            <Img
              key={m.id}
              source={{ uri: m.avatar }}
              style={StyleSheet.flatten([styles.avatar, { marginLeft: i === 0 ? 0 : -10 }])}
              contentFit="cover"
            />
          ))}
          {familyMembers.length > 4 && (
            <View style={StyleSheet.flatten([styles.avatar, styles.moreAvatar, { marginLeft: -10 }])}>
              <AppText variant="caption" color={Colors.textInverse}>
                +{familyMembers.length - 4}
              </AppText>
            </View>
          )}
        </View>
        <AppText variant="bodySm" color={Colors.textMuted}>
          {t('family.cardMemberCount', { count: familyMembers.length })}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.sagePale,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.sage + '40',
    gap: Spacing.xs,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.sage + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: { letterSpacing: 0.5 },
  familyName: { marginTop: 2 },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.sagePale,
  },
  moreAvatar: {
    backgroundColor: Colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(FamilyCard);
