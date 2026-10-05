import React, { useEffect, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius } from '../../constants/Layout';
import AppText from './AppText';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { useCountryStore, COUNTRIES } from '../../store/countryStore';
import churchData from '../../data/church.json';
import { useI18n } from '../../i18n';

const SIDEBAR_W = 280;

type NavItem = {
  labelKey: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  activeIcon: React.ComponentProps<typeof Ionicons>['name'];
  route: string;
};

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.menuHome',    icon: 'home-outline',   activeIcon: 'home',   route: '/home'           },
  { labelKey: 'nav.menuMore',    icon: 'grid-outline',   activeIcon: 'grid',   route: '/(tabs)/more'    },
  { labelKey: 'nav.menuProfile', icon: 'person-outline', activeIcon: 'person', route: '/profile'        },
];

const NavRow = React.memo(({ item, isActive, onPress }: {
  item: NavItem; isActive: boolean; onPress: (route: string) => void;
}) => {
  const { t } = useI18n();
  return (
  <TouchableOpacity
    onPress={() => onPress(item.route)}
    activeOpacity={0.75}
    accessible
    accessibilityLabel={t(item.labelKey)}
    style={[styles.navItem, isActive && styles.navItemActive]}
  >
    {isActive && <View style={styles.activeBar} />}
    <View style={[styles.navIconWrap, isActive && styles.navIconWrapActive]}>
      <Ionicons
        name={isActive ? item.activeIcon : item.icon}
        size={20}
        color={isActive ? Colors.gold : Colors.textSecondary}
      />
    </View>
    <AppText
      variant="bodyMd"
      color={isActive ? Colors.navy : Colors.textSecondary}
      style={isActive ? styles.navLabelActive : undefined}
    >
      {t(item.labelKey)}
    </AppText>
  </TouchableOpacity>
  );
});

export default function Sidebar() {
  const insets = useSafeAreaInsets();
  const isOpen = useUiStore((s) => s.sidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();
  const { t, language, setLanguage } = useI18n();
  const country = useCountryStore((s) => s.country);
  const languageOptions = COUNTRIES[country ?? 'PH'].availableLanguages;

  const translateX = useSharedValue(-SIDEBAR_W);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : -SIDEBAR_W, { duration: 280 });
    overlayOpacity.value = withTiming(isOpen ? 1 : 0, { duration: 280 });
  }, [isOpen]);

  const drawerStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: isOpen ? 'auto' : 'none',
  }));

  const navigate = useCallback((route: string) => {
    closeSidebar();
    setTimeout(() => router.push(route as never), 50);
  }, [closeSidebar]);

  const handleLogout = useCallback(async () => {
    closeSidebar();
    await logout();
    router.replace('/(auth)/login');
  }, [closeSidebar, logout]);

  if (Platform.OS === 'web') return null;

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents={isOpen ? 'auto' : 'none'}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar} />
      </Animated.View>

      <Animated.View style={[styles.drawer, drawerStyle, { paddingTop: insets.top }]}>
        <View style={styles.drawerHeader}>
          <View style={styles.crossBadge}>
            <AppText variant="headingMd" color={Colors.textInverse}>✝</AppText>
          </View>
          <View style={styles.headerText}>
            <AppText variant="headingSm" color={Colors.navy}>{churchData.name}</AppText>
            <AppText variant="caption" color={Colors.textMuted} numberOfLines={1}>
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : t('nav.tagline')}
            </AppText>
          </View>
          <TouchableOpacity onPress={closeSidebar} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <ScrollView style={styles.navList} showsVerticalScrollIndicator={false}>
          {NAV_ITEMS.map((item) => {
            const cleanRoute = item.route.replace('/(tabs)', '');
            const isActive =
              pathname === item.route ||
              pathname === cleanRoute ||
              (item.route !== '/home' && cleanRoute !== '/' && pathname.startsWith(cleanRoute));
            return <NavRow key={item.route} item={item} isActive={isActive} onPress={navigate} />;
          })}
        </ScrollView>

        <View style={[styles.drawerFooter, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={styles.divider} />
          <View style={styles.languageSection}>
            <View style={styles.languageHeader}>
              <Ionicons name="language-outline" size={18} color={Colors.textMuted} />
              <AppText variant="caption" color={Colors.textMuted}>{t('nav.language')}</AppText>
            </View>
            {languageOptions.map((opt) => {
              const selected = opt.code === language;
              return (
                <TouchableOpacity
                  key={opt.code}
                  onPress={() => !selected && setLanguage(opt.code)}
                  activeOpacity={0.75}
                  accessible
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={t('nav.languageA11y', { language: opt.nativeName })}
                  style={[styles.languageOption, selected && styles.languageOptionActive]}
                >
                  <AppText
                    variant="bodyMd"
                    color={selected ? Colors.navy : Colors.textSecondary}
                    style={selected ? styles.navLabelActive : undefined}
                  >
                    {opt.nativeName}
                  </AppText>
                  {selected && <Ionicons name="checkmark-circle" size={20} color={Colors.gold} />}
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.divider} />
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.75} accessible accessibilityLabel={t('nav.logoutA11y')} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color={Colors.crimson} />
            <AppText variant="bodyMd" color={Colors.crimson}>{t('nav.logout')}</AppText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 100 },
  drawer: { position: 'absolute', top: 0, left: 0, bottom: 0, width: SIDEBAR_W, backgroundColor: Colors.cream, zIndex: 101 },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.sm },
  crossBadge: { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.navy, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  closeBtn: { padding: Spacing.xs },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  navList: { flex: 1, paddingTop: Spacing.sm },
  navItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.sm, borderRadius: Radius.sm,
    marginBottom: 2, gap: Spacing.sm, position: 'relative',
  },
  navItemActive: { backgroundColor: Colors.goldPale },
  activeBar: { position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, backgroundColor: Colors.gold, borderRadius: 2 },
  navIconWrap: { width: 34, height: 34, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cream2 },
  navIconWrapActive: { backgroundColor: Colors.goldPale },
  navLabelActive: { fontFamily: 'DMSans_500Medium' },
  drawerFooter: { paddingTop: Spacing.sm },
  languageSection: { paddingVertical: Spacing.sm },
  languageHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xs },
  languageOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.sm, borderRadius: Radius.sm,
  },
  languageOptionActive: { backgroundColor: Colors.goldPale },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
});
