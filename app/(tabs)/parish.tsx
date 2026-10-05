import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import WebLayout from '../../components/ui/WebLayout';
import parish from '../../data/parish.json';
import { useI18n } from '../../i18n';

const Fonts = {
  heading: 'PlayfairDisplay_700Bold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
} as const;

type InfoRowProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  onPress?: () => void;
};

const InfoRow = React.memo(({ icon, label, value, onPress }: InfoRowProps) => (
  <Pressable onPress={onPress} style={styles.infoRow} disabled={!onPress}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={18} color={Colors.navy} />
    </View>
    <View style={styles.infoBody}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
    {onPress && <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />}
  </Pressable>
));

const isWeb = Platform.OS === 'web';

export default function ParishScreen() {
  const { isWeb: isWebBreakpoint } = useBreakpoint();
  const { t } = useI18n();
  const callParish = () => Linking.openURL(`tel:${parish.phone}`);
  const emailParish = () => Linking.openURL(`mailto:${parish.email}`);

  const infoRows = (
    <>
      <InfoRow icon="person" label={t('parish.parishPriest')} value={parish.pastor} />
      <InfoRow icon="location" label={t('parish.address')} value={parish.address} />
      <InfoRow icon="call" label={t('parish.phone')} value={parish.phone} onPress={callParish} />
      <InfoRow icon="mail" label={t('parish.email')} value={parish.email} onPress={emailParish} />
      <InfoRow icon="time" label={t('parish.officeHours')} value={parish.officeHours} />
    </>
  );

  const scrollContent = (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Image
        source={{ uri: parish.image }}
        style={{ width: '100%', height: isWebBreakpoint ? 300 : 200 }}
        contentFit="cover"
      />
      {isWebBreakpoint ? (
        <View style={styles.webLayout}>
          <View style={styles.webLeft}>
            <Text style={styles.webHeading}>{parish.name}</Text>
            <Text style={styles.webDiocese}>{parish.diocese}</Text>
            {infoRows}
          </View>
          <View style={styles.webSidebar}>
            <Text style={styles.connectTitle}>{t('parish.connectWithUs')}</Text>
            <Pressable
              onPress={() => Linking.openURL(parish.socialLinks.facebook)}
              style={styles.socialRow}
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text style={styles.socialText}>{t('parish.facebookPage')}</Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(parish.socialLinks.youtube)}
              style={styles.socialRow}
            >
              <Ionicons name="logo-youtube" size={20} color="#FF0000" />
              <Text style={styles.socialText}>{t('parish.youtubeChannel')}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.mobileBody}>
          <Text style={styles.mobileHeading}>{parish.name}</Text>
          <Text style={styles.mobileDiocese}>{parish.diocese}</Text>
          {infoRows}
        </View>
      )}
    </ScrollView>
  );

  if (isWeb) {
    return (
      <WebLayout>
        <View style={styles.screen}>{scrollContent}</View>
      </WebLayout>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {scrollContent}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoIcon: {
    backgroundColor: `${Colors.navy}15`,
    borderRadius: Radius.sm,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  infoBody: { flex: 1 },
  infoLabel: { fontFamily: 'DMSans_400Regular', color: '#9CA3AF', fontSize: 12 },
  infoValue: { fontFamily: 'DMSans_500Medium', color: Colors.textPrimary, fontSize: 14 },
  webLayout: { flexDirection: 'row', padding: 32 },
  webLeft: { flex: 1, marginRight: 32 },
  webHeading: { fontFamily: 'PlayfairDisplay_700Bold', color: Colors.textPrimary, fontSize: 32 },
  webDiocese: { fontFamily: 'DMSans_400Regular', color: Colors.gold, fontSize: 14, marginBottom: 24 },
  webSidebar: {
    width: 280,
    backgroundColor: Colors.textInverse,
    borderRadius: 16,
    padding: 20,
    alignSelf: 'flex-start',
  },
  connectTitle: { fontFamily: 'PlayfairDisplay_700Bold', color: Colors.textPrimary, fontSize: 16, marginBottom: 16 },
  socialRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  socialText: { fontFamily: 'DMSans_500Medium', color: Colors.textPrimary, fontSize: 14, marginLeft: 10 },
  mobileBody: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xxl },
  mobileHeading: { fontFamily: 'PlayfairDisplay_700Bold', color: Colors.textPrimary, fontSize: 24 },
  mobileDiocese: { fontFamily: 'DMSans_400Regular', color: Colors.gold, fontSize: 14, marginBottom: 20 },
});
