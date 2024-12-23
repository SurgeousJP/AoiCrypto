import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AOISPowerCardProps {
  quantity?: string;
  percentage: string;
  tier: string;
}

function AOISPowerCard({ quantity, percentage, tier }: AOISPowerCardProps) {
  return (
    <TouchableOpacity
      className={`flex flex-row rounded-lg items-center shadow-md w-full h-[68px]  p-4 bg-surface border-border border-[1px]`} style={{elevation: 2}}
    >
      <View className="flex flex-row items-center justify-between w-full">
        <View>
          <Text className="text-md font-readexRegular text-black">{tier}</Text>
          {quantity && (
            <Text className="text-sm font-readexRegular text-gray-500">
              {quantity}
            </Text>
          )}
        </View>
        <Text className="text-md font-readexRegular text-black ml-2">
          {percentage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default AOISPowerCard;
