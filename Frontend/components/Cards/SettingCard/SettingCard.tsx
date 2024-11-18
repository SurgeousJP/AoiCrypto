import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SettingCardProps {
  pos: "top" | "mid" | "bot";
  label?: string;
  title: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
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

function SettingCard({ pos, label, icon, title, action }: SettingCardProps) {
  const profileIcon = require("../../../assets/icons/system-icons/Profile.png");

  return (
    <TouchableOpacity
      className={`flex flex-row ${getCardStyle(
        pos
      )} items-center w-full h-[56px] justify-between p-4 bg-white`}
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
        <Ionicons name="chevron-forward-outline" size={20} color={"gray"} />
      )}
      {action && action}
      {label && (
        <Text className="text-black readexRegular font-semibold ">{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export default SettingCard;
