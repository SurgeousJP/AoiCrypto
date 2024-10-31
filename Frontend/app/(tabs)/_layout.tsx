import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeWindStyleSheet } from "nativewind";
import { globalStyles } from "@/constants/GlobalStyle";

NativeWindStyleSheet.setOutput({
  default: "native",
});
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontFamily: "Figtree_400Regular",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Employee",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={"person"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="employer"
        options={{
          title: "Employer",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={"group"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="verifier"
        options={{
          title: "Verifier",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "verified" : "verified"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: "Test",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "verified" : "verified"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
