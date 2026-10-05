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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import GradientView from '../../components/ui/GradientView';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radius } from '../../constants/Layout';
import { AppText, Card, ScreenHeader } from '../../components/ui';
import { a11y } from '../../utils/a11y';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';
const CIVIL_STATUS = ['Single', 'Married', 'Widowed', 'Separated'];
const CIVIL_STATUS_KEYS: Record<string, string> = {
  Single: 'register.civilStatusSingle',
  Married: 'register.civilStatusMarried',
  Widowed: 'register.civilStatusWidowed',
  Separated: 'register.civilStatusSeparated',
};
const FEATURE_KEYS = [
  'register.feature1',
  'register.feature2',
  'register.feature3',
  'register.feature4',
];

// ── Shared field component ───────────────────────────────────────────────────
function FormInput({
  label, value, onChangeText, placeholder,
  keyboardType, secureTextEntry, prefix, accessibilityLabel,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; keyboardType?: any; secureTextEntry?: boolean;
  prefix?: string; accessibilityLabel?: string;
}) {
  return (
    <View style={styles.fieldWrap}>
      <AppText variant="label" color={Colors.textSecondary} style={styles.fieldLabel}>
        {label}
      </AppText>
      <View style={styles.inputRow}>
        {prefix && (
          <AppText variant="bodyMd" color={Colors.textMuted} style={styles.prefix}>{prefix}</AppText>
        )}
        <TextInput
          style={StyleSheet.flatten([styles.input, prefix ? styles.inputWithPrefix : null])}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? label}
          placeholderTextColor={Colors.textMuted}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          {...a11y}
          accessibilityLabel={accessibilityLabel ?? label}
        />
      </View>
    </View>
  );
}

