import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ReadexPro_200ExtraLight,
  ReadexPro_300Light,
  ReadexPro_400Regular,
  ReadexPro_500Medium,
  ReadexPro_600SemiBold,
  ReadexPro_700Bold,
} from "@expo-google-fonts/readex-pro";
import TabHeader from "@/components/Layouts/TabHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { colors } from "@/constants/Colors";
import AoiCryptoLogo from "@/assets/logos/AoiCryptoLogo.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import Profile from "@/assets/icons/system-icons-svg/Profile.svg";
import Back from "@/assets/icons/system-icons-svg/Back.svg";

import ScreenHeader from "@/components/Layouts/ScreenHeader";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const insets = useSafeAreaInsets();

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
            screenOptions={{ headerShown: true, animation: 'fade', animationDuration: 1000 }}
            initialRouteName="(tabs)"
          >
            <Stack.Screen
              name="login/index"
              options={{
                headerShown: true,
                headerShadowVisible: false,
                header: ({ options }) => <TabHeader />,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: true,
                headerShadowVisible: false,
                header: ({ options }) => <TabHeader />,
              }}
            />
            <Stack.Screen
              name="project/[project]"
              options={{
                headerShown: true,
                headerShadowVisible: false,
                header: ({ options }) => (
                  <ScreenHeader
                    LeftComponent={<Back stroke={colors.secondary} />}
                    CenterComponent={<AoiCryptoLogo />}
                    RightComponent={<Setting fill={colors.secondary}/>}
                  ></ScreenHeader>
                ),
              }}
            />
            <Stack.Screen
              name="mission/[mission]"
              options={{
                headerShown: true,
                headerShadowVisible: false,
                header: ({ options }) => (
                  <ScreenHeader
                    LeftComponent={<Back stroke={colors.secondary} />}
                    CenterComponent={<AoiCryptoLogo />}
                    RightComponent={<Setting fill={colors.secondary}/>}
                  ></ScreenHeader>
                ),
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
  initialRouteName: "(tabs)",
};
