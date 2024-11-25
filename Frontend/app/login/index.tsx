import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import Metamask from "@/assets/logos/Metamask.svg";
import WalletConnect from "@/assets/logos/WalletConnect.svg";
import Coinbase from "@/assets/logos/Coinbase.svg";
import Checkbox from "@/components/Inputs/Checkbox/Checkbox";
import { useAppKit } from "@reown/appkit-wagmi-react-native";
import { useSignMessage } from 'wagmi'


const Login = () => {
  const { open } = useAppKit();
  const handleLogin = (e) => {
    open();
  }

  const { data, isError, isPending, isSuccess, signMessage } = useSignMessage()

  useEffect(() => {
    signMessage({ message: 'hello world' });
  }, [])

  useEffect(() => {
    console.log("Data");
  }, [data, isError, isPending, isSuccess])

  return (
    <ScrollView className="w-full pt-8 px-4 bg-background">
      <View className="flex flex-col mt-4">
        <Text className="font-readexBold text-[32px] mb-0">
          Login with wallet
        </Text>
        <Text className="font-readexRegular text-sm text-secondary">
          AoiCrypto will create an account for you when you first login
        </Text>
        <View className="mt-8">
          <Pressable className="mb-4">
            <View
              className="flex flex-row bg-surface items-center space-x-4 px-4 py-4 border border-outline rounded-lg"
              style={{ elevation: 2 }}
            >
              <Metamask />
              <Text className="font-readexRegular">Login with Metamask</Text>
            </View>
          </Pressable>
          <Pressable className="mb-4" onPress={handleLogin}>
            <View
              className="flex flex-row bg-surface items-center space-x-4 px-4 py-4 border border-outline rounded-lg"
              style={{ elevation: 2 }}
            >
              <WalletConnect />
              <Text className="font-readexRegular">
                Login with WalletConnect
              </Text>
            </View>
          </Pressable>
          <Pressable className="mb-4">
            <View
              className="flex flex-row bg-surface items-center space-x-4 px-4 py-4 border border-outline rounded-lg"
              style={{ elevation: 2 }}
            >
              <Coinbase />
              <Text className="font-readexRegular">Login with Coinbase</Text>
            </View>
          </Pressable>
        </View>

        <View className="mb-4">
          <Checkbox
            keyValue={""}
            content={"You agree to our Terms & Conditions and Privacy Policy"}
          />
        </View>

        <Pressable
          className={`w-full flex flex-row items-center justify-center space-x-2 h-12 rounded-xl bg-primary `}
        >
          <View className="flex flex-row space-x-2 items-center">
            <Text
              className={`text-surface font-readexBold text-center text-md my-auto`}
            >
              Back
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Login;
