import Back from "@/assets/icons/system-icons-svg/Back.svg";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import ScreenHeader from "@/components/Layouts/ScreenHeader";
import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import ProjectMetadataSegment from "@/components/Segments/ProjectDetail/ProjectMetadata";
import SellerAnalyticsSegment from "@/components/Segments/ProjectDetail/SellerAnalytics";
import SellerAllowlistSegment from "@/components/Segments/ProjectDetail/SellerWhitelist";
import { colors } from "@/constants/colors";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function SellerProjectDetailScreen() {
  const params = useLocalSearchParams();
  const { poolId } = params;

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
      {poolId !== undefined && <View className="flex-1">
        <View className="pt-4 flex-1">
          <CustomSegmentedControl
            screens={["Metadata", "Analytics", "Allowlist"]}
            components={[
              <ProjectMetadataSegment poolAddress={poolId} />,
              <SellerAnalyticsSegment poolAddress={poolId}/>,
              <SellerAllowlistSegment poolAddress={poolId}/>,
            ]}
          />
        </View>
      </View>}
    </View>
  );
}
