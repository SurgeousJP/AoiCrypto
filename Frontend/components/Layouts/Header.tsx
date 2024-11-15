import React from "react";
import { View, Image, Text } from "react-native";
import AoiCryptoLogo from "@/assets/logos/AoiCryptoLogo.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import Profile from "@/assets/icons/system-icons-svg/Profile.svg";
import { colors } from "@/constants/Colors";
import { globalStyles } from "@/constants/GlobalStyle";
import { Shadow } from "react-native-shadow-2";

const Header = () => {
  return (
    <Shadow stretch={true} offset={[0,1]} startColor={"#2F66F61F"} distance={4}>
      <View className="flex flex-row justify-between items-center bg-surface py-2 px-4">
        <Profile stroke={colors.secondary} />
        <AoiCryptoLogo />
        <Setting fill={colors.secondary} />
      </View>
    </Shadow>
  );
};
export default Header;
