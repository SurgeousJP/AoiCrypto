import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import AOISPower from "@/components/Segments/Stake/AOISPower";
import Stake from "@/components/Segments/Stake/Stake";
import WithDrawn from "@/components/Segments/Stake/WithDrawn";
import React from "react";
import { ScrollView, View } from "react-native";
// WTF is this page for????????????
export default function Staking() {
  return (
    <ScrollView className="px-4 bg-background">
      <View className="w-full mb-4 mt-6">
        <CustomSegmentedControl
          screens={["Stake", "Withdrawn", "AOIS Power"]}
          components={[<Stake />, <WithDrawn />, <AOISPower />]}
        />
      </View>
    </ScrollView>
  );
}
