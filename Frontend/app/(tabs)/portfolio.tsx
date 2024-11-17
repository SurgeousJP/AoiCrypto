import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import HistorySegment from "@/components/Segments/Portfolio/History";
import ProfileSegment from "@/components/Segments/Portfolio/Profile";
import Description from "@/components/Segments/ProjectDetail/Description";
import Overview from "@/components/Segments/ProjectDetail/Overview";
import TokenNPool from "@/components/Segments/ProjectDetail/TokenNPool";
import React from "react";
import {
  ScrollView,
  View,
} from "react-native";

export default function Portfolio() {


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