// ── Web-only compact input ───────────────────────────────────────────────────
function WebInput({
  icon, placeholder, value, onChangeText,
  keyboardType, secureTextEntry, rightSlot,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  placeholder: string; value: string; onChangeText: (v: string) => void;
  keyboardType?: any; secureTextEntry?: boolean;
  rightSlot?: React.ReactNode;
}) {
  return (
    <View style={webStyles.inputWrap}>
      <Ionicons name={icon} size={16} color={Colors.textMuted} style={webStyles.inputIcon} />
      <TextInput
        style={webStyles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        {...a11y}
        accessibilityLabel={placeholder}
      />
      {rightSlot}
    </View>
  );
}

export default function RegisterScreen() {
  const { t } = useI18n();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [barangay, setBarangay] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [civilStatus, setCivilStatus] = useState('Single');
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const { width } = useWindowDimensions();
  const isWide = isWeb && width >= 768;

  const handleJoinNow = useCallback(() => {
    router.push('/(auth)/join-church');
  }, []);

  // ── Web form content ───────────────────────────────────────────────────────
  const WebFormContent = (
    <>
      {/* Name row */}
      <View style={webStyles.row}>
        <View style={{ flex: 1 }}>
          <AppText variant="label" color={Colors.textSecondary} style={webStyles.label}>{t('register.firstName')}</AppText>
          <WebInput icon="person-outline" placeholder="Juan" value={firstName} onChangeText={setFirstName} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="label" color={Colors.textSecondary} style={webStyles.label}>{t('register.lastName')}</AppText>
          <WebInput icon="person-outline" placeholder="dela Cruz" value={lastName} onChangeText={setLastName} />
        </View>
      </View>

      <AppText variant="label" color={Colors.textSecondary} style={webStyles.label}>{t('register.email')}</AppText>
      <WebInput icon="mail-outline" placeholder="you@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />

      <AppText variant="label" color={Colors.textSecondary} style={webStyles.label}>{t('register.mobile')}</AppText>
      <WebInput icon="call-outline" placeholder="+63 9XX XXX XXXX" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

      <AppText variant="label" color={Colors.textSecondary} style={webStyles.label}>{t('auth.password')}</AppText>
      <WebInput
        icon="lock-closed-outline"
        placeholder={t('register.passwordPlaceholder')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPw}
        rightSlot={
          <TouchableOpacity onPress={() => setShowPw((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        }
      />

      <AppText variant="label" color={Colors.textSecondary} style={webStyles.label}>{t('register.confirmPassword')}</AppText>
      <WebInput
        icon="lock-closed-outline"
        placeholder={t('register.confirmPasswordPlaceholder')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showCpw}
        rightSlot={
          <TouchableOpacity onPress={() => setShowCpw((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={showCpw ? 'eye-off-outline' : 'eye-outline'} size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        }
      />

      <AppText variant="caption" color={Colors.textMuted} style={webStyles.terms}>
        {t('register.terms')}
      </AppText>

      <TouchableOpacity
        onPress={handleJoinNow}
        style={webStyles.submitBtn}
        {...a11y}
        accessibilityLabel={t('auth.createAccountA11y')}
        activeOpacity={0.85}
      >
        <AppText variant="label" color={Colors.textInverse} style={{ fontSize: 15 }}>
          {t('auth.register')}
        </AppText>
      </TouchableOpacity>

      <View style={webStyles.loginRow}>
        <AppText variant="bodySm" color={Colors.textMuted}>{t('auth.hasAccount')}{' '}</AppText>
        <TouchableOpacity onPress={() => router.back()} {...a11y} accessibilityLabel={t('auth.signInLower')}>
          <AppText variant="bodySm" color={Colors.navy}>{t('auth.signInLower')}</AppText>
        </TouchableOpacity>
      </View>
    </>
  );

  // ── WEB LAYOUT ─────────────────────────────────────────────────────────────
  if (isWeb) {
    return (
      <View style={webStyles.screen}>
        {isWide ? (
          <>
            {/* Left branding panel */}
            <GradientView colors={[Colors.navyDark, Colors.navy]} style={webStyles.leftPanel}>
              <View style={webStyles.brandContent}>
                <View style={webStyles.crossBadge}>
                  <AppText variant="displayMd" color={Colors.textInverse}>✝</AppText>
                </View>
                <AppText variant="displayMd" color={Colors.textInverse} style={{ lineHeight: 40 }}>
                  Simbahan
                </AppText>
                <AppText variant="bodyLg" color={Colors.goldLight} style={{ opacity: 0.85, marginBottom: Spacing.lg }}>
                  {t('register.tagline')}
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

            {/* Right form panel */}
            <View style={webStyles.rightPanel}>
              <ScrollView
                contentContainerStyle={webStyles.formScroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={webStyles.card}>
                  <AppText variant="displaySm" color={Colors.navy} style={{ marginBottom: 4 }}>
                    {t('auth.register')}
                  </AppText>
                  <AppText variant="bodySm" color={Colors.textMuted} style={{ marginBottom: Spacing.lg }}>
                    {t('register.subtitle')}
                  </AppText>
                  {WebFormContent}
                </View>
              </ScrollView>
            </View>
          </>
        ) : (
          // Tablet centered
          <ScrollView
            contentContainerStyle={webStyles.centeredScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <GradientView colors={[Colors.navyDark, Colors.navy]} style={webStyles.tabletHeader}>
              <AppText variant="displaySm" color={Colors.textInverse}>✝ Simbahan</AppText>
              <AppText variant="bodySm" color={Colors.goldLight}>{t('register.tagline')}</AppText>
            </GradientView>
            <View style={webStyles.tabletCard}>
              <AppText variant="headingMd" color={Colors.navy} style={{ marginBottom: Spacing.md }}>
                {t('auth.register')}
              </AppText>
              {WebFormContent}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }

  // ── MOBILE LAYOUT (original, unchanged) ────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScreenHeader
          title={t('auth.register')}
          subtitle={t('register.tagline')}
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Ionicons name="camera-outline" size={28} color={Colors.textMuted} />
            </View>
            <AppText variant="caption" color={Colors.textMuted} style={styles.avatarLabel}>
              {t('register.addPhoto')}
            </AppText>
          </View>

          <AppText variant="headingSm" color={Colors.navy} style={styles.sectionTitle}>
            {t('register.personalInformation')}
          </AppText>
          <Card style={styles.card}>
            <FormInput label={t('register.firstName')} value={firstName} onChangeText={setFirstName} />
            <FormInput label={t('register.lastName')} value={lastName} onChangeText={setLastName} />
            <View style={styles.fieldWrap}>
              <AppText variant="label" color={Colors.textSecondary} style={styles.fieldLabel}>{t('register.birthday')}</AppText>
              <TouchableOpacity style={styles.inputRow} {...a11y} accessibilityLabel={t('register.selectBirthdayA11y')} activeOpacity={0.7}>
                <AppText variant="bodyMd" color={Colors.textMuted}>{t('register.selectDate')}</AppText>
                <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldWrap}>
              <AppText variant="label" color={Colors.textSecondary} style={styles.fieldLabel}>{t('register.civilStatus')}</AppText>
              <View style={styles.segmentRow}>
                {CIVIL_STATUS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setCivilStatus(s)}
                    style={StyleSheet.flatten([styles.segment, civilStatus === s && styles.segmentActive])}
                    {...a11y}
                    accessibilityLabel={t(CIVIL_STATUS_KEYS[s])}
                    activeOpacity={0.8}
                  >
                    <AppText variant="caption" color={civilStatus === s ? Colors.textInverse : Colors.textSecondary}>
                      {t(CIVIL_STATUS_KEYS[s])}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>

          <AppText variant="headingSm" color={Colors.navy} style={styles.sectionTitle}>{t('register.contactDetails')}</AppText>
          <Card style={styles.card}>
            <FormInput label={t('register.mobile')} value={mobile} onChangeText={setMobile} prefix="+63" keyboardType="phone-pad" placeholder="9XX XXX XXXX" />
            <FormInput label={t('register.email')} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="you@email.com" />
            <FormInput label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry placeholder={t('register.passwordPlaceholder')} />
            <FormInput label={t('register.confirmPassword')} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder={t('register.confirmPasswordPlaceholder')} />
          </Card>

          <AppText variant="headingSm" color={Colors.navy} style={styles.sectionTitle}>{t('register.address')}</AppText>
          <Card style={styles.card}>
            <FormInput label={t('register.barangay')} value={barangay} onChangeText={setBarangay} />
            <FormInput label={t('register.municipality')} value={municipality} onChangeText={setMunicipality} />
          </Card>

          <TouchableOpacity onPress={handleJoinNow} style={styles.joinBtn} {...a11y} accessibilityLabel={t('register.joinNow')} activeOpacity={0.8}>
            <AppText variant="label" color={Colors.textInverse} style={styles.joinBtnText}>{t('register.joinNow')}</AppText>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <AppText variant="bodySm" color={Colors.textMuted}>{t('auth.hasAccount')}{' '}</AppText>
            <TouchableOpacity onPress={() => router.back()} {...a11y} accessibilityLabel={t('auth.signInLower')}>
              <AppText variant="bodySm" color={Colors.navy}>{t('auth.signInLower')}</AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// ── Mobile styles (original, untouched) ─────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.cream },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  avatarWrap: { alignItems: 'center', marginBottom: Spacing.lg },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.cream2, borderWidth: 2,
    borderColor: Colors.border, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLabel: { marginTop: Spacing.xs },
  sectionTitle: { marginBottom: Spacing.sm },
  card: { marginBottom: Spacing.md, padding: Spacing.md },
  fieldWrap: { marginBottom: Spacing.sm },
  fieldLabel: { marginBottom: 4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm, height: 44, backgroundColor: Colors.cream,
  },
  prefix: { marginRight: Spacing.xs },
  input: { flex: 1, ...Typography.bodyMd, color: Colors.textPrimary, height: 44, ...Platform.select({ web: { outlineStyle: 'none' } as any }) },
  inputWithPrefix: { flex: 1 },
  segmentRow: { flexDirection: 'row', gap: Spacing.xs },
  segment: {
    flex: 1, paddingVertical: Spacing.xs, borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', backgroundColor: Colors.cream,
  },
  segmentActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  joinBtn: {
    backgroundColor: Colors.navy, borderRadius: Radius.md,
    height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
  },
  joinBtnText: { fontSize: 15 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});

// ── Web-only styles ──────────────────────────────────────────────────────────
const webStyles = StyleSheet.create({
  screen: { flex: 1, flexDirection: 'row', backgroundColor: Colors.cream2 },

  leftPanel: { flex: 1, justifyContent: 'space-between', padding: Spacing.xxl },
  brandContent: { flex: 1, justifyContent: 'center', gap: Spacing.md },
  crossBadge: {
    width: 64, height: 64, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  featureList: { gap: Spacing.sm },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  backLink: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },

  rightPanel: { flex: 1, justifyContent: 'center', backgroundColor: Colors.cream2 },
  formScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  card: {
    backgroundColor: Colors.textInverse, borderRadius: Radius.lg,
    padding: Spacing.xl, width: '100%', maxWidth: 480,
    borderWidth: 1, borderColor: Colors.border,
  },

  centeredScroll: { flexGrow: 1, alignItems: 'center' },
  tabletHeader: {
    width: '100%', paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl, alignItems: 'center', gap: 4,
  },
  tabletCard: {
    backgroundColor: Colors.textInverse, borderRadius: Radius.lg,
    padding: Spacing.xl, width: '100%', maxWidth: 520,
    borderWidth: 1, borderColor: Colors.border, marginTop: -Radius.lg,
  },

  row: { flexDirection: 'row', gap: Spacing.md, marginBottom: 0 },
  label: { marginBottom: 4, marginTop: Spacing.sm },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm, height: 44,
    backgroundColor: Colors.cream, marginBottom: Spacing.xs,
  },
  inputIcon: { marginRight: Spacing.xs },
  input: { flex: 1, ...Typography.bodyMd, color: Colors.textPrimary, height: 44, ...Platform.select({ web: { outlineStyle: 'none' } as any }) },
  terms: { marginVertical: Spacing.md, textAlign: 'center', lineHeight: 18 },
  submitBtn: {
    backgroundColor: Colors.navy, borderRadius: Radius.md,
    height: 48, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
  },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
