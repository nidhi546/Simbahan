import React, { useCallback, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Switch, Alert, Modal, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import GradientView from '../../components/ui/GradientView';
import AppText from '../../components/ui/AppText';
import AppButton from '../../components/ui/AppButton';
import WebLayout from '../../components/ui/WebLayout';
import { Spacing, Radius } from '../../constants/Layout';
import { useAuthStore } from '../../store/authStore';
import { useModule10Store } from '../../store/module10Store';
import { useTheme } from '../../theme/ThemeContext';
import { useCountryStore, COUNTRIES, ENABLE_COUNTRY_SELECTION } from '../../store/countryStore';
import churchData from '../../data/church.json';
import BackBar from '../../components/ui/BackBar';
import LanguageToggle from '../../components/ui/LanguageToggle';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';
const APP_VERSION = '1.0.0 (Module 10)';

const TEXT_SIZE_KEYS: Record<'Small' | 'Normal' | 'Large', string> = {
  Small: 'settings.textSizeSmall',
  Normal: 'settings.textSizeNormal',
  Large: 'settings.textSizeLarge',
};

function SettingRow({ icon, label, value, onPress, right }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string; value?: string; onPress?: () => void;
  right?: React.ReactNode;
}) {
  const { theme } = useTheme();
  const inner = (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: theme.surface2 }]}>
        <Ionicons name={icon} size={18} color={theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyMd" color={theme.text}>{label}</AppText>
        {value && <AppText variant="caption" color={theme.textMuted}>{value}</AppText>}
      </View>
      {right ?? (onPress && <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />)}
    </View>
  );
  if (onPress) return (
    <TouchableOpacity onPress={onPress} accessible accessibilityLabel={label} activeOpacity={0.75}>
      {inner}
    </TouchableOpacity>
  );
  return inner;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={styles.sectionCard}>
      <AppText variant="label" color={theme.textMuted} style={styles.sectionLabel}>
        {title.toUpperCase()}
      </AppText>
      <View style={[styles.sectionBody, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { theme, mode, toggleTheme } = useTheme();
  const { t } = useI18n();
  const logout = useAuthStore((s) => s.logout);
  const settings = useModule10Store((s) => s.settings);
  const updateSettings = useModule10Store((s) => s.updateSettings);
  const updateNotifSettings = useModule10Store((s) => s.updateNotifSettings);

  const country         = useCountryStore((s) => s.country);
  const resetCountry    = useCountryStore((s) => s.reset);
  const countryConfig   = country ? COUNTRIES[country] : null;

  const [aboutVisible, setAboutVisible] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);

  const handleChangeCountry = useCallback(() => {
    Alert.alert(
      t('settings.changeCountry'),
      t('settings.changeCountryMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.reset'),
          style: 'destructive',
          onPress: async () => {
            await resetCountry();
            router.replace('/country-select');
          },
        },
      ],
    );
  }, [resetCountry, t]);

  const handleChangeLanguage = useCallback(() => {
    router.push('/language-select' as never);
  }, []);

  const handleLogout = useCallback(() => {
    if (Platform.OS === 'web') {
      logout().then(() => router.replace('/(auth)/login'));
      return;
    }
    Alert.alert(
      t('auth.logout'),
      t('settings.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('auth.logout'), style: 'destructive', onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        }},
      ]
    );
  }, [logout, t]);

  const toggle = useCallback((key: keyof typeof settings.notif) =>
    updateNotifSettings({ [key]: !settings.notif[key] }), [settings.notif, updateNotifSettings]);

  const divider = <View style={[styles.divider, { backgroundColor: theme.border }]} />;

  const content = (
    <>
      <BackBar />
      <ScrollView
        style={[styles.screen, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <GradientView colors={[theme.primaryDark, theme.primary]} style={styles.header}>
          <AppText variant="displaySm" color={theme.textInverse}>{t('settings.title')}</AppText>
          <AppText variant="bodySm" color={theme.accentLight}>{t('settings.subtitle')}</AppText>
        </GradientView>

        {/* Appearance — dark mode toggle */}
        <SectionCard title={t('settings.theme')}>
          <SettingRow
            icon={mode === 'dark' ? 'moon' : 'sunny-outline'}
            label={t('settings.darkMode')}
            value={mode === 'dark' ? t('settings.on') : t('settings.off')}
            right={
              <Switch
                value={mode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.textInverse}
                accessible
                accessibilityLabel={t('settings.toggleDarkModeA11y')}
              />
            }
          />
        </SectionCard>

        {/* Account */}
        <SectionCard title={t('settings.account')}>
          <SettingRow icon="person-outline" label={t('profile.edit')} onPress={() => router.push('/profile/edit' as never)} />
          {divider}
          <SettingRow icon="lock-closed-outline" label={t('settings.changePassword')} onPress={() => setPwVisible(true)} />
          {divider}
          <SettingRow icon="business-outline" label={t('settings.myChurch')} value={churchData.name} />
        </SectionCard>

        {/* Notifications */}
        <SectionCard title={t('settings.notifications')}>
          {([
            ['announcements',    'settings.notifAnnouncements',    'newspaper-outline'    ],
            ['events',           'settings.notifEvents',           'star-outline'         ],
            ['sacraments',       'settings.notifSacraments',       'water-outline'        ],
            ['dailyReadings',    'settings.notifDailyReadings',    'book-outline'         ],
            ['fastingReminders', 'settings.notifFastingReminders', 'alert-circle-outline' ],
          ] as [keyof typeof settings.notif, string, React.ComponentProps<typeof Ionicons>['name']][]).map(([key, labelKey, icon], i) => (
            <React.Fragment key={key}>
              {i > 0 && divider}
              <SettingRow
                icon={icon}
                label={t(labelKey)}
                right={
                  <Switch
                    value={settings.notif[key]}
                    onValueChange={() => toggle(key)}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor={theme.textInverse}
                    accessible
                    accessibilityLabel={t(labelKey)}
                  />
                }
              />
            </React.Fragment>
          ))}
        </SectionCard>

        {/* Preferences */}
        <SectionCard title={t('settings.preferences')}>
          {ENABLE_COUNTRY_SELECTION && (
            <>
              <SettingRow
                icon="globe-outline"
                label={t('settings.country')}
                value={countryConfig ? `${countryConfig.flag}  ${countryConfig.name}` : t('settings.notSet')}
                onPress={handleChangeCountry}
              />
              {divider}
              <SettingRow
                icon="language-outline"
                label={t('settings.language')}
                value={countryConfig?.availableLanguages.find(
                  (l) => l.code === useCountryStore.getState().language
                )?.nativeName ?? '—'}
                onPress={handleChangeLanguage}
              />
              {divider}
            </>
          )}
          <SettingRow
            icon="language-outline"
            label={t('settings.language')}
            right={<LanguageToggle />}
          />
          {divider}
          <SettingRow
            icon="text-outline"
            label={t('settings.textSize')}
            value={t(TEXT_SIZE_KEYS[settings.textSize])}
            right={
              <TouchableOpacity
                onPress={() => {
                  const sizes = ['Small', 'Normal', 'Large'] as const;
                  const idx = sizes.indexOf(settings.textSize);
                  updateSettings({ textSize: sizes[(idx + 1) % 3] });
                }}
                style={[styles.togglePill, { borderColor: theme.border }]}
                accessible
                accessibilityLabel={t('settings.changeTextSizeA11y')}
              >
                <AppText variant="label" color={theme.primary}>{t(TEXT_SIZE_KEYS[settings.textSize])}</AppText>
              </TouchableOpacity>
            }
          />
          {divider}
          <SettingRow
            icon="eye-outline"
            label={t('settings.directoryVisible')}
            right={
              <Switch
                value={settings.directoryVisible}
                onValueChange={(v) => updateSettings({ directoryVisible: v })}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.textInverse}
                accessible
                accessibilityLabel={t('settings.directoryVisibilityA11y')}
              />
            }
          />
        </SectionCard>

        {/* About */}
        <SectionCard title={t('settings.about')}>
          <SettingRow icon="information-circle-outline" label={t('settings.version')} value={APP_VERSION} />
          {divider}
          <SettingRow icon="business-outline" label={t('settings.parish')} value={churchData.name} />
          {divider}
          <SettingRow icon="globe-outline" label={t('settings.diocese')} value={churchData.diocese} />
          {divider}
          <SettingRow icon="help-circle-outline" label={t('settings.aboutSimbahanApp')} onPress={() => setAboutVisible(true)} />
        </SectionCard>

        {/* Logout */}
        <View style={styles.logoutWrap}>
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.logoutBtn, { borderColor: theme.danger + '44', backgroundColor: theme.dangerPale }]}
            accessible
            accessibilityLabel={t('auth.logout')}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.danger} />
            <AppText variant="headingSm" color={theme.danger}>{t('auth.logout')}</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );

  return (
    <>
      {isWeb
        ? <WebLayout>{content}</WebLayout>
        : <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]} edges={['top']}>{content}</SafeAreaView>
      }

      {/* About modal */}
      <Modal visible={aboutVisible} transparent animationType="fade" onRequestClose={() => setAboutVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
            <AppText variant="headingMd" color={theme.primary}>✝ Simbahan App</AppText>
            <AppText variant="bodyMd" color={theme.textSecondary} style={{ textAlign: 'center' }}>
              {t('settings.aboutDescription')}
            </AppText>
            <AppText variant="caption" color={theme.textMuted}>{t('settings.versionLabel', { version: APP_VERSION })}</AppText>
            <AppButton label={t('common.close')} onPress={() => setAboutVisible(false)} variant="ghost" />
          </View>
        </View>
      </Modal>

      {/* Change password modal */}
      <Modal visible={pwVisible} transparent animationType="slide" onRequestClose={() => setPwVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
            <AppText variant="headingMd" color={theme.primary}>{t('settings.changePassword')}</AppText>
            <AppText variant="bodyMd" color={theme.textSecondary} style={{ textAlign: 'center' }}>
              {t('settings.changePasswordMessage')}
            </AppText>
            <AppButton label={t('common.close')} onPress={() => setPwVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { paddingBottom: Spacing.xxl },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xl, gap: 4 },
  sectionCard: { margin: Spacing.md, marginBottom: 0 },
  sectionLabel: { marginBottom: Spacing.xs, marginLeft: Spacing.xs, letterSpacing: 0.5 },
  sectionBody: { borderWidth: 1, borderRadius: Radius.md, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2,
  },
  settingIcon: {
    width: 32, height: 32, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  divider: { height: 1, marginLeft: Spacing.md + 32 + Spacing.sm },
  togglePill: {
    borderWidth: 1, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 2,
  },
  logoutWrap: { margin: Spacing.md, marginTop: Spacing.lg },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, borderWidth: 1, borderRadius: Radius.md, paddingVertical: Spacing.md,
  },
  modalOverlay: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl,
  },
  modalCard: {
    borderRadius: Radius.lg, padding: Spacing.xl,
    alignItems: 'center', gap: Spacing.md, width: '100%', maxWidth: 360,
  },
});
