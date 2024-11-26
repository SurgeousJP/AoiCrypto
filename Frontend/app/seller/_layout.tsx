import { colors, Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tabs } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import React from "react";

import Calendar from "@/assets/icons/system-icons-svg/Calendar.svg";
import Pipe from "@/assets/icons/system-icons-svg/Pipe.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        unmountOnBlur: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          height: 78,
          paddingTop: 8,
          paddingBottom: 8,
          elevation: 15,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: "ReadexPro_400Regular",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <Pipe stroke={focused ? colors.primary : colors.secondary} />
          ),
        }}
      />
      <Tabs.Screen
        name="project"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, focused }) => (
            <Calendar stroke={focused ? colors.primary : colors.secondary} />
          ), 
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Setting stroke={focused ? colors.primary : colors.secondary} />
          ),
        }}
      />
    </Tabs>
  );
}
