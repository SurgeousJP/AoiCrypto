import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface QuantityCardProps {
  quantity: number;
  currency: string;
}

function QuantityCard({ quantity, currency }: QuantityCardProps) {
  return (
    <TouchableOpacity
      className={`flex flex-row rounded-lg items-center shadow-sm w-[343px] h-[68px]  p-4 bg-white`}
    >
      <View className="flex flex-row items-center justify-between w-full">
        <View>
          <Text className="text-sm font-readexRegular text-gray-500">
            Quantity
          </Text>
          <Text className="text-md font-readexRegular text-black">
            {quantity}
          </Text>
        </View>
        <Text className="text-md font-readexRegular text-black ml-2">
          {currency}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default QuantityCard;
