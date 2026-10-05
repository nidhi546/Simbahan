import React, { useCallback, useState, useMemo } from 'react';
import { View, FlatList, ScrollView, Pressable, StyleSheet, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import AppText from '../../components/ui/AppText';
import AnnouncementCard from '../../components/ui/AnnouncementCard';
import GradientView from '../../components/ui/GradientView';
import WebLayout from '../../components/ui/WebLayout';
import { useChurchStore } from '../../store/churchStore';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import announcementsData from '../../data/announcements.json';
import { useI18n } from '../../i18n';

type Announcement = typeof announcementsData[number];

const CATEGORIES = ['Lahat', 'General', 'Youth', 'Sacraments', 'Couples for Christ', 'Lenten', 'Special'];

const CATEGORY_MAP: Record<string, string[]> = {
  'Lahat': [],
  'General': ['Mass', 'Ministry', 'Event'],
  'Youth': ['Youth'],
  'Sacraments': ['Sacrament'],
  'Couples for Christ': ['Ministry'],
  'Lenten': ['Event'],
  'Special': ['Event'],
};

const CATEGORY_LABEL_KEYS: Record<string, string> = {
  'Lahat': 'announcements.categories.all',
  'General': 'announcements.categories.general',
  'Youth': 'announcements.categories.youth',
  'Sacraments': 'announcements.categories.sacraments',
  'Couples for Christ': 'announcements.categories.couplesForChrist',
  'Lenten': 'announcements.categories.lenten',
  'Special': 'announcements.categories.special',
};

const Separator = () => <View style={{ height: 8 }} />;
const keyExtractor = (item: Announcement) => item.id;

export default function AnnouncementsScreen() {
  const announcements = useChurchStore((s) => s.announcements);
  const markRead = useChurchStore((s) => s.markAnnouncementAsRead);
  const [activeCategory, setActiveCategory] = useState('Lahat');
  const { isWeb } = useBreakpoint();
  const { t } = useI18n();

  const filtered = useMemo(() => {
    if (activeCategory === 'Lahat') return announcements;
    const cats = CATEGORY_MAP[activeCategory] ?? [];
    return announcements.filter((a) => cats.includes(a.category));
  }, [announcements, activeCategory]);

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
      <GradientView
        colors={[Colors.navyDark, Colors.navy]}
        style={styles.headerGradient}
      >
        <AppText variant="displaySm" color={Colors.textInverse} style={styles.headerTitle}>
          {t('announcements.title')}
        </AppText>
        <AppText variant="bodySm" color={Colors.goldLight}>
          {t('announcements.subtitle')}
        </AppText>
      </GradientView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={StyleSheet.flatten([styles.pill, isActive ? styles.pillActive : styles.pillInactive])}
              accessible
              accessibilityLabel={t(CATEGORY_LABEL_KEYS[cat])}
            >
              <AppText
                variant="label"
                color={isActive ? Colors.textInverse : Colors.textMuted}
              >
                {t(CATEGORY_LABEL_KEYS[cat])}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );

  return (
    <WebLayout>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={StyleSheet.flatten([
            styles.listContent,
            isWeb && styles.listContentWeb,
          ])}
          numColumns={isWeb ? 2 : 1}
          columnWrapperStyle={isWeb ? styles.columnWrapper : undefined}
          key={isWeb ? 'web' : 'mobile'}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={4}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      </SafeAreaView>
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  headerGradient: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerTitle: { marginBottom: 4 },
  filterRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
  },
  pillActive: { backgroundColor: Colors.navy },
  pillInactive: { backgroundColor: Colors.cream2 },
  listContent: { padding: Spacing.md, paddingBottom: Spacing.xl },
  listContentWeb: { paddingHorizontal: Spacing.xl },
  columnWrapper: { gap: Spacing.md },
});
