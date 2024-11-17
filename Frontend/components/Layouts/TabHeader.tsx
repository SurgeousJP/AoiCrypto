import React from "react";
import { View, Image, Text, Pressable } from "react-native";
import AoiCryptoLogo from "@/assets/logos/AoiCryptoLogo.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import Profile from "@/assets/icons/system-icons-svg/Profile.svg";
import { colors } from "@/constants/Colors";
import { Shadow } from "react-native-shadow-2";
import { Link, useRouter } from "expo-router";

const TabHeader = () => {
  const router = useRouter();

  return (
    <Shadow
      stretch={true}
      offset={[0, 1]}
      startColor={"#2F66F61F"}
      distance={2}
    >
      <View className="flex flex-row justify-between items-center bg-surface py-2 px-4">
        <Link href={"/dashboard/1"}>
          <Profile stroke={colors.secondary} />
        </Link>
        <AoiCryptoLogo />
        <Link href={"/settings"}>
          <Setting fill={colors.secondary} />
        </Link>
      </View>
    </Shadow>
  );
};
export default TabHeader;
