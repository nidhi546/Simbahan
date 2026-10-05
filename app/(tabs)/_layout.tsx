import React, { useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useAuthStore } from '../../store/authStore';
import { useI18n } from '../../i18n';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

type TabConfig = {
  name: string;
  titleKey: string;
  icon: IoniconsName;
  activeIcon: IoniconsName;
};

const TABS: TabConfig[] = [
  { name: 'index',         titleKey: 'tabs.home',        icon: 'home-outline',      activeIcon: 'home'      },
  { name: 'calendar',      titleKey: 'tabs.calendar',    icon: 'calendar-outline',  activeIcon: 'calendar'  },
  { name: 'announcements', titleKey: 'tabs.announcements', icon: 'newspaper-outline', activeIcon: 'newspaper' },
  { name: 'more',          titleKey: 'tabs.more',        icon: 'grid-outline',      activeIcon: 'grid'      },
  { name: 'parish',        titleKey: 'tabs.parish',      icon: 'business-outline',  activeIcon: 'business'  },
  { name: 'schedule',      titleKey: 'tabs.schedule',    icon: 'time-outline',      activeIcon: 'time'      },
];

function TabIcon({ name, focused }: { name: IoniconsName; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      {focused && <View style={styles.indicator} />}
      <Ionicons name={name} size={22} color={focused ? Colors.navy : Colors.textMuted} />
    </View>
  );
}

const isWeb = Platform.OS === 'web';

export default function TabsLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { t } = useI18n();

  const renderIcon = useCallback(
    (tab: TabConfig) =>
      ({ focused }: { focused: boolean }) =>
        <TabIcon name={focused ? tab.activeIcon : tab.icon} focused={focused} />,
    []
  );

  // Guard: unauthenticated mobile users redirect to login
  if (!isWeb && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.navy,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: { display: 'none' },
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: t(tab.titleKey),
            tabBarIcon: renderIcon(tab),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.textInverse,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 60,
    paddingBottom: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 10,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  indicator: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 3,
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
});
