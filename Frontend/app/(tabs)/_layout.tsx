import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { colors, Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NativeWindStyleSheet } from "nativewind";

import Home from "@/assets/icons/system-icons-svg/Home.svg";
import Calendar from "@/assets/icons/system-icons-svg/Calendar.svg";
import Pipe from "@/assets/icons/system-icons-svg/Pipe.svg";
import Layers from "@/assets/icons/system-icons-svg/Layers.svg";
import Dollar from "@/assets/icons/system-icons-svg/Dollar.svg";
import { Shadow } from "react-native-shadow-2";

NativeWindStyleSheet.setOutput({
  default: "native",
});
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Shadow startColor={"#2F66F61F"} distance={4} offset={[0, -1]} stretch={true} containerStyle={{position: "absolute", left: 0, right: 0, bottom: 0}}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          height: 78,
          paddingTop: 8,
          paddingBottom: 8,
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
            <Home stroke={focused ? colors.primary : colors.secondary}/>
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, focused }) => (
            <Calendar stroke={focused ? colors.primary : colors.secondary}/>
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: "Portfolio",
          tabBarIcon: ({ color, focused }) => (
            <Pipe stroke={focused ? colors.primary : colors.secondary}/>
          ),
        }}
      />
      <Tabs.Screen
        name="staking"
        options={{
          title: "Staking",
          tabBarIcon: ({ color, focused }) => (
            <Layers stroke={focused ? colors.primary : colors.secondary}/>
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: "Missions",
          tabBarIcon: ({ color, focused }) => (
            <Dollar stroke={focused ? colors.primary : colors.secondary}/>
          ),
        }}
      />
    </Tabs>
    </Shadow>
  );
}
