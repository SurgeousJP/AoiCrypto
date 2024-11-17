import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
interface WarningCardProps {
  iconColor: string;
  content: string;
}

function WarningCard({ iconColor, content }: WarningCardProps) {
  return (
    <View className="p-3.5 bg-white rounded-xl shadow justify-center flex flex-row space-x-1 items-center">
      <Ionicons name="warning-outline" size={24} color={iconColor} />
      <Text className="self-stretch text-slate-900 text-sm font-light font-['Readex Pro'] leading-none">
        {content}
      </Text>
    </View>
  );
}

export default WarningCard;
