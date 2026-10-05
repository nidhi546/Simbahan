import React, { useCallback } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import Img from '../ui/Img';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText, Badge, SectionHeader } from '../ui';
import { useChurchStore } from '../../store/churchStore';
import { useI18n } from '../../i18n';

type Event = ReturnType<typeof useChurchStore.getState>['events'][number];

const keyExtractor = (item: Event) => item.id;

const EventCard = React.memo(({ item }: { item: Event }) => {
  const handlePress = useCallback(() => router.push('/(tabs)/schedule' as never), []);
  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible
      accessibilityLabel={item.title}
      activeOpacity={0.85}
      style={styles.card}
    >
      <Img source={{ uri: item.image }} style={styles.image} contentFit="cover" transition={200} />
      <View style={styles.overlay} />
      <View style={styles.cardContent}>
        <Badge label={item.category} variant="gold" />
        <AppText variant="headingSm" color={Colors.textInverse} numberOfLines={2} style={styles.title}>
          {item.title}
        </AppText>
        <View style={styles.dateRow}>
          <AppText variant="caption" color={Colors.goldLight}>{item.date}</AppText>
          <AppText variant="caption" color={Colors.goldLight}>  ·  {item.time}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const EventPreview = () => {
  const events = useChurchStore((s) => s.events);
  const { t } = useI18n();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Event>) => <EventCard item={item} />,
    []
  );

  const handleSeeAll = useCallback(() => router.push('/(tabs)/schedule' as never), []);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <SectionHeader title={t('home.events')} onSeeAll={handleSeeAll} />
      </View>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        removeClippedSubviews
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.md },
  header: { paddingHorizontal: Spacing.md },
  list: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  card: {
    width: 220,
    height: 150,
    borderRadius: Radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,20,50,0.55)',
  },
  cardContent: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: 'flex-end',
    gap: Spacing.xs,
  },
  title: { lineHeight: 20 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
});

export default React.memo(EventPreview);
