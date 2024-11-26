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
import { View } from "react-native";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@walletconnect/react-native-compat";
import { WagmiProvider } from "wagmi";
import { sepolia } from "@wagmi/core/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  createAppKit,
  defaultWagmiConfig,
  AppKit,
} from "@reown/appkit-wagmi-react-native";

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

  const queryClient = new QueryClient();

  const projectId = process.env.EXPO_PUBLIC_AOICRYPTO_PROJECT_ID;

  const chains = [sepolia] as const;

  const metadata = {
    name: "AoiCrypto AppKit WalletConnect",
    description: "AoiCrypto AppKit WalletConnect",
    url: "https://reown.com/appkit",
    icons: [
      "https://i.pinimg.com/736x/cd/0e/0d/cd0e0dbb19f35e33bb6e68b4f47d0db8.jpg",
    ],
    redirect: {
      native: "myapp://",
      universal: "https://myapp.com",
    },
  };

  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

  createAppKit({
    projectId,
    wagmiConfig,
    defaultChain: sepolia, 
    enableAnalytics: true,
  });

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
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
                initialRouteName="login"
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
        <AppKit />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export const unstable_settings = {
  // Ensure any route can link back to `/`
  // initialRouteName: "(tabs)",
  initialRouteName: "login/index",
};
