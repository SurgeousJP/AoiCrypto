import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface SettingCardProps {
  pos: "top" | "mid" | "bot";
  label?: string;
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

function SettingCard({ pos, label }: SettingCardProps) {
  const profileIcon = require("../../../assets/icons/system-icons/Profile.png");

  return (
    <TouchableOpacity
      className={`flex flex-row ${getCardStyle(
        pos
      )} items-center w-[343px] h-[56px] justify-between p-4 bg-white`}
    >
      <View className="flex flex-row items-center">
        {!label && <Image source={profileIcon} className="w-6 h-6 mr-3" />}
        <Text
          className={`text-sm font-readexRegular  ${
            !label ? "text-black" : "text-gray-500"
          }`}
        >
          Profile
        </Text>
      </View>
      {!label && (
        <Ionicons name="chevron-forward-outline" size={20} color={"gray"} />
      )}
      {label && (
        <Text className="text-black readexRegular font-semibold ">{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export default SettingCard;
