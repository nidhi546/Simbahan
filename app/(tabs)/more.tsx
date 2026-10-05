import React, { useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ListRenderItemInfo,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import GradientView from "../../components/ui/GradientView";
import AppText from "../../components/ui/AppText";
import Avatar from "../../components/ui/Avatar";
import WebLayout from "../../components/ui/WebLayout";
import { Colors } from "../../constants/Colors";
import { Spacing, Radius } from "../../constants/Layout";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import { useI18n } from "../../i18n";

const isWeb = Platform.OS === "web";

type MenuItem = {
  id: string;
  labelKey: string;
  sublabelKey: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  dot: string;
  route: string;
};

const MENU: MenuItem[] = [
  {
    id: "1",
    labelKey: "more.items.massSchedule.label",
    sublabelKey: "more.items.massSchedule.sublabel",
    icon: "time-outline",
    dot: Colors.navy,
    route: "/mass-schedule",
  },
  {
    id: "2",
    labelKey: "more.items.donations.label",
    sublabelKey: "more.items.donations.sublabel",
    icon: "gift-outline",
    dot: Colors.gold,
    route: "/donations",
  },
  {
    id: "3",
    labelKey: "more.items.community.label",
    sublabelKey: "more.items.community.sublabel",
    icon: "people-outline",
    dot: Colors.sage,
    route: "/community",
  },
  {
    id: "4",
    labelKey: "more.items.family.label",
    sublabelKey: "more.items.family.sublabel",
    icon: "heart-outline",
    dot: Colors.crimson,
    route: "/family",
  },
  {
    id: "5",
    labelKey: "more.items.sacraments.label",
    sublabelKey: "more.items.sacraments.sublabel",
    icon: "water-outline",
    dot: Colors.sage,
    route: "/sacraments",
  },
  {
    id: "6",
    labelKey: "more.items.novenas.label",
    sublabelKey: "more.items.novenas.sublabel",
    icon: "book-outline",
    dot: Colors.gold,
    route: "/novenas",
  },
  {
    id: "7",
    labelKey: "more.items.holyWeek.label",
    sublabelKey: "more.items.holyWeek.sublabel",
    icon: "sunny-outline",
    dot: Colors.crimson,
    route: "/holy-week",
  },
  {
    id: "8",
    labelKey: "more.items.simbangGabi.label",
    sublabelKey: "more.items.simbangGabi.sublabel",
    icon: "moon-outline",
    dot: Colors.navy,
    route: "/simbang-gabi",
  },
  {
    id: "9",
    labelKey: "more.items.profile.label",
    sublabelKey: "more.items.profile.sublabel",
    icon: "person-outline",
    dot: Colors.navy,
    route: "/profile",
  },
  {
    id: "10",
    labelKey: "more.items.notifications.label",
    sublabelKey: "more.items.notifications.sublabel",
    icon: "notifications-outline",
    dot: Colors.gold,
    route: "/notifications",
  },
  {
    id: "11",
    labelKey: "more.items.settings.label",
    sublabelKey: "more.items.settings.sublabel",
    icon: "settings-outline",
    dot: Colors.textMuted,
    route: "/settings",
  },
  {
    id: "12",
    labelKey: "more.items.parishInfo.label",
    sublabelKey: "more.items.parishInfo.sublabel",
    icon: "business-outline",
    dot: Colors.navy,
    route: "/parish-info",
  },
];

const keyExtractor = (item: MenuItem) => item.id;

const MenuCard = React.memo(
  ({ item, onPress }: { item: MenuItem; onPress: (r: string) => void }) => {
    const { t } = useI18n();
    return (
    <TouchableOpacity
      onPress={() => onPress(item.route)}
      style={styles.card}
      activeOpacity={0.75}
      accessible
      accessibilityLabel={t(item.labelKey)}
      accessibilityRole="button"
    >
      <View style={styles.cardIconRow}>
        <View style={[styles.iconWrap, { backgroundColor: item.dot + "18" }]}>
          <Ionicons
            name={item.icon}
            size={24}
            color={item.dot === Colors.textMuted ? Colors.textMuted : item.dot}
          />
        </View>
        <View style={[styles.dot, { backgroundColor: item.dot }]} />
      </View>
      <AppText variant="headingSm" color={Colors.textPrimary} numberOfLines={1}>
        {t(item.labelKey)}
      </AppText>
      <AppText variant="caption" color={Colors.textMuted} numberOfLines={1}>
        {t(item.sublabelKey)}
      </AppText>
    </TouchableOpacity>
    );
  },
);

export default function MoreScreen() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const openSidebar = useUiStore((s) => s.openSidebar);
  const { t } = useI18n();

  const handleNav = useCallback(
    (route: string) => router.push(route as never),
    [],
  );

  const fullName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : t("more.guestName");

  const ListHeader = (
    <>
      <GradientView
        colors={[Colors.navyDark, Colors.navy]}
        style={styles.header}
      >
        <View style={styles.headerInner}>
          <View style={styles.headerTop}>
            {!isWeb && (
              <TouchableOpacity
                onPress={openSidebar}
                style={styles.menuBtn}
                activeOpacity={0.7}
                accessible
                accessibilityLabel={t("nav.openMenu")}
              >
                <Ionicons name="menu" size={24} color={Colors.textInverse} />
              </TouchableOpacity>
            )}
          </View>
          <AppText variant="bodySm" color={Colors.goldLight}>
            {t("more.tagline")}
          </AppText>
          <AppText variant="displaySm" color={Colors.textInverse}>
            {t("more.title")}
          </AppText>
        </View>
      </GradientView>

      {/* Profile shortcut */}
      <TouchableOpacity
        onPress={() => handleNav("/profile")}
        style={styles.profileCard}
        activeOpacity={0.85}
        accessible
        accessibilityLabel={t("more.viewProfileA11y")}
      >
        <Avatar uri={currentUser?.avatar} name={fullName} size="md" />
        <View style={styles.profileInfo}>
          <AppText variant="headingSm" color={Colors.navy} numberOfLines={1}>
            {fullName}
          </AppText>
          <AppText variant="caption" color={Colors.textMuted} numberOfLines={1}>
            {currentUser?.role ?? t("more.defaultRole")} · {t("more.tapToViewProfile")}
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      </TouchableOpacity>

      <AppText
        variant="label"
        color={Colors.textMuted}
        style={styles.gridLabel}
      >
        {t("more.featuresLabel")}
      </AppText>
    </>
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MenuItem>) => (
      <MenuCard item={item} onPress={handleNav} />
    ),
    [handleNav],
  );

  const list = (
    <FlatList
      data={MENU}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={5}
    />
  );

  if (isWeb)
    return (
      <WebLayout>
        <View style={styles.screen}>{list}</View>
      </WebLayout>
    );
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {list}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cream },

  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    paddingHorizontal: 0,
    gap: 4,
  },
  headerInner: {
    paddingHorizontal: Spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: Spacing.xs,
  },
  menuBtn: { padding: Spacing.xs },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: 0,
  },
  profileInfo: { flex: 1 },

  gridLabel: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    letterSpacing: 0.6,
  },

  listContent: { paddingBottom: Spacing.xxl },
  columnWrapper: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },

  card: {
    flex: 1,
    backgroundColor: Colors.textInverse,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  cardIconRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});
