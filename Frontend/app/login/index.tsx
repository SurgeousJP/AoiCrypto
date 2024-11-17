import Social from "@/components/Buttons/Social/Social";
import { Images } from "@/constants/Images";
import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import Metamask from "@/assets/logos/Metamask.svg";
import WalletConnect from "@/assets/logos/WalletConnect.svg";
import Coinbase from "@/assets/logos/Coinbase.svg";
import { Shadow } from "react-native-shadow-2";
import Checkbox from "@/components/Inputs/Checkbox/Checkbox";
import CustomButton from "@/components/Buttons/CustomButton/CustomButton";

const Login = () => {
  return (
    <ScrollView className="w-full pt-8 px-4 bg-surface">
      <View className="flex flex-col mt-4">
        <Text className="font-readexBold text-[32px] mb-0">
          Login with wallet
        </Text>
        <Text className="font-readexRegular text-sm text-secondary">
          AoiCrypto will create an account for you when you first login
        </Text>
        <View className="mt-8">
          <Shadow
            stretch={true}
            offset={[0, 1]}
            startColor={"#2F66F61F"}
            distance={2}
            containerStyle={{ overflow: "visible", marginBottom: 16 }}
            style={{ borderRadius: 8 }}
          >
            <Pressable>
              <View className="flex flex-row bg-surface items-center space-x-4 px-4 py-4 border border-outline rounded-lg ">
                <Metamask />
                <Text className="font-readexRegular">Login with Metamask</Text>
              </View>
            </Pressable>
          </Shadow>

          <Shadow
            stretch={true}
            offset={[0, 1]}
            startColor={"#2F66F61F"}
            distance={2}
            containerStyle={{ overflow: "visible", marginBottom: 16 }}
            style={{ borderRadius: 8 }}
          >
            <Pressable>
              <View className="flex flex-row bg-surface items-center space-x-4 px-4 py-4 border border-outline rounded-lg ">
                <WalletConnect />
                <Text className="font-readexRegular">
                  Login with WalletConnect
                </Text>
              </View>
            </Pressable>
          </Shadow>
          <Shadow
            stretch={true}
            offset={[0, 1]}
            startColor={"#2F66F61F"}
            distance={2}
            containerStyle={{ overflow: "visible", marginBottom: 16 }}
            style={{ borderRadius: 8 }}
          >
            <Pressable>
              <View className="flex flex-row bg-surface items-center space-x-4 px-4 py-4 border border-outline rounded-lg ">
                <Coinbase />
                <Text className="font-readexRegular">Login with Coinbase</Text>
              </View>
            </Pressable>
          </Shadow>
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
