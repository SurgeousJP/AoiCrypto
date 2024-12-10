import Back from "@/assets/icons/system-icons-svg/Back.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import ApplicationSegment from "@/components/Segments/Portfolio/Applications";
import ProfileSegment from "@/components/Segments/Portfolio/Profile";
import SellerAnalyticsSegment from "@/components/Segments/ProjectDetail/SellerAnalytics";
import SellerWhitelistSegment from "@/components/Segments/ProjectDetail/SellerWhitelist";
import { colors } from "@/constants/colors";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";

export default function SellerProjectDetailScreen() {
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

  const handleBack = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <View className="flex flex-col flex-1 bg-background">
      <View className="border-b-[0.2px] border-border">
        <ScreenHeader
          LeftComponent={
            <TouchableOpacity className="opacity-100" onPress={handleBack}>
              <Back stroke={colors.secondary} width={20} height={20} />
            </TouchableOpacity>
          }
          CenterComponent={
            <Text className="text-[20px] font-readexSemiBold">
              Project Detail
            </Text>
          }
          RightComponent={
            <Link href={"/seller/setting"}>
              <Setting fill={colors.secondary} width={24} height={24} />
            </Link>
          }
        ></ScreenHeader>
      </View>
      <View className="px-4 py-4 flex-1">
        <View className="pt-4 flex-1">
          <CustomSegmentedControl
            screens={["Metadata", "Analytics", "Whitelist"]}
            components={[
              <ApplicationSegment />,
              <SellerAnalyticsSegment />,
              <SellerWhitelistSegment />,
            ]}
          />
        </View>
      </View>
    </View>
  );
}
