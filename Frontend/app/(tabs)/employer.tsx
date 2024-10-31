import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  GestureResponderEvent,
} from "react-native";
import { Pressable } from "react-native";

import { LoginModal } from "@/components/LoginModal";
import React, { useState } from "react";
import { useRouter } from 'expo-router'; 
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "@/constants/GlobalStyle";

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();

  const [isPayrollBtnVisible, setPayrollBtnVisible] = useState<boolean>(false);

  const onLoginClose = () => {
    setPayrollBtnVisible(true);
    console.log("onLoginClose");
    console.log(isPayrollBtnVisible);
  };

  const handleBack = (event: GestureResponderEvent) => {
    setPayrollBtnVisible(false);
  }

  const router = useRouter();

  const handleNavigate = () => {
    //_sitemap allow to see every route possible
    // router.navigate('/_sitemap');
    router.navigate('/import');
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {!isPayrollBtnVisible && <LoginModal onClose={onLoginClose} />}

      {isPayrollBtnVisible && (
        <View className="mt-10 mx-6 p-6 rounded-xl flex flex-col flex-1 pb-12">
          <View className="my-auto">
            <View className="mx-12">
              <Pressable onPress={handleNavigate} style={{ opacity: 0.9 }}>
                <Text style={globalStyles.fontNormal} className="text-white font-bold mt-6 p-4 w-full h-fit bg-[#2894f4] self-center justify-center text-center align-middle rounded-lg">
                  UPLOAD PAYROLL
                </Text>
              </Pressable>
            </View>
            <View className="mx-12">
              <Pressable onPress={handleBack} style={{ opacity: 0.9 }}>
                <Text style={globalStyles.fontNormal} className="text-white font-bold mt-6 p-4 w-full h-fit bg-[#2894f4] self-center justify-center text-center align-middle rounded-lg">
                  BACK
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
