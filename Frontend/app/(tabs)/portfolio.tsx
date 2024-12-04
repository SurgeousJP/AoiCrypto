import Back from "@/assets/icons/system-icons-svg/Back.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import ApplicationSegment from "@/components/Segments/Portfolio/Applications";
import HistorySegment from "@/components/Segments/Portfolio/History";
import ProfileSegment from "@/components/Segments/Portfolio/Profile";
import { colors } from "@/constants/Colors";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function PortfolioScreen() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading((loading) => false);
  }, []);

  if (loading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col flex-1 bg-background">
      <View className="border-b-[0.2px] border-border">
        <ScreenHeader
          LeftComponent={
            <View className="opacity-0">
              <Back stroke={colors.secondary} width={20} height={20} />
            </View>
          }
          CenterComponent={
            <Text className="text-[20px] font-readexSemiBold">Portfolio</Text>
          }
          RightComponent={
            <Link href={"/settings"}>
              <Setting fill={colors.secondary} width={24} height={24} />
            </Link>
          }
        ></ScreenHeader>
      </View>
      <View className="px-4 py-4 flex-1">
        <View className="pt-4 flex-1">
          <CustomSegmentedControl
            screens={["History", "Profile", "Applications"]}
            components={[
              <HistorySegment />,
              <ProfileSegment />,
              <ApplicationSegment />,
            ]}
          />
        </View>
      </View>
    </View>
  );
}
