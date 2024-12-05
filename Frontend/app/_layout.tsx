// Import
import TabHeader from "@/components/Layouts/TabHeader";
import TitleHeader from "@/components/Layouts/TitleHeader";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "@wagmi/core/chains";
import "@walletconnect/react-native-compat";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { WagmiProvider } from "wagmi";

import AoiCryptoLogo from "@/assets/logos/AoiCryptoLogo.svg";
import { SUBGRAPH_ENDPOINT } from "@/configs/subgraph.config";
import { PROJECT_ID, wagmiConfig } from "@/configs/wagmi.config";
import AuthProvider from "@/contexts/AuthProvider";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { AppKit, createAppKit } from "@reown/appkit-wagmi-react-native";
import * as SplashScreen from "expo-splash-screen";
import Toast, { BaseToast } from "react-native-toast-message";
import { path } from "@/constants/path";
// Import

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    ReadexPro_300Light: require("@/assets/fonts/ReadexPro_300Light.ttf"),
    ReadexPro_400Regular: require("@/assets/fonts/ReadexPro_400Regular.ttf"),
    ReadexPro_600SemiBold: require("@/assets/fonts/ReadexPro_600SemiBold.ttf"),
    ReadexPro_700Bold: require("@/assets/fonts/ReadexPro_700Bold.ttf"),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  if (!loaded && !error) {
    return null;
  }

  const queryClient = new QueryClient();

  createAppKit({
    projectId: PROJECT_ID,
    wagmiConfig,
    defaultChain: sepolia,
    enableAnalytics: true,
  });

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          width: "92%",
          height: "auto",
          backgroundColor: colors.background,
          borderLeftColor: colors.success,
          paddingHorizontal: 0,
          marginHorizontal: 0,
        }}
        contentContainerStyle={{}}
        text1Style={{
          fontFamily: "ReadexPro_400Regular",
          fontSize: 16,
          fontWeight: "400",
        }}
        text2Style={{
          fontFamily: "ReadexPro_400Regular",
          fontSize: 14,
          fontWeight: "400",
        }}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        style={{
          width: "92%",
          backgroundColor: colors.background,
          borderLeftColor: colors.secondary,
          paddingHorizontal: 0,
          marginHorizontal: 0,
        }}
        contentContainerStyle={{}}
        text1Style={{
          fontFamily: "ReadexPro_400Regular",
          fontSize: 16,
          fontWeight: "400",
        }}
        text2Style={{
          fontFamily: "ReadexPro_400Regular",
          fontSize: 14,
          fontWeight: "400",
        }}
      />
    ),
    error: (props) => (
      <BaseToast
        {...props}
        style={{
          width: "92%",
          backgroundColor: colors.background,
          borderLeftColor: colors.error,
          paddingHorizontal: 0,
          marginHorizontal: 0,
        }}
        contentContainerStyle={{}}
        text1Style={{
          fontFamily: "ReadexPro_400Regular",
          fontSize: 16,
          fontWeight: "400",
        }}
        text2Style={{
          fontFamily: "ReadexPro_400Regular",
          fontSize: 14,
          fontWeight: "400",
        }}
      />
    ),
  };

  const subgraphClient = new ApolloClient({
    uri: SUBGRAPH_ENDPOINT, // GraphQL Subgraph endpoint
    cache: new InMemoryCache(),
  });

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={subgraphClient}>
          <AuthProvider>
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
                      headerShown: false,
                      animation: "fade",
                      animationDuration: 1000,
                    }}
                    initialRouteName={path.sellerTab}
                  >
                    <Stack.Screen
                      name={path.userSetting}
                      options={{
                        headerShown: true,
                        headerShadowVisible: true,
                        header: ({ options }) => {
                          return (
                            <TitleHeader
                              title={"Settings"}
                              isSettingHidden={true}
                            />
                          );
                        },
                      }}
                    />
                    <Stack.Screen
                      name={path.userTab}
                      options={{
                        headerShown: false,
                        headerShadowVisible: false,
                        header: ({ options }) => <TabHeader />,
                      }}
                    />
                    <Stack.Screen
                      name={path.userProjectDetail}
                      options={{
                        headerShown: true,
                        headerShadowVisible: true,
                        header: ({ options }) => (
                          <TitleHeader title={"Project Detail"} />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name={path.userWhitelistForm}
                      options={{
                        headerShown: true,
                        headerShadowVisible: true,
                        header: ({ options }) => (
                          <TitleHeader title={"Join the Allowlist"} />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name={path.transaction}
                      options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        header: ({ options }) => (
                          <TitleHeader title="Buy Crypto" />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name={path.userMission}
                      options={{
                        headerShown: true,
                        headerShadowVisible: true,
                        header: ({ options }) => (
                          <TitleHeader title={"Mission Detail"} />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name={path.userNotification}
                      options={{
                        headerShown: true,
                        headerShadowVisible: true,
                        header: ({ options }) => (
                          <TitleHeader title={"Notifications"} />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name={path.sellerTab}
                      options={{
                        headerShown: false,
                        headerShadowVisible: false,
                      }}
                    />
                    <Stack.Screen
                      name={path.createProjectOverview}
                      options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        header: ({ options }) => (
                          <TitleHeader title={"Add project"} />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name={path.createProjectStepOne}
                      options={{
                        headerShown: false,
                      }}
                    />
                    <Stack.Screen
                      name={path.token}
                      options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        header: ({ options }) => (
                          <TitleHeader title={"Create token"} />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name={path.login}
                      options={{
                        headerShown: true,
                        headerShadowVisible: true,
                        header: ({ options }) => (
                          <View
                            className="flex flex-row justify-center items-center bg-surface py-2 px-4 "
                            style={{ elevation: 2 }}
                          >
                            <AoiCryptoLogo />
                          </View>
                        ),
                      }}
                    />
                  </Stack>
                </ThemeProvider>
                <Toast config={toastConfig} />
              </View>
            </SafeAreaProvider>
            <AppKit />
          </AuthProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: path.sellerTab,
};
