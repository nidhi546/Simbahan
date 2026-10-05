import "../global.css";
import { useEffect } from "react";
import { View, Platform, BackHandler, Alert } from "react-native";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_600SemiBold,
} from "@expo-google-fonts/playfair-display";
import {
  DMSans_400Regular,
  DMSans_500Medium,
} from "@expo-google-fonts/dm-sans";
import { useAuthStore } from "../store/authStore";
import { useBookmarkStore } from "../store/bookmarkStore";
import { useChurchStore } from "../store/churchStore";
import { useCountryStore } from "../store/countryStore";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";
import { I18nProvider, useI18n } from "../i18n";
import Toast from "../components/ui/Toast";
import Sidebar from "../components/ui/Sidebar";
import AppText from "../components/ui/AppText";
import { Spacing } from "../constants/Layout";

SplashScreen.preventAutoHideAsync();

const ROOT_ROUTES = ["/home", "/"];

function DemoBanner() {
  const { theme } = useTheme();
  const { t } = useI18n();
  if (Platform.OS !== "web") return null;
  return (
    <View
      style={{
        backgroundColor: theme.accent,
        paddingVertical: 6,
        paddingHorizontal: Spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppText variant="label" color={theme.primaryDark}>
        {t("appShell.demoBanner")}
      </AppText>
    </View>
  );
}

function AndroidBackHandler() {
  const pathname = usePathname();
  const { t } = useI18n();

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (ROOT_ROUTES.includes(pathname)) {
        Alert.alert(t("appShell.exitTitle"), t("appShell.exitMessage"), [
          { text: t("common.no"), style: "cancel" },
          {
            text: t("common.yes"),
            style: "destructive",
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [pathname, t]);

  return null;
}

function AppShell() {
  const hydrateAuth     = useAuthStore((s) => s.hydrate);
  const hydrateBookmarks = useBookmarkStore((s) => s.hydrate);
  const hydrateCountry  = useCountryStore((s) => s.hydrate);

  const isAuthenticated     = useAuthStore((s) => s.isAuthenticated);
  const isAuthHydrated      = useAuthStore((s) => s.isHydrated);
  const isCountryHydrated   = useCountryStore((s) => s.isHydrated);

  const { theme, mode } = useTheme();
  useChurchStore();

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  // Hydrate all stores in parallel once fonts are ready
  useEffect(() => {
    if (!fontsLoaded) return;
    Promise.all([hydrateAuth(), hydrateBookmarks(), hydrateCountry()]);
  }, [fontsLoaded]);

  // Hide splash only after fonts + auth + country are all resolved
  const allReady = fontsLoaded && isAuthHydrated && isCountryHydrated;

  useEffect(() => {
    if (allReady) SplashScreen.hideAsync();
  }, [allReady]);

  if (!allReady) return null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        style={mode === "dark" ? "light" : "light"}
        backgroundColor={theme.primaryDark}
      />
      <DemoBanner />
      <AndroidBackHandler />
      <Stack screenOptions={{ headerShown: false }}>
        {/* ── Onboarding / selection screens ── */}
        <Stack.Screen name="country-select"  options={{ animation: "fade" }} />
        <Stack.Screen name="language-select" options={{ animation: "slide_from_right" }} />

        {/* ── Existing screens (unchanged) ── */}
        <Stack.Screen name="(public)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="home" />
        <Stack.Screen name="announcements/index" />
        <Stack.Screen name="announcements/[id]" />
        <Stack.Screen name="events/index" />
        <Stack.Screen name="events/[id]" />
        <Stack.Screen name="readings/today" />
        <Stack.Screen name="mass-schedule/index" />
        <Stack.Screen name="donations/index" />
        <Stack.Screen name="donations/[id]" />
        <Stack.Screen name="donations/history" />
        <Stack.Screen name="community/index" />
        <Stack.Screen name="community/member/[id]" />
        <Stack.Screen name="family/index" />
        <Stack.Screen name="novenas/index" />
        <Stack.Screen name="novenas/[id]" />
        <Stack.Screen name="novenas/rosary" />
        <Stack.Screen name="sacraments/index" />
        <Stack.Screen name="sacraments/request" />
        <Stack.Screen name="holy-week/index" />
        <Stack.Screen name="simbang-gabi/index" />
        <Stack.Screen name="profile/index" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="notifications/index" />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="parish-info/index" />
      </Stack>
      <Toast />
      {Platform.OS !== "web" && isAuthenticated && <Sidebar />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      {/*
        I18nProvider reads language from countryStore (Zustand).
        It must be inside ThemeProvider so themed screens can also use t().
        It wraps AppShell so every screen — including country-select itself —
        has access to useI18n() if needed.
      */}
      <I18nProvider>
        <AppShell />
      </I18nProvider>
    </ThemeProvider>
  );
}
