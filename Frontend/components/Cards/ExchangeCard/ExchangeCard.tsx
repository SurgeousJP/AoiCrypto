import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface ExchangeCardProps {
  fromCurrencyIcon: string;
  fromCurrencyName: string;
  toCurrencyIcon: string;
  toCurrencyName: string;
}

function ExchangeCard({
  fromCurrencyIcon,
  fromCurrencyName,
  toCurrencyIcon,
  toCurrencyName,
}: ExchangeCardProps) {
  return (
    <View className="flex flex-row rounded-lg items-center shadow-sm w-[343px] h-[68px]  p-4 bg-white justify-between">
      <View className="flex flex-row items-center">
        <Ionicons name="swap-vertical" size={24} />
        <View className=" ml-2">
          <Text className="text-sm font-readexRegular text-gray-500">From</Text>
          <Text className="text-md font-readexRegular text-black">
            {fromCurrencyName}
          </Text>
        </View>
      </View>
      <Pressable className="flex flex-row p-2 border border-gray-300  rounded-lg items-center">
        <Ionicons name="swap-horizontal" size={20} color={"gray"} />
      </Pressable>
      <View className="flex flex-row items-center">
        <View className="flex flex-col mr-2 items-end">
          <Text className="text-sm font-readexRegular text-gray-500">To</Text>
          <Text className="text-md font-readexRegular text-black">
            {toCurrencyName}
          </Text>
        </View>
        <Ionicons name="swap-vertical" size={24} />
      </View>
    </View>
  );
}

export default ExchangeCard;
