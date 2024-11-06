import { Text, View, SafeAreaView, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "@/constants/GlobalStyle";
import Checkbox from "@/components/Inputs/Checkbox/Checkbox";
import React from "react";

export default function TestComponent() {
  const insets = useSafeAreaInsets();

  const router = useRouter();
  
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="mt-10 mx-6 p-6 rounded-xl flex flex-col flex-1 pb-12">
        <Text className="text-sm mb-4" style={globalStyles.fontNormal}>
          Component demo screen
        </Text>
        <Checkbox keyValue={"test"} content={"Test"} />
        
        {/* <CustomButton backgroundColor={"primary"} textColor={"white"} content={"TEST BUTTON"} />
        
        <ProgressBar />

        <Divider content={"SurgeousJP"} />
        
        <View className="flex flex-col space-y-4">
          <Social imageUri={Images.apple} content={"Continue with Apple"} />
          <Social imageUri={Images.facebook} content={"Continue with Facebook"} />
          <Social imageUri={Images.google} content={"Continue with Google"} />
        </View>
        <CustomSwitch />

        <OTP />

        <Input label={"Email address"} />
        <Input label={"Password"} isPassword={true}/>

        <CustomButton content={"BUY"} backgroundColor={"bg-primaryBtn"} textColor={"text-white"} iconTintColor={"white"}/>
        <CustomButton content={"BUY"} backgroundColor={"bg-white"} textColor={"text-primaryBtn"} isReverse={true} iconTintColor={colors.primary}/>

        <CurrencyLabel backgroundColor={"bg-primary"} textColor={"text-white"} content={"ETH/USD"} />
        <CurrencyLabel backgroundColor={"bg-surface"} textColor={"text-secondary"} content={"ETH/USD"} />
         */}
        
      </View>
    </SafeAreaView>
  );
}
