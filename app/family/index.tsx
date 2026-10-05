import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GradientView from '../../components/ui/GradientView';
import AppText from '../../components/ui/AppText';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import AppButton from '../../components/ui/AppButton';
import BackBar from '../../components/ui/BackBar';
import WebLayout from '../../components/ui/WebLayout';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useAuthStore } from '../../store/authStore';
import { useMemberStore } from '../../store/memberStore';
import { useChurchStore } from '../../store/churchStore';
import { useFamilyStore } from '../../store/familyStore';
import { useUiStore } from '../../store/uiStore';
import { useI18n } from '../../i18n';

const RELATIONSHIPS = ['Anak', 'Magulang', 'Kapatid', 'Lolo/Lola', 'Apo', 'Iba pa'];
const RELATIONSHIP_KEYS: Record<string, string> = {
  'Anak': 'family.relChild',
  'Magulang': 'family.relParent',
  'Kapatid': 'family.relSibling',
  'Lolo/Lola': 'family.relGrandparent',
  'Apo': 'family.relGrandchild',
  'Iba pa': 'family.relOther',
};
const isWeb = Platform.OS === 'web';

export default function FamilyScreen() {
  const { t } = useI18n();
  const currentUser = useAuthStore((s) => s.currentUser);
  const members = useMemberStore((s) => s.members);
  const families = useMemberStore((s) => s.families);
  const donations = useChurchStore((s) => s.donations);
  const dependents = useFamilyStore((s) => s.dependents);
  const addDependent = useFamilyStore((s) => s.addDependent);
  const showToast = useUiStore((s) => s.showToast);

  const family = families.find((f) => f.id === currentUser?.familyId);
  const familyMembers = family
    ? members.filter((m) => family.memberIds.includes(m.id))
    : currentUser
    ? [currentUser]
    : [];
  const head = members.find((m) => m.id === family?.headId);
  const myDependents = dependents.filter((d) => d.familyId === (family?.id ?? ''));

  const familyDonations = donations.filter((d) => d.memberId === currentUser?.id);
  const totalDonated = familyDonations.reduce((s, d) => s + d.amount, 0);

  // Invite modal
  const [inviteVisible, setInviteVisible] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');

  // Dependent modal
  const [depVisible, setDepVisible] = useState(false);
  const [depName, setDepName] = useState('');
  const [depRel, setDepRel] = useState(RELATIONSHIPS[0]);
  const [depBday, setDepBday] = useState('');

  const handleInvite = useCallback(() => {
    setInviteVisible(false);
    setInviteSearch('');
    showToast(t('family.inviteSent'), 'success');
  }, [showToast, t]);

  const handleAddDependent = useCallback(() => {
    if (!depName.trim()) {
      showToast(t('family.nameRequired'), 'error');
      return;
    }
    addDependent({
      id: `dep_${Date.now()}`,
      name: depName.trim(),
      relationship: depRel,
      birthday: depBday,
      familyId: family?.id ?? 'unknown',
    });
    setDepVisible(false);
    setDepName('');
    setDepBday('');
    showToast(t('family.dependentAdded'), 'success');
  }, [depName, depRel, depBday, family, addDependent, showToast, t]);

  const content = (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <BackBar />
      <GradientView colors={[Colors.sage, '#3D8A65']} style={styles.header}>
        <AppText variant="displaySm" color={Colors.textInverse}>{t('community.family')}</AppText>
        <AppText variant="bodySm" color="rgba(255,255,255,0.8)">
          {family?.familyName ?? t('family.yourFamily')}
        </AppText>
      </GradientView>

      {/* Family header card */}
      <View style={styles.card}>
        <AppText variant="headingMd" color={Colors.navy}>
          {family?.familyName ?? t('family.family')}
        </AppText>
        {head && (
          <View style={styles.infoRow}>
            <Ionicons name="ribbon-outline" size={16} color={Colors.gold} />
            <AppText variant="bodySm" color={Colors.textMuted} style={styles.infoLabel}>{t('family.head')}</AppText>
            <AppText variant="bodyMd" color={Colors.textPrimary}>{head.fullName}</AppText>
          </View>
        )}
        {family?.barangay && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={Colors.gold} />
            <AppText variant="bodySm" color={Colors.textMuted} style={styles.infoLabel}>{t('family.barangay')}</AppText>
            <AppText variant="bodyMd" color={Colors.textPrimary}>{family.barangay}</AppText>
          </View>
        )}
        {family?.weddingDate && (
          <View style={styles.infoRow}>
            <Ionicons name="heart-outline" size={16} color={Colors.gold} />
            <AppText variant="bodySm" color={Colors.textMuted} style={styles.infoLabel}>{t('family.wedding')}</AppText>
            <AppText variant="bodyMd" color={Colors.textPrimary}>{family.weddingDate}</AppText>
          </View>
        )}
      </View>

      {/* Members */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="headingSm" color={Colors.navy}>{t('community.members')}</AppText>
          <TouchableOpacity
            onPress={() => setInviteVisible(true)}
            style={styles.addBtn}
            accessible
            accessibilityLabel={t('family.inviteA11y')}
          >
            <Ionicons name="person-add-outline" size={16} color={Colors.navy} />
            <AppText variant="label" color={Colors.navy}>{t('family.invite')}</AppText>
          </TouchableOpacity>
        </View>
        {familyMembers.map((m) => (
          <View key={m.id} style={styles.memberRow}>
            <Avatar uri={m.avatar} name={m.fullName} size="sm" />
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMd" color={Colors.textPrimary}>{m.fullName}</AppText>
              <AppText variant="caption" color={Colors.textMuted}>{m.role}</AppText>
            </View>
            {m.ministries.length > 0 && (
              <Badge label={m.ministries[0]} variant="gold" />
            )}
          </View>
        ))}
      </View>

      {/* Dependents */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="headingSm" color={Colors.navy}>{t('family.dependents')}</AppText>
          <TouchableOpacity
            onPress={() => setDepVisible(true)}
            style={styles.addBtn}
            accessible
            accessibilityLabel={t('family.addDependentA11y')}
          >
            <Ionicons name="add-circle-outline" size={16} color={Colors.navy} />
            <AppText variant="label" color={Colors.navy}>{t('family.add')}</AppText>
          </TouchableOpacity>
        </View>
        {myDependents.length === 0 ? (
          <AppText variant="bodySm" color={Colors.textMuted}>{t('family.noDependents')}</AppText>
        ) : (
          myDependents.map((d) => (
            <View key={d.id} style={styles.depRow}>
              <View style={styles.depAvatar}>
                <AppText variant="label" color={Colors.textInverse}>{d.name[0]}</AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyMd" color={Colors.textPrimary}>{d.name}</AppText>
                <AppText variant="caption" color={Colors.textMuted}>{RELATIONSHIP_KEYS[d.relationship] ? t(RELATIONSHIP_KEYS[d.relationship]) : d.relationship}</AppText>
              </View>
              {!!d.birthday && (
                <AppText variant="caption" color={Colors.textMuted}>{d.birthday}</AppText>
              )}
            </View>
          ))
        )}
      </View>

      {/* Donations summary */}
      <View style={styles.card}>
        <AppText variant="headingSm" color={Colors.navy}>{t('family.familyDonations')}</AppText>
        <AppText variant="displaySm" color={Colors.gold}>
          ₱{totalDonated.toLocaleString('en-PH')}
        </AppText>
        <AppText variant="caption" color={Colors.textMuted}>
          {t('family.totalDonations', { count: familyDonations.length })}
        </AppText>
      </View>
    </ScrollView>
  );

  return (
    <>
      {isWeb ? (
        <WebLayout>{content}</WebLayout>
      ) : (
        <SafeAreaView style={styles.screen} edges={['top']}>{content}</SafeAreaView>
      )}

      {/* Invite Modal */}
      <Modal visible={inviteVisible} transparent animationType="slide" onRequestClose={() => setInviteVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <AppText variant="headingSm" color={Colors.navy} style={styles.modalTitle}>
              {t('family.inviteTitle')}
            </AppText>
            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
              <TextInput
                value={inviteSearch}
                onChangeText={setInviteSearch}
                placeholder={t('family.invitePlaceholder')}
                placeholderTextColor={Colors.textMuted}
                style={styles.searchInput}
              />
            </View>
            <View style={styles.modalBtns}>
              <AppButton label={t('family.sendInvite')} onPress={handleInvite} />
              <AppButton label={t('common.cancel')} onPress={() => setInviteVisible(false)} variant="ghost" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Dependent Modal */}
      <Modal visible={depVisible} transparent animationType="slide" onRequestClose={() => setDepVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <AppText variant="headingSm" color={Colors.navy} style={styles.modalTitle}>
              {t('family.addDependentTitle')}
            </AppText>

            <AppText variant="label" color={Colors.textSecondary} style={styles.fieldLabel}>{t('family.name')}</AppText>
            <TextInput
              value={depName}
              onChangeText={setDepName}
              placeholder={t('family.fullNamePlaceholder')}
              placeholderTextColor={Colors.textMuted}
              style={styles.input}
            />

            <AppText variant="label" color={Colors.textSecondary} style={styles.fieldLabel}>{t('family.relationship')}</AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relRow}>
              {RELATIONSHIPS.map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setDepRel(r)}
                  style={[styles.chip, depRel === r && styles.chipActive]}
                >
                  <AppText variant="label" color={depRel === r ? Colors.textInverse : Colors.textMuted}>{t(RELATIONSHIP_KEYS[r])}</AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <AppText variant="label" color={Colors.textSecondary} style={styles.fieldLabel}>{t('family.birthdayLabel')}</AppText>
            <TextInput
              value={depBday}
              onChangeText={setDepBday}
              placeholder="2000-01-01"
              placeholderTextColor={Colors.textMuted}
              style={styles.input}
            />

            <View style={styles.modalBtns}>
              <AppButton label={t('common.save')} onPress={handleAddDependent} />
              <AppButton label={t('common.cancel')} onPress={() => setDepVisible(false)} variant="ghost" />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  scrollContent: { paddingBottom: Spacing.xxl, gap: Spacing.md },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: 4,
  },
  card: {
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  infoLabel: { width: 100 },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  depRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  depAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.textInverse,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  modalTitle: { marginBottom: Spacing.sm },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  fieldLabel: { marginBottom: -4 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  relRow: { gap: Spacing.sm, paddingVertical: Spacing.xs },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.cream2,
  },
  chipActive: { backgroundColor: Colors.navy },
  modalBtns: { gap: Spacing.sm, marginTop: Spacing.sm },
});
