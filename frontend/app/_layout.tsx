import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useSelector } from "react-redux";
import "../global.css";
import { RootState, store } from "../store";
import { COLORS, CREATE_FAB, LIMITS, TAB_BAR } from "../utils/constants";

function TabsLayout() {
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const { user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!user;

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const displayCount = unreadCount > LIMITS.unreadBadge.max
    ? `${LIMITS.unreadBadge.max}+`
    : unreadCount.toString();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TAB_BAR.activeTintColor,
        tabBarInactiveTintColor: TAB_BAR.inactiveTintColor,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: TAB_BAR.borderTopColor,
          height: TAB_BAR.height,
          paddingBottom: TAB_BAR.paddingBottom,
          paddingTop: TAB_BAR.paddingTop,
          display: isAuthenticated ? 'flex' : 'none',
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          href: isAuthenticated ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          href: isAuthenticated ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="notifications" size={size} color={color} />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: -3,
                    backgroundColor: COLORS.danger.main,
                    borderRadius: 10,
                    minWidth: 18,
                    height: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    {displayCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create Poll",
          href: isAuthenticated ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                top: CREATE_FAB.topOffset,
                width: CREATE_FAB.width,
                height: CREATE_FAB.height,
                borderRadius: CREATE_FAB.borderRadius,
                backgroundColor: focused ? COLORS.primary.dark : COLORS.primary.light,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: COLORS.primary.main,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons name="add" size={CREATE_FAB.iconSize} color={COLORS.white} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          href: isAuthenticated ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          href: isAuthenticated ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="signin"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="poll/[id]"
        options={{
          href: isAuthenticated ? null : null,
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <TabsLayout />
      </Provider>
    </SafeAreaProvider>
  );
}