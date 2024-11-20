import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Back from "@/assets/icons/system-icons-svg/Back.svg";
import { colors } from "@/constants/Colors";
import ScreenHeader from "./ScreenHeader";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import { Link } from "expo-router";

interface TitleHeaderProps {
  title: string; // Optional title prop
}

const TitleHeader: React.FC<TitleHeaderProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <ScreenHeader
      LeftComponent={
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Back stroke={colors.secondary} width={24} height={24} />
        </TouchableOpacity>
      }
      CenterComponent={
        <Text className="text-[20px] font-readexSemiBold">{title}</Text>
      }
      RightComponent={
        <Link href={"/settings"}>
          <Setting fill={colors.secondary} width={24} height={24} />
        </Link>
      }
    ></ScreenHeader>
  );
};

export default TitleHeader;
