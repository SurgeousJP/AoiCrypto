import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import Description from "@/components/Segments/ProjectDetail/Description";
import Overview from "@/components/Segments/ProjectDetail/Overview";
import PrivateSaleSegment from "@/components/Segments/ProjectDetail/PrivateSale";
import TokenNPool from "@/components/Segments/ProjectDetail/TokenNPool";
import React from "react";
import { View, ScrollView } from "react-native";

const ProjectDetail = () => {
  const isPrivateSale = true;

  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {!isPrivateSale && (
        <View className="px-4 py-4">
          <View className="pt-4 flex flex-col">
            <CustomSegmentedControl
              screens={["Overview", "Description", "Token & Pool"]}
              components={[<Overview />, <Description />, <TokenNPool />]}
            />
          </View>
        </View>
      )}

      {isPrivateSale && (
        <View className="p-4">
          <PrivateSaleSegment />
        </View>
      )}
    </ScrollView>
  );
};

export default ProjectDetail;
