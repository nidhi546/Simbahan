import React, { useCallback, useState, useMemo } from 'react';
import { View, FlatList, ScrollView, Pressable, StyleSheet, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import AppText from '../../components/ui/AppText';
import EventCard from '../../components/ui/EventCard';
import GradientView from '../../components/ui/GradientView';
import WebLayout from '../../components/ui/WebLayout';
import { useChurchStore, Event } from '../../store/churchStore';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useI18n } from '../../i18n';

const CATEGORIES = ['Lahat', 'Liturgical', 'Youth', 'Fiesta', 'Sacraments', 'Outreach'];

const CATEGORY_MAP: Record<string, string[]> = {
  'Lahat': [],
  'Liturgical': ['Novena', 'Recollection'],
  'Youth': ['Youth'],
  'Fiesta': ['Fiesta'],
  'Sacraments': ['Sacrament'],
  'Outreach': ['Outreach'],
};

const CATEGORY_LABEL_KEYS: Record<string, string> = {
  'Lahat': 'events.categories.all',
  'Liturgical': 'events.categories.liturgical',
  'Youth': 'events.categories.youth',
  'Fiesta': 'events.categories.fiesta',
  'Sacraments': 'events.categories.sacraments',
  'Outreach': 'events.categories.outreach',
};

const Separator = () => <View style={{ height: 8 }} />;
const keyExtractor = (item: Event) => item.id;

type ViewMode = 'list' | 'grid';

export default function EventsScreen() {
  const { t } = useI18n();
  const events = useChurchStore((s) => s.events);
  const [activeCategory, setActiveCategory] = useState('Lahat');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { isWeb } = useBreakpoint();

  const filtered = useMemo(() => {
    if (activeCategory === 'Lahat') return events;
    const cats = CATEGORY_MAP[activeCategory] ?? [];
    return events.filter((e) => cats.includes(e.category));
  }, [events, activeCategory]);

  const handlePress = useCallback((id: string) => {
    router.push(`/events/${id}` as never);
  }, []);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Event>) => (
    <EventCard
      id={item.id}
      title={item.title}
      category={item.category}
      date={item.date}
      time={item.time}
      location={item.location}
      image={item.image}
      rsvpEnabled={item.rsvpEnabled}
      rsvpStatus={item.rsvpStatus}
      viewMode={viewMode}
      onPress={handlePress}
    />
  ), [handlePress, viewMode]);

  const numCols = viewMode === 'grid' ? 2 : 1;

  const ListHeader = (
    <>
      <GradientView colors={[Colors.navyDark, Colors.navy]} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <View>
            <AppText variant="displaySm" color={Colors.textInverse} style={styles.headerTitle}>
              {t('events.headerTitle')}
            </AppText>
            <AppText variant="bodySm" color={Colors.goldLight}>
              {t('events.headerSubtitle')}
            </AppText>
          </View>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={StyleSheet.flatten([styles.toggleBtn, viewMode === 'list' && styles.toggleActive])}
              accessible
              accessibilityLabel={t('events.listViewA11y')}
            >
              <Ionicons name="list" size={18} color={viewMode === 'list' ? Colors.navy : Colors.textInverse} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              style={StyleSheet.flatten([styles.toggleBtn, viewMode === 'grid' && styles.toggleActive])}
              accessible
              accessibilityLabel={t('events.gridViewA11y')}
            >
              <Ionicons name="grid" size={16} color={viewMode === 'grid' ? Colors.navy : Colors.textInverse} />
            </TouchableOpacity>
          </View>
        </View>
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
              <AppText variant="label" color={isActive ? Colors.textInverse : Colors.textMuted}>
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
          contentContainerStyle={StyleSheet.flatten([styles.listContent, isWeb && styles.listContentWeb])}
          numColumns={numCols}
          columnWrapperStyle={numCols > 1 ? styles.columnWrapper : undefined}
          key={`${viewMode}-${isWeb}`}
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
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerTitle: { marginBottom: 4 },
  toggleRow: { flexDirection: 'row', gap: Spacing.xs, marginTop: 4 },
  toggleBtn: {
    padding: Spacing.xs,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  toggleActive: { backgroundColor: Colors.textInverse },
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
