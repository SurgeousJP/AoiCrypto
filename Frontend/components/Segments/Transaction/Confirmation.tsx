import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import QuantityCard from "@/components/Cards/QuantityCard/QuantityCard";
import SettingCard from "@/components/Cards/SettingCard/SettingCard";
import React from "react";
import { Text, View } from "react-native";

function Confirmation() {
  return (
    <View className="flex-1 flex flex-col justify-between">
      <View>
        <View className="flex flex-col items-center">
          <Text className="text-slate-900 text-base font-medium font-readexRegular leading-none mt-6">
            You Pay
          </Text>
          <Text className="text-blue-600 text-3xl font-bold font-readexRegular leading-9">
            $1.000
          </Text>
        </View>
        <Text className="text-slate-900 text-base font-medium font-readexRegular leading-none mt-6">
          You Receive
        </Text>
        <QuantityCard quantity={0.040141} currency="BTC" />
        <Text className="text-slate-900 text-base font-medium font-readexRegular leading-none mt-6">
          Order
        </Text>
        <SettingCard
          title="From"
          action={
            <View className="flex flex-row items-center justify-center">
              <Text className="text-slate-900 text-base font-medium font-readexRegular leading-none mr-2">
                Bitcoin 0.040141 BTC
              </Text>
            </View>
          }
          pos={"top"}
        />
        <SettingCard
          title="To"
          action={
            <View className="flex flex-row items-center justify-center">
              <Text className="text-slate-900 text-base font-medium font-readexRegular leading-none mr-2">
                Ethereum 0.689612 ETH
              </Text>
            </View>
          }
          pos={"mid"}
        />
        <SettingCard
          title="Transaction Free (0.0%)"
          action={
            <View className="flex flex-row items-center justify-center">
              <Text className="text-slate-900 text-base font-medium font-readexRegular leading-none mr-2">
                $0.0
              </Text>
            </View>
          }
          pos={"mid"}
        />
        <SettingCard
          title="Total"
          action={
            <View className="flex flex-row items-center justify-center">
              <Text className="text-slate-900 text-base font-medium font-readexRegular leading-none mr-2">
                0.040141 BTC $1001
              </Text>
            </View>
          }
          pos={"bot"}
        />
      </View>
      <View className="w-screen h-24 border-t p-4 border-gray-300 bg-white absolute bottom-0 -left-4">
        <PrimaryButton
          onPress={() => console.log("Button pressed")}
          content="Confirm"
        />
      </View>
    </View>
  );
}

export default Confirmation;
