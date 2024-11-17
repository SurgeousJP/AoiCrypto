import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import HistorySegment from "@/components/Segments/Portfolio/History";
import ProfileSegment from "@/components/Segments/Portfolio/Profile";
import Description from "@/components/Segments/ProjectDetail/Description";
import Overview from "@/components/Segments/ProjectDetail/Overview";
import TokenNPool from "@/components/Segments/ProjectDetail/TokenNPool";
import { colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  View, Text
} from "react-native";

export default function PortfolioScreen() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(loading => false) },[])
  
  if (loading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="px-4 py-4">
        <View className="pt-4 flex flex-col">
          <CustomSegmentedControl
            screens={["History", "Profile"]}
            components={[<HistorySegment />, <ProfileSegment />]}
          />
        </View>
      </View>
    </ScrollView>
  );
}