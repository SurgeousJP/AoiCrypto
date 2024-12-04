import { colors, Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, Tabs } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import React, { useContext, useEffect, useState } from "react";

import Calendar from "@/assets/icons/system-icons-svg/Calendar.svg";
import Dollar from "@/assets/icons/system-icons-svg/Dollar.svg";
import Pipe from "@/assets/icons/system-icons-svg/Pipe.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import { AuthContext } from "@/contexts/AuthProvider";
import { ActivityIndicator, Text, View } from "react-native";

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

  if (isRendering) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

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
        name="token"
        options={{
          title: "Token",
          tabBarIcon: ({ color, focused }) => (
            <Dollar stroke={focused ? colors.primary : colors.secondary} />
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
