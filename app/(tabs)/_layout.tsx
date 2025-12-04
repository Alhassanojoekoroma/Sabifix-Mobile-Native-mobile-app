import { Tabs } from "expo-router";
import { Home, FileText, Map as MapIcon, Settings, Camera } from "lucide-react-native";
import React from "react";
import { Platform, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Colors } from "@/constants/colors";

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  const items = [
    { route: 'index', label: 'Home', icon: Home },
    { route: 'my-reports', label: 'My Reports', icon: FileText },
    { route: 'report', label: 'Report', icon: Camera, isFloating: true },
    { route: 'map', label: 'Map', icon: MapIcon },
    { route: 'profile', label: 'Settings', icon: Settings },
  ];

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBarContainer}>
        {items.map((item) => {
          if (item.isFloating) {
            return <View key="spacer" style={styles.tabItem} />;
          }

          const isFocused = state.routes[state.index].name === item.route;

          return (
            <TouchableOpacity
              key={item.route}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: state.routes.find(r => r.name === item.route)?.key || '',
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(item.route);
                }
              }}
              style={styles.tabItem}
            >
              <item.icon
                color={isFocused ? "#EAB308" : "#9CA3AF"}
                size={24}
              />
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? "#EAB308" : "#9CA3AF" }
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Floating Button Absolute Positioned */}
        <View style={styles.floatingButtonContainer} pointerEvents="box-none">
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.floatingButton}
            onPress={() => navigation.navigate('report')}
          >
            <Camera color="#FFFFFF" size={28} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.white,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: Colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "SabiFix",
        }}
      />
      <Tabs.Screen
        name="my-reports"
        options={{
          headerShown: false,
          title: "My Reports",
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          headerShown: false,
          title: "Report Issue",
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map View",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Settings",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
    backgroundColor: 'transparent',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 32,
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: '100%',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  floatingButtonContainer: {
    position: 'absolute',
    top: -24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  floatingButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#111827',
    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
});
