import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useAppKit } from "@reown/appkit-wagmi-react-native";
import LoginIllustration from "@/assets/images/LoginIllustration.svg";

const Login = () => {
  const { open } = useAppKit();
  const handleLogin = (e) => {
    open();
  }

  return (
    <ScrollView className="w-full pt-8 px-4 bg-background">
      <View className="flex flex-col mt-4">
        <Text className="font-readexBold text-[32px] mb-0 mx-auto">
          Login with wallet
        </Text>
        <Text className="font-readexRegular text-sm text-black mx-auto">
          Connect to our app with your wallet
        </Text>

        <View className="mx-auto">
        <LoginIllustration width={322} height={284} />
        </View>

        <Pressable
          className={`w-full flex flex-row items-center justify-center space-x-2 h-12 rounded-xl bg-primary `}
          onPress={handleLogin}
        >
          <View className="flex flex-row space-x-2 items-center">
            <Text
              className={`text-surface font-readexBold text-center text-md my-auto`}
            >
              Login
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Login;
