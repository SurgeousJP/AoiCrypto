import Back from "@/assets/icons/system-icons-svg/Back.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import { colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import ScreenHeader from "./ScreenHeader";

interface TitleHeaderProps {
  title: string; // Optional title prop
  isSettingHidden?: boolean;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({
  title,
  isSettingHidden = false,
}) => {
  const navigation = useNavigation();

  return (
    <ScreenHeader
      LeftComponent={
        <TouchableOpacity onPress={() => navigation.goBack()} className="">
          <Back stroke={colors.secondary} width={20} height={20} />
        </TouchableOpacity>
      }
      CenterComponent={
        <Text className="text-[20px] font-readexSemiBold">{title}</Text>
      }
      RightComponent={
        <TouchableOpacity>
          <Link href={"/transaction"}>
            <Setting
              fill={isSettingHidden ? "#ffffff" : colors.secondary}
              width={24}
              height={24}
            />
          </Link>
        </TouchableOpacity>
      }
    ></ScreenHeader>
  );
};

export default TitleHeader;
