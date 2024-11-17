import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import AOISLevelSegment from "@/components/Segments/Staking/AOISLevel";
import SummarySegment from "@/components/Segments/Staking/Summary";
import React from "react";
import { ScrollView, View, Text } from "react-native";

export default function Staking() {
  return (
    <ScrollView className="flex flex-col px-4 bg-background">
      <View className="flex flex-col">
        <View className="flex flex-col pt-8 items-center">
          <Text className="font-readexBold text-md text-primary">
            TOTAL AOIS POWER
          </Text>
          <Text className="font-readexBold text-xl text-primary">250</Text>
          <Text className="font-readexLight text-sm text-center">
            Stake an additional{" "}
            <Text className="font-readexSemiBold text-primary">1,000 AOIS</Text>{" "}
            to reach{" "}
            <Text className="font-readexSemiBold text-primary">
              AOIS Bronze
            </Text>{" "}
            and increase your chances of entering the next IDO by{" "}
            <Text className="font-readexSemiBold text-primary">14.88%</Text>
          </Text>
        </View>
      </View>
      <View className="flex flex-col h-[308px] overflow-hidden mt-4"> 
        <CustomSegmentedControl screens={["POLS Level", "Summary"]} components={[<AOISLevelSegment />, <SummarySegment />]} />
      </View>
    </ScrollView>
  );
}
