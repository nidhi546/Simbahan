import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientView from './GradientView';
import { Colors } from '../../constants/Colors';
import { Spacing } from '../../constants/Layout';
import AppText from './AppText';
import { useUiStore } from '../../store/uiStore';
import { useI18n } from '../../i18n';

const isWeb = Platform.OS === 'web';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showMenu?: boolean;
}

const ScreenHeader = ({ title, subtitle, onBack, rightAction, showMenu = false }: ScreenHeaderProps) => {
  const insets = useSafeAreaInsets();
  const openSidebar = useUiStore((s) => s.openSidebar);
  const { t } = useI18n();
  const handleMenu = useCallback(() => openSidebar(), [openSidebar]);

  const leftSlot = onBack ? (
    <TouchableOpacity
      onPress={onBack}
      accessible
      accessibilityLabel={t('ui.goBack')}
      style={styles.iconBtn}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="chevron-back" size={24} color={Colors.textInverse} />
    </TouchableOpacity>
  ) : (showMenu && !isWeb) ? (
    <TouchableOpacity
      onPress={handleMenu}
      accessible
      accessibilityLabel={t('nav.openMenu')}
      style={styles.iconBtn}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="menu" size={24} color={Colors.textInverse} />
    </TouchableOpacity>
  ) : (
    <View style={styles.iconBtn} />
  );

  return (
    <GradientView
      colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
      style={StyleSheet.flatten([styles.container, { paddingTop: insets.top + Spacing.sm }])}
    >
      <View style={styles.crossWrap} pointerEvents="none">
        <View style={styles.crossV} />
        <View style={styles.crossH} />
      </View>
      <View style={styles.row}>
        {leftSlot}
        <View style={styles.center}>
          <AppText variant="headingMd" color={Colors.textInverse} numberOfLines={1}>
            {title}
          </AppText>
          {subtitle && (
            <AppText variant="caption" color={Colors.goldLight} numberOfLines={1}>
              {subtitle}
            </AppText>
          )}
        </View>
        <View style={styles.iconBtn}>{rightAction ?? null}</View>
      </View>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    alignItems: 'center',
  },
  crossWrap: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.06,
  },
  crossV: {
    position: 'absolute',
    width: 16,
    height: 120,
    backgroundColor: Colors.textInverse,
    borderRadius: 4,
  },
  crossH: {
    position: 'absolute',
    width: 120,
    height: 16,
    backgroundColor: Colors.textInverse,
    borderRadius: 4,
    top: 30,
  },
});

export default React.memo(ScreenHeader);
