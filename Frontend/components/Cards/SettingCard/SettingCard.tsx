import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface SettingCardProps {
  pos: "top" | "mid" | "bot";
  label?: string;
  title: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  onChevronClick?: () => void;
}

const getCardStyle = (pos: "top" | "mid" | "bot") => {
  switch (pos) {
    case "top":
      return "rounded-t-xl border-b border-gray-200";
    case "mid":
      return "border-b border-gray-200";
    case "bot":
      return "rounded-b-xl";
    default:
      return "";
  }
};

function SettingCard({
  pos,
  label,
  icon,
  title,
  action,
  onChevronClick,
}: SettingCardProps) {
  const handleChevronClick = (e) => {
    if (onChevronClick) {
      onChevronClick();
    }
  };

  return (
    <View
      className={`flex flex-row 
      )} items-center w-full h-[56px] justify-between p-4 bg-white border-border border-[0.25px]`}
    >
      <View className="flex flex-row items-center">
        {icon}
        <Text
          className={`text-sm ml-2 font-readexRegular  ${
            !label ? "text-black" : "text-gray-500"
          }`}
        >
          {title}
        </Text>
      </View>
      {!label && !action && (
        <View className="flex flex-row space-x-2">
          <View className="w-6 h-6 rounded-xl bg-primary">
            <Text className="text-sm text-white mx-auto my-auto">5</Text>
          </View>
          <Pressable className="opacity-80" onPress={handleChevronClick}>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={colors.secondary}
            />
          </Pressable>
        </View>
      )}
      {action && action}
      {label && (
        <Text className="text-black readexRegular font-semibold ">{label}</Text>
      )}
    </View>
  );
}

export default SettingCard;
