import Back from "@/assets/icons/system-icons-svg/Back.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import { colors } from "@/constants/colors";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function TradeScreen() {
  return (
    <View className="flex-1">
      <View className="border-b-[0.2px] border-border" style={{ elevation: 2 }}>
        <ScreenHeader
          LeftComponent={
            <View className="opacity-0">
              <Back stroke={colors.secondary} width={20} height={20} />
            </View>
          }
          CenterComponent={
            <Text className="text-[20px] font-readexSemiBold">Trade</Text>
          }
          RightComponent={
            <Link href={"/settings"}>
              <Setting fill={colors.secondary} width={24} height={24} />
            </Link>
          }
        ></ScreenHeader>
      </View>
      <ScrollView className="px-4 bg-background">
        <View className="w-full mb-4 mt-6">
          {/* <CustomSegmentedControl
            screens={["Stake", "Withdrawn", "AOIS Power"]}
            components={[<StakeSegment />, <WithDrawn />, <AOISPower />]}
          /> */}
        </View>
      </ScrollView>
    </View>
  );
}
