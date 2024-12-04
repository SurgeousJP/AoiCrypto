import Back from "@/assets/icons/system-icons-svg/Back.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import AOISPower from "@/components/Segments/Stake/AOISPower";
import StakeSegment from "@/components/Segments/Stake/Stake";
import WithDrawn from "@/components/Segments/Stake/WithDrawn";
import { colors } from "@/constants/Colors";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function Staking() {
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
            <Text className="text-[20px] font-readexSemiBold">Staking</Text>
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
          <CustomSegmentedControl
            screens={["Stake", "Withdrawn", "AOIS Power"]}
            components={[<StakeSegment />, <WithDrawn />, <AOISPower />]}
          />
        </View>
      </ScrollView>
    </View>
  );
}
