import React, { useState, useCallback } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AppText from '../../components/ui/AppText';
import AppButton from '../../components/ui/AppButton';
import WebLayout from '../../components/ui/WebLayout';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import { useModule09Store, SacramentType } from '../../store/module09Store';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';

const LABEL_KEYS: Record<string, string> = {
  baptism: 'sacraments.types.baptism', marriage: 'sacraments.types.marriage', confirmation: 'sacraments.types.confirmation',
  anointing: 'sacraments.types.anointing', funeral: 'sacraments.types.funeral', other: 'sacraments.types.other',
};

const SACRAMENT_TYPES: SacramentType[] = ['baptism','marriage','confirmation','anointing','funeral','other'];

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <AppText variant="label" color={Colors.textSecondary} style={styles.fieldLabel}>{label}</AppText>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? label}
        placeholderTextColor={Colors.textMuted}
        style={[styles.input, multiline && styles.inputMulti]}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        accessible
        accessibilityLabel={label}
      />
    </View>
  );
}

export default function SacramentRequestScreen() {
  const { type: paramType } = useLocalSearchParams<{ type?: string }>();
  const [sacType, setSacType] = useState<SacramentType>((paramType as SacramentType) ?? 'baptism');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const submitRequest = useModule09Store((s) => s.submitSacramentRequest);
  const currentUser = useAuthStore((s) => s.currentUser);
  const showToast = useUiStore((s) => s.showToast);
  const { t } = useI18n();

  const set = useCallback((key: string) => (val: string) => setFields((f) => ({ ...f, [key]: val })), []);

  const handleSubmit = useCallback(async () => {
    setSaving(true);
    submitRequest({
      id: `sac_${Date.now()}`,
      type: sacType,
      memberId: currentUser?.id ?? '',
      memberName: currentUser?.fullName ?? 'Anonymous',
      status: 'submitted',
      preferredDate: fields.date ?? '',
      notes: fields.notes ?? '',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      childName: fields.childName,
      parentNames: fields.parentNames,
      spouseName: fields.spouseName,
      patientName: fields.patientName,
      location: fields.location,
      urgency: fields.urgency,
      deceasedName: fields.deceasedName,
      contact: fields.contact,
    });
    setSaving(false);
    setSubmitted(true);
    showToast(t('sacramentRequest.submittedToast'), 'success');
  }, [sacType, fields, currentUser, submitRequest, showToast, t]);

  if (submitted) {
    return (
      <SafeAreaView style={[styles.screen, styles.successScreen]} edges={['top']}>
        <Ionicons name="checkmark-circle" size={72} color={Colors.sage} />
        <AppText variant="displaySm" color={Colors.navy} style={{ textAlign: 'center' }}>
          {t('sacramentRequest.successTitle')}
        </AppText>
        <AppText variant="bodyMd" color={Colors.textSecondary} style={{ textAlign: 'center' }}>
          {t('sacramentRequest.successMessage')}
        </AppText>
        <AppButton label={t('sacramentRequest.back')} onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const content = (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessible accessibilityLabel={t('sacramentRequest.back')}>
          <Ionicons name="arrow-back" size={20} color={Colors.navy} />
          <AppText variant="bodyMd" color={Colors.navy}>{t('sacramentRequest.back')}</AppText>
        </TouchableOpacity>
        <AppText variant="headingMd" color={Colors.navy}>{t('sacramentRequest.title')}</AppText>
      </View>

      {/* Type selector */}
      <View style={styles.card}>
        <AppText variant="headingSm" color={Colors.navy}>{t('sacramentRequest.typeLabel')}</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
          {SACRAMENT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setSacType(type)}
              style={[styles.typeChip, sacType === type && styles.typeChipActive]}
              accessible
              accessibilityLabel={t(LABEL_KEYS[type])}
            >
              <AppText variant="label" color={sacType === type ? Colors.textInverse : Colors.textMuted}>
                {t(LABEL_KEYS[type])}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Dynamic fields */}
      <View style={styles.card}>
        <AppText variant="headingSm" color={Colors.navy}>{t(LABEL_KEYS[sacType])}</AppText>

        {sacType === 'baptism' && <>
          <Field label={t('sacramentRequest.childName')} value={fields.childName ?? ''} onChange={set('childName')} />
          <Field label={t('sacramentRequest.parentNames')} value={fields.parentNames ?? ''} onChange={set('parentNames')} />
          <Field label={t('sacramentRequest.baptismDate')} value={fields.date ?? ''} onChange={set('date')} placeholder="YYYY-MM-DD" />
          <Field label={t('sacramentRequest.contact')} value={fields.contact ?? ''} onChange={set('contact')} />
        </>}

        {sacType === 'marriage' && <>
          <Field label={t('sacramentRequest.brideName')} value={fields.spouseName ?? ''} onChange={set('spouseName')} placeholder={t('sacramentRequest.brideNamePlaceholder')} />
          <Field label={t('sacramentRequest.groomName')} value={fields.parentNames ?? ''} onChange={set('parentNames')} placeholder={t('sacramentRequest.groomNamePlaceholder')} />
          <Field label={t('sacramentRequest.weddingDate')} value={fields.date ?? ''} onChange={set('date')} placeholder="YYYY-MM-DD" />
          <Field label={t('sacramentRequest.contact')} value={fields.contact ?? ''} onChange={set('contact')} />
        </>}

        {sacType === 'anointing' && <>
          <Field label={t('sacramentRequest.patientName')} value={fields.patientName ?? ''} onChange={set('patientName')} />
          <Field label={t('sacramentRequest.location')} value={fields.location ?? ''} onChange={set('location')} />
          <Field label={t('sacramentRequest.urgency')} value={fields.urgency ?? ''} onChange={set('urgency')} placeholder={t('sacramentRequest.urgencyPlaceholder')} />
        </>}

        {sacType === 'funeral' && <>
          <Field label={t('sacramentRequest.deceasedName')} value={fields.deceasedName ?? ''} onChange={set('deceasedName')} />
          <Field label={t('sacramentRequest.funeralDate')} value={fields.date ?? ''} onChange={set('date')} placeholder="YYYY-MM-DD" />
          <Field label={t('sacramentRequest.contact')} value={fields.contact ?? ''} onChange={set('contact')} />
        </>}

        {(sacType === 'confirmation' || sacType === 'other') && <>
          <Field label={t('sacramentRequest.date')} value={fields.date ?? ''} onChange={set('date')} placeholder="YYYY-MM-DD" />
          <Field label={t('sacramentRequest.contact')} value={fields.contact ?? ''} onChange={set('contact')} />
        </>}

        <Field label={t('sacramentRequest.notesOptional')} value={fields.notes ?? ''} onChange={set('notes')} multiline />
        <AppButton label={t('sacramentRequest.submit')} onPress={handleSubmit} loading={saving} />
      </View>
    </ScrollView>
  );

  if (isWeb) return <WebLayout>{content}</WebLayout>;
  return <SafeAreaView style={styles.screen} edges={['top']}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingBottom: Spacing.xxl },
  successScreen: { alignItems: 'center', justifyContent: 'center', gap: Spacing.lg, padding: Spacing.xl },
  topBar: { padding: Spacing.md, gap: Spacing.sm },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  card: {
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    margin: Spacing.md,
    marginBottom: 0,
    gap: Spacing.sm,
  },
  typeRow: { gap: Spacing.sm, paddingVertical: Spacing.xs },
  typeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.cream2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeChipActive: { backgroundColor: Colors.crimson, borderColor: Colors.crimson },
  fieldWrap: { gap: 4 },
  fieldLabel: { marginBottom: 2 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.textInverse,
  },
  inputMulti: { height: 80, textAlignVertical: 'top' },
});
