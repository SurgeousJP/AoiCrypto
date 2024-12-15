import { colors, Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, Tabs } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import React, { useContext, useEffect, useState } from "react";

import Calendar from "@/assets/icons/system-icons-svg/Calendar.svg";
import Pipe from "@/assets/icons/system-icons-svg/Pipe.svg";
import Trade from "@/assets/icons/system-icons-svg/Trade.svg";
import { AuthContext } from "@/contexts/AuthProvider";
import Dollar from "@/assets/icons/system-icons-svg/Dollar.svg";

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
    if (
      !isRendering &&
      !userContext.isLoading &&
      userContext.status !== "connected"
    ) {
      router.push("/login");
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
          headerShown: false,
          title: "Projects",
          tabBarIcon: ({ color, focused }) => (
            <Calendar stroke={focused ? colors.primary : colors.secondary} />
          ),
        }}
      />
      <Tabs.Screen
        name="token"
        options={{
          title: "Token",
          tabBarIcon: ({ color, focused }) => (
            <Dollar fill={focused ? colors.primary : colors.secondary} />
          ),
        }}
      />

      <Tabs.Screen
        name="trade"
        options={{
          title: "Swap",
          tabBarIcon: ({ color, focused }) => (
            <Trade stroke={focused ? colors.primary : colors.secondary} />
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
    </Tabs>
  );
}
