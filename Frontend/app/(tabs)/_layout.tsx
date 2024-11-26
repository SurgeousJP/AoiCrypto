import { colors, Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, Tabs } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import React, { useContext, useEffect, useState } from "react";

import Calendar from "@/assets/icons/system-icons-svg/Calendar.svg";
import Dollar from "@/assets/icons/system-icons-svg/Dollar.svg";
import Home from "@/assets/icons/system-icons-svg/Home.svg";
import Layers from "@/assets/icons/system-icons-svg/Layers.svg";
import Pipe from "@/assets/icons/system-icons-svg/Pipe.svg";
import { AuthContext } from "@/contexts/AuthProvider";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [isRendering, setRendering] = useState(true);
  useEffect(() => {
    setRendering(false);
  }, []);

  const userContext = useContext(AuthContext);
  useEffect(() => {
    if (!isRendering && !userContext.isLoading && userContext.status !== 'connected'){
      router.push('/login');
    }
  }, [userContext, isRendering]);

  return (
    <Tabs
      screenOptions={{
        unmountOnBlur: false,
        tabBarHideOnKeyboard: true, // Hides the tab bar when the keyboard appears
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
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home stroke={focused ? colors.primary : colors.secondary} />
          ),
        }}
      />
      <Tabs.Screen
        name="project"
        options={{
          headerShown: false,
          title: "Projects",
          tabBarIcon: ({ color, focused }) => (
            <Calendar stroke={focused ? colors.primary : colors.secondary} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: "Portfolio",
          tabBarIcon: ({ color, focused }) => (
            <Pipe stroke={focused ? colors.primary : colors.secondary} />
          ),
        }}
      />
      <Tabs.Screen
        name="staking"
        options={{
          title: "Staking",
          tabBarIcon: ({ color, focused }) => (
            <Layers stroke={focused ? colors.primary : colors.secondary} />
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: "Missions",
          tabBarIcon: ({ color, focused }) => (
            <Dollar stroke={focused ? colors.primary : colors.secondary} />
          ),
        }}
      />
    </Tabs>
  );
}
