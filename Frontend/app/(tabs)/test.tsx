import { Text, View, SafeAreaView } from "react-native";

import React from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "@/constants/GlobalStyle";
import CustomButton from "@/components/CustomButton/CustomButton";
import Divider from "@/components/Divider/Divider";
import Social from "@/components/Social/Social";
import Input from "@/components/Input/Input";
import CustomSwitch from "@/components/Switch/CustomSwitch";
import OTP from "@/components/OTP/OTP";
import { colors } from "@/constants/Colors";
import ProgressBar from "@/components/ProgressBar/ProgressBar";

export default function TestComponent() {
  const insets = useSafeAreaInsets();

  const router = useRouter();
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="mt-10 mx-6 p-6 rounded-xl flex flex-col flex-1 pb-12">
        <Text className="text-sm mb-4" style={globalStyles.fontNormal}>
          Lowerbound (VND)
          Username
          Password
        </Text>
        {/* <ProgressBar />
        
        <CustomButton backgroundColor={"primary"} textColor={"white"} content={"TEST BUTTON"} />
        
        <Divider content={"SurgeousJP"} />
        
        <View className="flex flex-col space-y-4">
          <Social image={require("../../assets/logos/Apple.svg")} content={"Continue with Apple"} />
          <Social image={require("../../assets/logos/Facebook.svg")} content={"Continue with Facebook"} />
          <Social image={require("../../assets/logos/Google.svg")} content={"Continue with Google"} />
        </View>
        
        <CustomSwitch /> */}

        {/* <OTP /> */}

        {/* <Input label={"Email address"} />
        <Input label={"Password"} isPassword={true}/> */}

        {/* <CustomButton content={"BUY"} backgroundColor={"bg-primaryBtn"} textColor={"text-white"} iconTintColor={"white"}/>
        <CustomButton content={"BUY"} backgroundColor={"bg-white"} textColor={"text-primaryBtn"} isReverse={true} iconTintColor={colors.primary}/> */}
      </View>
    </SafeAreaView>
  );
}
