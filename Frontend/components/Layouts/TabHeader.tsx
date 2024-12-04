import Profile from "@/assets/icons/system-icons-svg/Profile.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import AoiCryptoLogo from "@/assets/logos/AoiCryptoLogo.svg";
import { colors } from "@/constants/Colors";
import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";

const TabHeader = () => {
  return (
    <View
      className="flex flex-row justify-between items-center bg-surface py-2 px-4"
      style={{ elevation: 2 }}
    >
      <Link href={"/dashboard/1"}>
        <Profile stroke={colors.secondary} />
      </Link>
      <AoiCryptoLogo />
      <Link href={"/settings"}>
        <Setting fill={colors.secondary} />
      </Link>
    </View>
  );
};
export default TabHeader;
