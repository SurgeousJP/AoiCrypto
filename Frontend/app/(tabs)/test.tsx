import { Text, View, SafeAreaView, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "@/constants/GlobalStyle";
import Checkbox from "@/components/Inputs/Checkbox/Checkbox";
import React, { useState } from "react";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";

export default function TestComponent() {
  const insets = useSafeAreaInsets();

  const router = useRouter();
  
  const [selectedValue, setSelectedValue] = useState("1");
  // SHADOW PROBLEM, DESIGN A CUSTOM SHADOW THAT APPLY SAME TO ALL
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="mt-10 mx-6 p-6 rounded-xl flex flex-col flex-1 pb-12">
        <Text className="text-sm mb-4" style={globalStyles.fontNormal}>
          Component demo screen
        </Text>
        {/* <Checkbox keyValue={"test"} content={"Test"} />
        <CustomDropdown />
        <Searchbar />
        <CustomSegmentedControl /> */}
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
