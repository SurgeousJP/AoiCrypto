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
import StateProvider from "@/contexts/StateProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import {
  commonToastStyle,
  defaultText1Style,
  defaultText2Style,
} from "@/utils/toast";
import { LogBox } from "react-native";
// Import

SplashScreen.preventAutoHideAsync();
LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
]);
const initialScreen = path.sellerTab;
global.Buffer = global.Buffer || Buffer;

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  const colorScheme = useColorScheme();

  const queryClient = new QueryClient();

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

  createAppKit({
    projectId: PROJECT_ID ?? "N/A",
    wagmiConfig,
    defaultChain: sepolia,
    enableAnalytics: true,
  });

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          ...commonToastStyle,
          borderLeftColor: colors.success,
        }}
        text1Style={defaultText1Style}
        text2Style={defaultText2Style}
        text2NumberOfLines={2}
      />
    ),
    info: (props: any) => (
      <BaseToast
        {...props}
        style={{
          ...commonToastStyle,
          borderLeftColor: colors.secondary,
        }}
        text1Style={defaultText1Style}
        text2Style={defaultText2Style}
        text2NumberOfLines={2}
      />
    ),
    error: (props: any) => (
      <BaseToast
        {...props}
        style={{
          ...commonToastStyle,
          borderLeftColor: colors.error,
        }}
        text1Style={defaultText1Style}
        text2Style={defaultText2Style}
        text2NumberOfLines={2}
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
        <StateProvider>
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
                      initialRouteName={initialScreen}
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
                        name={path.createProjectStepTwo}
                        options={{
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name={path.createProjectStepThree}
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
                        name={path.mintToken}
                        options={{
                          headerShown: true,
                          headerShadowVisible: false,
                          header: ({ options }) => (
                            <TitleHeader title={"Mint token"} />
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
        </StateProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: initialScreen,
};
