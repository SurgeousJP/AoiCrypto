import Back from "@/assets/icons/system-icons-svg/Back.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import AoiCryptoLogo from "@/assets/logos/AoiCryptoLogo.svg";
import TitleHeader from "@/components/Layouts/TitleHeader";
import TabHeader from "@/components/Layouts/TabHeader";
import { colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  ReadexPro_200ExtraLight,
  ReadexPro_300Light,
  ReadexPro_400Regular,
  ReadexPro_500Medium,
  ReadexPro_600SemiBold,
  ReadexPro_700Bold,
} from "@expo-google-fonts/readex-pro";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenHeader from "@/components/Layouts/ScreenHeader";
import React from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const handleBack = (e) => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  const colorScheme = useColorScheme();
  let [loaded, error] = useFonts({
    ReadexPro_200ExtraLight,
    ReadexPro_300Light,
    ReadexPro_400Regular,
    ReadexPro_500Medium,
    ReadexPro_600SemiBold,
    ReadexPro_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom,
          backgroundColor: colors.surface,
        }}
      >
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerShown: true,
              animation: "fade",
              animationDuration: 1000,
            }}
            // initialRouteName="(tabs)"
            initialRouteName="seller"
          >
            <Stack.Screen
              name="login/index"
              options={{
                headerShown: true,
                headerShadowVisible: true,
                header: ({ options }) => <TabHeader />,
              }}
            />
            <Stack.Screen
              name="settings/index"
              options={{
                headerShown: true,
                headerShadowVisible: true,
                header: ({ options }) => <TitleHeader title="Settings" />,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                headerShadowVisible: false,
                header: ({ options }) => <TabHeader />,
              }}
            />
            <Stack.Screen
              name="project/[project]"
              options={{
                headerShown: true,
                headerShadowVisible: true,
                header: ({ options }) => (
                  <TitleHeader title={"Project Detail"} />
                ),
              }}
            />
            <Stack.Screen
              name="project/whitelistForm"
              options={{
                headerShown: true,
                headerShadowVisible: true,
                header: ({ options }) => (
                  <TitleHeader title={"Join the Allowlist"} />
                ),
              }}
            />
            <Stack.Screen
              name="mission/[mission]"
              options={{
                headerShown: true,
                headerShadowVisible: true,
                header: ({ options }) => (
                  <TitleHeader title={"Mission Detail"} />
                ),
              }}
            />

            <Stack.Screen
              name="notification/index"
              options={{
                headerShown: true,
                headerShadowVisible: true,
                header: ({ options }) => (
                  <TitleHeader title={"Notifications"} />
                ),
              }}
            />

            <Stack.Screen
              name="seller"
              options={{
                headerShown: false,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="project/createOverview"
              options={{
                headerShown: true,
                headerShadowVisible: false,
                header: ({ options }) => (
                  <TitleHeader title={"Add project"} />
                ),
              }}
            />
            <Stack.Screen
              name="project/createStepOne"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </ThemeProvider>
      </View>
    </SafeAreaProvider>
  );
}

export const unstable_settings = {
  // Ensure any route can link back to `/`
  // initialRouteName: "(tabs)",
  initialRouteName: "seller",
};
