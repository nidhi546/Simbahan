import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientView from '../../components/ui/GradientView';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText, FloatingCross } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { a11y } from '../../utils/a11y';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';

const FEATURE_KEYS = [
  'login.feature1',
  'login.feature2',
  'login.feature3',
  'login.feature4',
];

export default function LoginScreen() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);
  const { width } = useWindowDimensions();
  const isWide = isWeb && width >= 768;

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      setError(t('login.errorMissingFields'));
      return;
    }
    setError('');
    await login();
    router.replace('/home');
  }, [email, password, login, t]);

  const togglePassword = useCallback(() => setShowPassword((v) => !v), []);

  const FormContent = (
    <>
      {error ? (
        <AppText variant="bodySm" color={Colors.crimson} style={styles.errorText}>
          {error}
        </AppText>
      ) : null}

      <View style={styles.inputWrap}>
        <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={t('login.emailPlaceholder')}
          placeholderTextColor={Colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          {...a11y}
          accessibilityLabel={t('login.emailPlaceholder')}
        />
      </View>

      <View style={styles.inputWrap}>
        <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
        <TextInput
          style={StyleSheet.flatten([styles.input, styles.inputFlex])}
          placeholder={t('auth.password')}
          placeholderTextColor={Colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          {...a11y}
          accessibilityLabel={t('auth.password')}
        />
        <TouchableOpacity
          onPress={togglePassword}
          {...a11y}
          accessibilityLabel={showPassword ? t('auth.hidePasswordA11y') : t('auth.showPasswordA11y')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color={Colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotWrap} {...a11y} accessibilityLabel={t('login.forgotPasswordA11y')}>
        <AppText variant="bodySm" color={Colors.navy}>{t('login.forgotPassword')}</AppText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogin}
        style={styles.loginBtn}
        {...a11y}
        accessibilityLabel={t('auth.signInLower')}
        activeOpacity={0.8}
      >
        <AppText variant="label" color={Colors.textInverse} style={styles.loginBtnText}>
          {t('auth.signIn')}
        </AppText>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <AppText variant="caption" color={Colors.textMuted} style={styles.dividerLabel}>{t('common.or')}</AppText>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={styles.googleBtn}
        disabled
        {...a11y}
        accessibilityLabel={t('login.googleUnavailableA11y')}
        activeOpacity={0.8}
      >
        <Ionicons name="logo-google" size={18} color={Colors.textSecondary} />
        <AppText variant="bodyMd" color={Colors.textSecondary} style={styles.googleText}>
          {t('login.continueWithGoogle')}
        </AppText>
      </TouchableOpacity>

      <View style={styles.registerRow}>
        <AppText variant="bodySm" color={Colors.textMuted}>{t('auth.noAccount')}{' '}</AppText>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/register')}
          {...a11y}
          accessibilityLabel={t('auth.createAccountA11y')}
        >
          <AppText variant="bodySm" color={Colors.navy}>{t('login.createOne')}</AppText>
        </TouchableOpacity>
      </View>
    </>
  );

  // ── WEB LAYOUT ───────────────────────────────────────────────────────────
  if (isWeb) {
    return (
      <View style={webStyles.screen}>
        {isWide ? (
          <>
            <GradientView colors={[Colors.navyDark, Colors.navy]} style={webStyles.leftPanel}>
              <FloatingCross size={200} color={Colors.textInverse} opacity={0.05} />
              <View style={webStyles.brandContent}>
                <View style={webStyles.crossBadge}>
                  <AppText variant="displayMd" color={Colors.textInverse}>✝</AppText>
                </View>
                <AppText variant="displayMd" color={Colors.textInverse} style={webStyles.brandName}>
                  Simbahan
                </AppText>
                <AppText variant="bodyLg" color={Colors.goldLight} style={webStyles.brandSub}>
                  {t('auth.tagline')}
                </AppText>
                <View style={webStyles.featureList}>
                  {FEATURE_KEYS.map((f) => (
                    <View key={f} style={webStyles.featureRow}>
                      <Ionicons name="checkmark-circle" size={16} color={Colors.gold} />
                      <AppText variant="bodySm" color={Colors.textInverse} style={{ marginLeft: 8, opacity: 0.9 }}>
                        {t(f)}
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.replace('/(public)')}
                style={webStyles.backLink}
                accessibilityLabel={t('auth.backToHomepageA11y')}
              >
                <Ionicons name="arrow-back" size={14} color={Colors.goldLight} />
                <AppText variant="caption" color={Colors.goldLight} style={{ marginLeft: 4 }}>
                  {t('auth.backToHomepage')}
                </AppText>
              </TouchableOpacity>
            </GradientView>

            <View style={webStyles.rightPanel}>
              <ScrollView
                contentContainerStyle={webStyles.formScroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={webStyles.card}>
                  <AppText variant="displaySm" color={Colors.navy} style={webStyles.cardTitle}>
                    {t('login.welcomeBack')}
                  </AppText>
                  <AppText variant="bodySm" color={Colors.textMuted} style={webStyles.cardSub}>
                    {t('auth.loginSubtitle')}
                  </AppText>
                  {FormContent}
                </View>
              </ScrollView>
            </View>
          </>
        ) : (
          <ScrollView
            contentContainerStyle={webStyles.centeredScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <GradientView colors={[Colors.navyDark, Colors.navy]} style={webStyles.tabletHeader}>
              <AppText variant="displaySm" color={Colors.textInverse}>✝ Simbahan</AppText>
              <AppText variant="bodySm" color={Colors.goldLight}>{t('auth.tagline')}</AppText>
            </GradientView>
            <View style={webStyles.tabletCard}>
              <AppText variant="headingMd" color={Colors.navy} style={webStyles.cardTitle}>{t('auth.signIn')}</AppText>
              {FormContent}
              <TouchableOpacity
                onPress={() => router.replace('/(public)')}
                style={styles.backToHome}
                accessibilityLabel={t('auth.backToHomepageA11y')}
              >
                <AppText variant="caption" color={Colors.textMuted}>← {t('auth.backToHomepage')}</AppText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    );
  }

  // ── MOBILE LAYOUT (unchanged) ────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.flex} edges={['top']}>
        <GradientView colors={[Colors.navyDark, Colors.navy]} style={styles.top}>
          <FloatingCross size={120} color={Colors.textInverse} opacity={0.06} style={styles.cross} />
          <AppText variant="displayLg" color={Colors.textInverse} style={styles.appName}>
            Simbahan
          </AppText>
          <AppText variant="bodyMd" color={Colors.goldLight} style={styles.tagline}>
            {t('auth.tagline')}
          </AppText>
        </GradientView>

        <View style={styles.bottom}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.form}
          >
            <AppText variant="headingMd" color={Colors.navy} style={styles.formTitle}>
              {t('auth.signIn')}
            </AppText>
            {FormContent}
          </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  top: { flex: 6, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cross: { position: 'absolute', top: -20, right: -20 },
  appName: { textAlign: 'center' },
  tagline: { marginTop: Spacing.xs, textAlign: 'center' },
  bottom: {
    flex: 4,
    backgroundColor: Colors.textInverse,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    marginTop: -Radius.lg,
  },
  form: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  formTitle: { marginBottom: Spacing.md },
  errorText: { marginBottom: Spacing.sm },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.cream,
    height: 48,
  },
  inputIcon: { marginRight: Spacing.xs },
  input: { flex: 1, ...Typography.bodyMd, color: Colors.textPrimary, height: 48 },
  inputFlex: { flex: 1 },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: Spacing.md },
  loginBtn: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.md,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  loginBtnText: { fontSize: 15 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerLabel: { marginHorizontal: Spacing.sm },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    height: 48,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    opacity: 0.5,
  },
  googleText: { marginLeft: Spacing.xs },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  backToHome: { alignItems: 'center', marginTop: Spacing.md },
});

const webStyles = StyleSheet.create({
  screen: { flex: 1, flexDirection: 'row', backgroundColor: Colors.cream2 },
  leftPanel: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.xxl,
    minHeight: '100%' as any,
  },
  brandContent: { flex: 1, justifyContent: 'center', gap: Spacing.md },
  crossBadge: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  brandName: { lineHeight: 40 },
  brandSub: { opacity: 0.85, marginBottom: Spacing.lg },
  featureList: { gap: Spacing.sm },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  backLink: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  rightPanel: { flex: 1, justifyContent: 'center', backgroundColor: Colors.cream2 },
  formScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  card: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: { marginBottom: 4 },
  cardSub: { marginBottom: Spacing.lg },
  centeredScroll: { flexGrow: 1, alignItems: 'center' },
  tabletHeader: {
    width: '100%',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: 4,
  },
  tabletCard: {
    backgroundColor: Colors.textInverse,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 480,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: -Radius.lg,
  },
});
