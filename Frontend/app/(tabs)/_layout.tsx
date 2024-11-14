import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { colors, Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});
export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  const homeIcon = require("@/assets/icons/system-icons/Home_light.png");
  const projectIcon = require("@/assets/icons/system-icons/Calendar_light.png");
  const portfolioIcon = require("@/assets/icons/system-icons/Pipe_light.png");
  const stakingIcon = require("@/assets/icons/system-icons/Layers_light.png");
  const missionIcon = require("@/assets/icons/system-icons/Dollarv3.png");
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          height: 78,
          paddingTop: 8,
          paddingBottom: 8
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
            // <MaterialIcons name={"person"} color={focused ? colors.primary : colors.secondary} size={24} />
            <Image
              source={homeIcon}
              style={{ tintColor: focused ? colors.primary : colors.secondary }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={projectIcon}
              style={{ tintColor: focused ? colors.primary : colors.secondary }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: "Portfolio",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={portfolioIcon}
              style={{ tintColor: focused ? colors.primary : colors.secondary }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="staking"
        options={{
          title: "Staking",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={stakingIcon}
              style={{ tintColor: focused ? colors.primary : colors.secondary }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: "Missions",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={missionIcon}
              style={{ tintColor: focused ? colors.primary : colors.secondary }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
