import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import GradientView from '../../components/ui/GradientView';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText, Card, Badge } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { useI18n } from '../../i18n';

const DEMO_CHURCHES = [
  {
    id: 'c1',
    name: 'Saint Joseph Parish',
    diocese: 'Archdiocese of Manila',
    address: '123 Parish Road, Quezon City',
    members: 1240,
    image: 'https://picsum.photos/id/1060/300/150',
  },
  {
    id: 'c2',
    name: 'Santo Niño Parish',
    diocese: 'Diocese of Cubao',
    address: '45 Cebu Ave., Cubao, Quezon City',
    members: 890,
    image: 'https://picsum.photos/id/1040/300/150',
  },
  {
    id: 'c3',
    name: 'Our Lady of Lourdes Parish',
    diocese: 'Archdiocese of Manila',
    address: '78 Lourdes St., Sta. Mesa, Manila',
    members: 650,
    image: 'https://picsum.photos/id/1050/300/150',
  },
];

type Church = typeof DEMO_CHURCHES[number];

export default function JoinChurchScreen() {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const filtered = useMemo(
    () =>
      DEMO_CHURCHES.filter(
        (c) =>
          query.trim() === '' ||
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.diocese.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const handleRequest = useCallback((church: Church) => {
    setSelectedChurch(church);
    setModalVisible(true);
  }, []);

  const handleSubmit = useCallback(() => {
    setModalVisible(false);
    setSuccess(true);
  }, []);

  const handleSkip = useCallback(async () => {
    await setOnboarded();
    router.replace('/home');
  }, [setOnboarded]);

  const keyExtractor = useCallback((item: Church) => item.id, []);

  const renderChurch = useCallback(
    ({ item }: ListRenderItemInfo<Church>) => (
      <Card style={styles.churchCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.churchImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.churchBody}>
          <AppText variant="headingSm" color={Colors.navy}>{item.name}</AppText>
          <View style={styles.churchMeta}>
            <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
            <AppText variant="caption" color={Colors.textMuted} style={styles.metaText}>
              {item.address}
            </AppText>
          </View>
          <AppText variant="caption" color={Colors.textMuted}>{item.diocese}</AppText>
          <View style={styles.churchFooter}>
            <Badge label={t('joinChurch.members', { count: item.members.toLocaleString() })} variant="navy" />
            <TouchableOpacity
              onPress={() => handleRequest(item)}
              style={styles.requestBtn}
              accessible
              accessibilityLabel={t('joinChurch.requestToJoinA11y', { church: item.name })}
              activeOpacity={0.8}
            >
              <AppText variant="label" color={Colors.textInverse}>{t('joinChurch.requestToJoin')}</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    ),
    [handleRequest, t]
  );

  // Success screen
  if (success) {
    return (
      <SafeAreaView style={styles.successScreen} edges={['top', 'bottom']}>
        <View style={styles.successContent}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={40} color={Colors.textInverse} />
          </View>
          <AppText variant="displaySm" color={Colors.navy} style={styles.successTitle}>
            {t('joinChurch.requestSent')}
          </AppText>
          <AppText variant="bodyMd" color={Colors.textSecondary} style={styles.successSub}>
            {t('joinChurch.requestSentMessage', { church: selectedChurch?.name ?? '' })}
          </AppText>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            style={styles.backLoginBtn}
            accessible
            accessibilityLabel={t('joinChurch.backToLogin')}
            activeOpacity={0.8}
          >
            <AppText variant="label" color={Colors.textInverse}>{t('joinChurch.backToLogin')}</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSkip}
            accessible
            accessibilityLabel={t('joinChurch.skipApprovalA11y')}
            style={styles.skipLink}
          >
            <AppText variant="bodySm" color={Colors.navy}>{t('joinChurch.skipApproval')}</AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      {/* Gold gradient header */}
      <GradientView
        colors={[Colors.gold, Colors.goldLight]}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          accessible
          accessibilityLabel={t('joinChurch.goBackA11y')}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <AppText variant="headingMd" color={Colors.navy}>{t('joinChurch.title')}</AppText>
        <AppText variant="bodySm" color={Colors.navyDark} style={styles.headerSub}>
          {t('joinChurch.subtitle')}
        </AppText>
      </GradientView>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('joinChurch.searchPlaceholder')}
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
          accessible
          accessibilityLabel={t('joinChurch.searchA11y')}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} accessible accessibilityLabel={t('joinChurch.clearSearchA11y')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderChurch}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={5}
        maxToRenderPerBatch={5}
      />

      {/* Request Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <AppText variant="headingMd" color={Colors.navy} style={styles.modalTitle}>
              {t('joinChurch.requestToJoin')}
            </AppText>
            {selectedChurch && (
              <AppText variant="bodyMd" color={Colors.textSecondary} style={styles.modalChurch}>
                {selectedChurch.name}
              </AppText>
            )}
            <AppText variant="label" color={Colors.textSecondary} style={styles.modalLabel}>
              {t('joinChurch.messageLabel')}
            </AppText>
            <TextInput
              style={styles.messageInput}
              placeholder={t('joinChurch.messagePlaceholder')}
              placeholderTextColor={Colors.textMuted}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              accessible
              accessibilityLabel={t('joinChurch.messageA11y')}
            />
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitBtn}
              accessible
              accessibilityLabel={t('joinChurch.submitRequestA11y')}
              activeOpacity={0.8}
            >
              <AppText variant="label" color={Colors.textInverse}>{t('joinChurch.submitRequest')}</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              accessible
              accessibilityLabel={t('common.cancel')}
              style={styles.cancelBtn}
            >
              <AppText variant="bodyMd" color={Colors.textMuted}>{t('common.cancel')}</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.cream },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  backBtn: { marginBottom: Spacing.sm },
  headerSub: { marginTop: 2 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 44,
  },
  searchIcon: { marginRight: Spacing.xs },
  searchInput: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    height: 44,
  },
  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
  churchCard: { marginBottom: Spacing.md, padding: 0, overflow: 'hidden' },
  churchImage: { width: '100%', height: 130 },
  churchBody: { padding: Spacing.md },
  churchMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 2 },
  metaText: { marginLeft: 4 },
  churchFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  requestBtn: {
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.textInverse,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: { marginBottom: Spacing.xs },
  modalChurch: { marginBottom: Spacing.md },
  modalLabel: { marginBottom: Spacing.xs },
  messageInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
    backgroundColor: Colors.cream,
  },
  submitBtn: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.md,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cancelBtn: { alignItems: 'center', paddingVertical: Spacing.sm },
  // Success
  successScreen: {
    flex: 1,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: { textAlign: 'center', marginBottom: Spacing.sm },
  successSub: { textAlign: 'center', marginBottom: Spacing.xl },
  backLoginBtn: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.md,
    height: 48,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  skipLink: { paddingVertical: Spacing.sm },
});
