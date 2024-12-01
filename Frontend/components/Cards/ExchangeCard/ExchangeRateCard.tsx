import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
interface ExchangeCardProps {
  fromCurrencyQuantity: number;
  fromCurrencyName: string;
  toCurrencyQuantity: number;
  toCurrencyName: string;
}

function ExchangeRateCard({
  fromCurrencyQuantity,
  fromCurrencyName,
  toCurrencyQuantity,
  toCurrencyName,
}: ExchangeCardProps) {
  return (
    <View className="flex flex-row rounded-lg items-center shadow-sm w-full h-[68px]  p-4 bg-white justify-between">
      <View className="flex flex-row items-center">
        <View className=" ml-2">
          <Text className="text-sm font-readexRegular text-gray-500">
            {fromCurrencyName}
          </Text>
          <Text className="text-md font-readexRegular text-black">
            {fromCurrencyQuantity}
          </Text>
        </View>
      </View>
      <Pressable className="flex flex-row p-2 border border-gray-300  rounded-lg items-center">
        <Ionicons name="arrow-forward-outline" size={20} color={"gray"} />
      </Pressable>
      <View className="flex flex-row items-center">
        <View className="flex flex-col mr-2 items-end">
          <Text className="text-sm font-readexRegular text-gray-500">
            {toCurrencyName}
          </Text>
          <Text className="text-md font-readexRegular text-black">
            {toCurrencyQuantity}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default ExchangeRateCard;
