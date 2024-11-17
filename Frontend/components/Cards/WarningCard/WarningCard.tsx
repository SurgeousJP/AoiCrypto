import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

function WarningCard() {
  return (
    <View className="p-3.5 bg-white rounded-xl shadow justify-center flex flex-row space-x-1 items-center">
      <Ionicons name="warning-outline" size={24} color={"#d5e0fd"} />
      <Text className="self-stretch text-slate-900 text-sm font-light font-['Readex Pro'] leading-none">
        Your staked AOIS will be locked for the entire staking period. Early
        withdrawals are not permitted, ensuring commitment and stability in the
        ecosystem.
      </Text>
    </View>
  );
}

export default WarningCard;
