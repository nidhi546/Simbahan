import React, { useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePathname, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Spacing, Radius } from "../../constants/Layout";
import AppText from "./AppText";
import { useAuthStore } from "../../store/authStore";
import { useI18n } from "../../i18n";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const NAV_ITEMS: {
  href: string;
  labelKey: string;
  icon: IoniconsName;
  activeIcon: IoniconsName;
}[] = [
  { href: "/home",        labelKey: "nav.menuHome",    icon: "home-outline",   activeIcon: "home"   },
  { href: "/(tabs)/more", labelKey: "nav.menuMore",    icon: "grid-outline",   activeIcon: "grid"   },
  { href: "/profile",     labelKey: "nav.menuProfile", icon: "person-outline", activeIcon: "person" },
];

const SIDEBAR_W = 240;

type Props = { children: React.ReactNode };

function SidebarItem({
  href,
  label,
  icon,
  activeIcon,
  isActive,
}: {
  href: string;
  label: string;
  icon: IoniconsName;
  activeIcon: IoniconsName;
  isActive: boolean;
}) {
  const handlePress = useCallback(() => router.push(href as never), [href]);
  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible
      accessibilityLabel={label}
      activeOpacity={0.75}
      style={[styles.navItem, isActive && styles.navItemActive]}
    >
      {isActive && <View style={styles.activeBar} />}
      <Ionicons
        name={isActive ? activeIcon : icon}
        size={20}
        color={isActive ? Colors.gold : Colors.textInverse + "99"}
      />
      <AppText
        variant="bodyMd"
        color={isActive ? Colors.gold : Colors.textInverse + "CC"}
        style={styles.navLabel}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

export default function WebLayout({ children }: Props) {
  if (Platform.OS !== "web") return <>{children}</>;
  return <WebSidebar>{children}</WebSidebar>;
}

function WebSidebar({ children }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();
  const { t } = useI18n();

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace("/(public)");
  }, [logout]);

  if (!isAuthenticated) return <>{children}</>;

  const activeItem =
    NAV_ITEMS.find((n) => {
      const clean = n.href.replace("/(tabs)", "");
      return pathname === n.href || pathname === clean ||
        (clean !== "/" && clean !== "/home" && pathname.startsWith(clean));
    });
  const activeLabel = activeItem ? t(activeItem.labelKey) : "Simbahan";

  return (
    <View style={styles.root}>
      {/* Sidebar */}
      <SafeAreaView style={styles.sidebar} edges={["top", "bottom"]}>
        <View style={styles.sidebarLogo}>
          <AppText variant="headingMd" color={Colors.textInverse}>
            ✝ Simbahan
          </AppText>
          <AppText variant="caption" color={Colors.gold} style={styles.logoTagline}>
            {t("nav.tagline")}
          </AppText>
        </View>

        <ScrollView style={styles.navList} showsVerticalScrollIndicator={false}>
          {NAV_ITEMS.map((item) => {
            const clean = item.href.replace("/(tabs)", "");
            const isActive =
              pathname === item.href ||
              pathname === clean ||
              (item.href === "/home"
                ? pathname === "/home" || pathname === "/"
                : clean !== "/" && pathname.startsWith(clean));
            return (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={t(item.labelKey)}
                icon={item.icon}
                activeIcon={item.activeIcon}
                isActive={isActive}
              />
            );
          })}
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <View style={styles.userRow}>
            <View style={styles.userAvatar}>
              <AppText variant="label" color={Colors.textInverse}>
                {currentUser?.firstName?.[0] ?? "U"}
              </AppText>
            </View>
            <View style={styles.userInfo}>
              <AppText variant="label" color={Colors.textInverse} numberOfLines={1}>
                {currentUser?.firstName} {currentUser?.lastName}
              </AppText>
              <AppText variant="caption" color={Colors.textMuted} numberOfLines={1}>
                {currentUser?.role ?? t("nav.defaultRole")}
              </AppText>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            accessible
            accessibilityLabel={t("nav.logoutA11y")}
            activeOpacity={0.75}
            style={styles.logoutBtn}
          >
            <Ionicons name="log-out-outline" size={18} color={Colors.textMuted} />
            <AppText variant="bodySm" color={Colors.textMuted} style={styles.logoutText}>
              {t("nav.logout")}
            </AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Main content */}
      <View style={styles.main}>
        <View style={styles.topBar}>
          <AppText variant="bodyMd" color={Colors.textMuted}>{activeLabel}</AppText>
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.topBarIcon} accessible accessibilityLabel={t("nav.notificationsA11y")}>
              <Ionicons name="notifications-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.topBarAvatar}>
              <AppText variant="label" color={Colors.textInverse}>
                {currentUser?.firstName?.[0] ?? "U"}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row", backgroundColor: Colors.cream },
  sidebar: {
    width: SIDEBAR_W,
    backgroundColor: Colors.navyDark,
    flexDirection: "column",
  },
  sidebarLogo: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
    marginBottom: Spacing.sm,
  },
  logoTagline: { marginTop: 2 },
  navList: { flex: 1, paddingHorizontal: Spacing.sm },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    marginBottom: 2,
    position: "relative",
  },
  navItemActive: { backgroundColor: "rgba(201,146,42,0.12)" },
  navLabel: { marginLeft: Spacing.sm, flex: 1 },
  activeBar: {
    position: "absolute",
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    padding: Spacing.md,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.navyLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  userInfo: { flex: 1 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  logoutText: { marginLeft: Spacing.xs },
  main: { flex: 1, flexDirection: "column" },
  topBar: {
    height: 56,
    backgroundColor: Colors.textInverse,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
  },
  topBarRight: { flexDirection: "row", alignItems: "center" },
  topBarIcon: { padding: Spacing.xs, marginRight: Spacing.sm },
  topBarAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1 },
});
