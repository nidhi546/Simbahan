import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import GradientView from '../../components/ui/GradientView';
import AppText from '../../components/ui/AppText';
import WebLayout from '../../components/ui/WebLayout';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useMemberStore } from '../../store/memberStore';
import churchData from '../../data/church.json';
import BackBar from '../../components/ui/BackBar';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';

function ContactRow({ icon, label, value, onPress }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string; value: string; onPress?: () => void;
}) {
  const inner = (
    <View style={styles.contactRow}>
      <Ionicons name={icon} size={16} color={Colors.gold} />
      <View style={{ flex: 1 }}>
        <AppText variant="caption" color={Colors.textMuted}>{label}</AppText>
        <AppText variant="bodyMd" color={onPress ? Colors.navy : Colors.textPrimary}>{value}</AppText>
      </View>
      {onPress && <Ionicons name="open-outline" size={14} color={Colors.navy} />}
    </View>
  );
  if (onPress) return <TouchableOpacity onPress={onPress} accessible accessibilityLabel={label}>{inner}</TouchableOpacity>;
  return inner;
}

export default function ParishInfoScreen() {
  const members = useMemberStore((s) => s.members);
  const families = useMemberStore((s) => s.families);
  const { t } = useI18n();

  const daysToFeast = useMemo(() => {
    const now = new Date();
    const [month, day] = churchData.feastDay.split(' ');
    const months: Record<string, number> = {
      January:1,February:2,March:3,April:4,May:5,June:6,
      July:7,August:8,September:9,October:10,November:11,December:12,
    };
    let feast = new Date(now.getFullYear(), (months[month] ?? 3) - 1, parseInt(day));
    if (feast < now) feast = new Date(now.getFullYear() + 1, feast.getMonth(), feast.getDate());
    return Math.ceil((feast.getTime() - now.getTime()) / 86400000);
  }, []);

  const content = (
    <>
     <BackBar />
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <GradientView colors={[Colors.gold, Colors.goldLight]} style={styles.header}>
        <AppText variant="displaySm" color={Colors.navyDark}>{t('parishInfo.title')}</AppText>
      </GradientView>

      {/* Hero image */}
      <View style={styles.heroWrap}>
        <Image
          source={{ uri: churchData.image }}
          style={styles.heroImg}
          contentFit="cover"
          transition={200}
          accessible
          accessibilityLabel={churchData.name}
        />
        <View style={styles.heroOverlay}>
          <AppText variant="displaySm" color={Colors.textInverse} style={styles.heroName}>
            {churchData.name}
          </AppText>
          <AppText variant="bodySm" color={Colors.goldLight}>{churchData.diocese}</AppText>
        </View>
      </View>

      {/* Quick info */}
      <View style={styles.quickRow}>
        {[
          { labelKey: 'parishInfo.patron', value: churchData.patron },
          { labelKey: 'parishInfo.founded', value: churchData.founded },
          { labelKey: 'parishInfo.pastor', value: 'Fr. Santos' },
        ].map((item) => (
          <View key={item.labelKey} style={styles.quickItem}>
            <AppText variant="headingSm" color={Colors.navy}>{item.value}</AppText>
            <AppText variant="caption" color={Colors.textMuted}>{t(item.labelKey)}</AppText>
          </View>
        ))}
      </View>

      {/* Contact */}
      <View style={styles.card}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.cardTitle}>{t('parishInfo.contact')}</AppText>
        <ContactRow icon="location-outline" label={t('parishInfo.address')} value={churchData.address} />
        <View style={styles.divider} />
        <ContactRow icon="call-outline"     label={t('parishInfo.phone')} value={churchData.phone}
          onPress={() => Linking.openURL(`tel:${churchData.phone}`)} />
        <View style={styles.divider} />
        <ContactRow icon="mail-outline"     label={t('parishInfo.email')} value={churchData.email}
          onPress={() => Linking.openURL(`mailto:${churchData.email}`)} />
        <View style={styles.divider} />
        <ContactRow icon="globe-outline"    label={t('parishInfo.website')} value={churchData.website}
          onPress={() => Linking.openURL(churchData.website)} />
      </View>

      {/* Feast countdown */}
      <View style={styles.feastCard}>
        <Ionicons name="star" size={24} color={Colors.gold} />
        <View style={{ flex: 1 }}>
          <AppText variant="headingSm" color={Colors.navy}>{t('parishInfo.feastOf', { patron: churchData.patron })}</AppText>
          <AppText variant="caption" color={Colors.textMuted}>{churchData.feastDay}</AppText>
        </View>
        <View style={styles.countdownBadge}>
          <AppText variant="displaySm" color={Colors.navy}>{daysToFeast}</AppText>
          <AppText variant="caption" color={Colors.textMuted}>{t('parishInfo.daysLeft')}</AppText>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { value: members.length.toString(),  labelKey: 'parishInfo.members'    },
          { value: families.length.toString(), labelKey: 'parishInfo.families'   },
          { value: churchData.ministries.length.toString(), labelKey: 'parishInfo.ministries' },
        ].map((s, i) => (
          <React.Fragment key={s.labelKey}>
            {i > 0 && <View style={styles.statDivider} />}
            <View style={styles.statItem}>
              <AppText variant="displaySm" color={Colors.navy}>{s.value}</AppText>
              <AppText variant="caption" color={Colors.textMuted}>{t(s.labelKey)}</AppText>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Office hours */}
      <View style={styles.card}>
        <AppText variant="headingSm" color={Colors.navy} style={styles.cardTitle}>{t('parishInfo.officeHours')}</AppText>
        <View style={styles.contactRow}>
          <Ionicons name="time-outline" size={16} color={Colors.gold} />
          <AppText variant="bodyMd" color={Colors.textPrimary} style={{ flex: 1 }}>
            {churchData.officeHours}
          </AppText>
        </View>
      </View>
    </ScrollView>
    </>
  );

  if (isWeb) return <WebLayout>{content}</WebLayout>;
  return <SafeAreaView style={styles.screen} edges={['top']}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingBottom: Spacing.xxl },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xl, gap: 4 },
  heroWrap: { height: 200, position: 'relative' },
  heroImg: { width: '100%', height: 200 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    padding: Spacing.md,
    gap: 4,
  },
  heroName: { textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  quickRow: {
    flexDirection: 'row',
    backgroundColor: Colors.textInverse,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  quickItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, gap: 2 },
  card: {
    backgroundColor: Colors.textInverse, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, padding: Spacing.md, margin: Spacing.md, marginBottom: 0, gap: Spacing.xs,
  },
  cardTitle: { marginBottom: Spacing.xs },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 24 },
  feastCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.goldPale, borderWidth: 1, borderColor: Colors.gold + '55',
    borderRadius: Radius.md, padding: Spacing.md, margin: Spacing.md, marginBottom: 0,
  },
  countdownBadge: { alignItems: 'center' },
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.textInverse,
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    margin: Spacing.md, marginBottom: 0, paddingVertical: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },
});
