import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ListRenderItemInfo,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AnnouncementCard from '../../components/ui/AnnouncementCard';
import GradientView from '../../components/ui/GradientView';
import AppText from '../../components/ui/AppText';
import WebLayout from '../../components/ui/WebLayout';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useChurchStore } from '../../store/churchStore';
import { useUiStore } from '../../store/uiStore';
import announcementsData from '../../data/announcements.json';
import { useI18n } from '../../i18n';

type Announcement = typeof announcementsData[number];

const CATEGORIES = ['Lahat', 'Mass', 'Event', 'Sacrament', 'Youth', 'Ministry'];
const CATEGORY_LABEL_KEYS: Record<string, string> = {
  'Lahat': 'announcements.categories.all',
  'Mass': 'announcements.categories.mass',
  'Event': 'announcements.categories.event',
  'Sacrament': 'announcements.categories.sacrament',
  'Youth': 'announcements.categories.youth',
  'Ministry': 'announcements.categories.ministry',
};
const Separator = () => <View style={{ height: 8 }} />;
const keyExtractor = (item: Announcement) => item.id;
const isWeb = Platform.OS === 'web';

export default function AnnouncementsTab() {
  const announcements = useChurchStore((s) => s.announcements);
  const markRead = useChurchStore((s) => s.markAnnouncementAsRead);
  const openSidebar = useUiStore((s) => s.openSidebar);
  const [activeCategory, setActiveCategory] = useState('Lahat');
  const { isWeb: isWebBreakpoint } = useBreakpoint();
  const { t } = useI18n();

  const filtered = useMemo(() =>
    activeCategory === 'Lahat'
      ? announcements
      : announcements.filter((a) => a.category === activeCategory),
    [announcements, activeCategory]
  );

  const handlePress = useCallback((id: string) => {
    markRead(id);
    router.push(`/announcements/${id}` as never);
  }, [markRead]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Announcement>) => (
    <AnnouncementCard
      id={item.id}
      title={item.title}
      category={item.category}
      date={item.date}
      description={item.description}
      image={item.image}
      isPinned={item.isPinned}
      isRead={item.isRead}
      publishedBy={item.author}
      onPress={handlePress}
    />
  ), [handlePress]);

  const ListHeader = (
    <>
      <GradientView colors={[Colors.navyDark, Colors.navy]} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          {!isWeb && (
            <TouchableOpacity onPress={openSidebar} style={styles.menuBtn} activeOpacity={0.7} accessible accessibilityLabel={t('nav.openMenu')}>
              <Ionicons name="menu" size={24} color={Colors.textInverse} />
            </TouchableOpacity>
          )}
          <View style={styles.headerText}>
            <AppText variant="displaySm" color={Colors.textInverse} style={styles.headerTitle}>
              {t('announcements.title')}
            </AppText>
            <AppText variant="bodySm" color={Colors.goldLight}>{t('announcements.subtitle')}</AppText>
          </View>
        </View>
      </GradientView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {CATEGORIES.map((cat) => {
          const active = cat === activeCategory;
          return (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
            >
              <AppText variant="label" color={active ? Colors.textInverse : Colors.textMuted}>
                {t(CATEGORY_LABEL_KEYS[cat])}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );

  const list = (
    <FlatList
      data={filtered}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeader}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={[styles.listContent, isWebBreakpoint && styles.listContentWeb]}
      numColumns={isWebBreakpoint ? 2 : 1}
      columnWrapperStyle={isWebBreakpoint ? styles.columnWrapper : undefined}
      key={isWebBreakpoint ? 'web' : 'mobile'}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={4}
      maxToRenderPerBatch={5}
      windowSize={5}
    />
  );

  if (isWeb) {
    return (
      <WebLayout>
        <View style={styles.screen}>{list}</View>
      </WebLayout>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {list}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  headerGradient: { paddingTop: Spacing.lg, paddingBottom: Spacing.xl, marginHorizontal: -Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, paddingHorizontal: Spacing.md },
  menuBtn: { padding: Spacing.xs, marginTop: 2 },
  headerText: { flex: 1 },
  headerTitle: { marginBottom: 4 },
  filterRow: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.sm, marginHorizontal: -Spacing.md },
  pill: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: Radius.full },
  pillActive: { backgroundColor: Colors.navy },
  pillInactive: { backgroundColor: Colors.cream2 },
  listContent: { padding: Spacing.md, paddingBottom: Spacing.xl },
  listContentWeb: { paddingHorizontal: Spacing.xl },
  columnWrapper: { gap: Spacing.md },
});
