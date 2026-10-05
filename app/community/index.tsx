import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppText from '../../components/ui/AppText';
import BackBar from '../../components/ui/BackBar';
import WebLayout from '../../components/ui/WebLayout';
import MemberCard from '../../components/community/MemberCard';
import Avatar from '../../components/ui/Avatar';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useMemberStore } from '../../store/memberStore';
import { useI18n } from '../../i18n';

type Member = ReturnType<typeof useMemberStore.getState>['members'][number];
type Family = ReturnType<typeof useMemberStore.getState>['families'][number];

const TABS = ['Members', 'Families'] as const;
type Tab = typeof TABS[number];
const TAB_LABEL_KEYS: Record<Tab, string> = {
  Members: 'community.tabMembers',
  Families: 'community.tabFamilies',
};

const FILTERS = ['All', 'Ministry', 'Barangay'] as const;
type Filter = typeof FILTERS[number];
const FILTER_LABEL_KEYS: Record<Filter, string> = {
  All: 'community.filterAll',
  Ministry: 'community.filterMinistry',
  Barangay: 'community.filterBarangay',
};

const isWeb = Platform.OS === 'web';
const keyExtractorM = (item: Member) => item.id;
const keyExtractorF = (item: Family) => item.id;

export default function CommunityScreen() {
  const { t } = useI18n();
  const members = useMemberStore((s) => s.members);
  const families = useMemberStore((s) => s.families);
  const [tab, setTab] = useState<Tab>('Members');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const visibleMembers = useMemo(() => {
    let list = members.filter((m) => m.isActive);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.barangay.toLowerCase().includes(q) ||
          m.ministries.some((min) => min.toLowerCase().includes(q))
      );
    }
    if (filter === 'Ministry') list = list.filter((m) => m.ministries.length > 0);
    if (filter === 'Barangay') list = [...list].sort((a, b) => a.barangay.localeCompare(b.barangay));
    return list;
  }, [members, search, filter]);

  const renderMember = useCallback(({ item }: ListRenderItemInfo<Member>) => {
    const fam = useMemberStore.getState().families.find((f) => f.id === item.familyId);
    return (
      <MemberCard
        id={item.id}
        fullName={item.fullName}
        barangay={item.barangay}
        ministries={item.ministries}
        familyName={fam?.familyName}
        avatar={item.avatar}
      />
    );
  }, []);

  const renderFamily = useCallback(({ item }: ListRenderItemInfo<Family>) => {
    const head = useMemberStore.getState().members.find((m) => m.id === item.headId);
    const initials = item.familyName.slice(0, 2).toUpperCase();
    return (
      <TouchableOpacity
        style={styles.familyCard}
        activeOpacity={0.8}
        accessible
        accessibilityLabel={item.familyName}
        onPress={() => {}}
      >
        <View style={styles.familyAvatar}>
          <AppText variant="headingSm" color={Colors.textInverse}>{initials}</AppText>
        </View>
        <View style={styles.familyInfo}>
          <AppText variant="headingSm" color={Colors.textPrimary} numberOfLines={1}>
            {item.familyName}
          </AppText>
          {head && (
            <AppText variant="caption" color={Colors.textMuted} numberOfLines={1}>
              {t('community.familyHead', { name: head.fullName })}
            </AppText>
          )}
          <AppText variant="caption" color={Colors.textMuted}>
            {t('community.familyMeta', { count: item.memberIds.length, barangay: item.barangay })}
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      </TouchableOpacity>
    );
  }, [t]);

  const MembersHeader = (
    <>
      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('community.search')}
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
          accessible
          accessibilityLabel={t('community.searchA11y')}
        />
      </View>
      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.chip, filter === f && styles.chipActive]}
            accessible
            accessibilityLabel={t(FILTER_LABEL_KEYS[f])}
          >
            <AppText variant="label" color={filter === f ? Colors.textInverse : Colors.textMuted}>
              {t(FILTER_LABEL_KEYS[f])}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  const content = (
    <View style={styles.screen}>
      <BackBar />
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="displaySm" color={Colors.navy}>{t('community.title')}</AppText>
        <AppText variant="bodySm" color={Colors.textMuted}>{t('community.subtitle')}</AppText>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tabName) => (
          <TouchableOpacity
            key={tabName}
            onPress={() => setTab(tabName)}
            style={[styles.tabBtn, tab === tabName && styles.tabBtnActive]}
            accessible
            accessibilityLabel={t(TAB_LABEL_KEYS[tabName])}
          >
            <AppText variant="label" color={tab === tabName ? Colors.navy : Colors.textMuted}>{t(TAB_LABEL_KEYS[tabName])}</AppText>
            {tab === tabName && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'Members' ? (
        <FlatList
          data={visibleMembers}
          renderItem={renderMember}
          keyExtractor={keyExtractorM}
          ListHeaderComponent={MembersHeader}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={5}
          maxToRenderPerBatch={5}
        />
      ) : (
        <FlatList
          data={families}
          renderItem={renderFamily}
          keyExtractor={keyExtractorF}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={5}
          maxToRenderPerBatch={5}
        />
      )}
    </View>
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.textInverse,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.textInverse,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    position: 'relative',
  },
  tabBtnActive: {},
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: Colors.navy,
    borderRadius: 1,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  searchIcon: { marginRight: Spacing.xs },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  filterRow: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.cream2,
  },
  chipActive: { backgroundColor: Colors.navy },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  familyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  familyAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyInfo: { flex: 1, gap: 2 },
});
