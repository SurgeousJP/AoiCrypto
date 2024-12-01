import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import AOISPower from "@/components/Segments/Stake/AOISPower";
import WithDrawn from "@/components/Segments/Stake/WithDrawn";
import Buy from "@/components/Segments/Transaction/Buy";
import React from "react";
import { View } from "react-native";

function Transaction() {
  return (
    <View className="px-4 h-full bg-background">
      <View className="w-full mb-4 mt-6 h-full">
        <CustomSegmentedControl
          screens={["Buy", "Sell", "Exchange"]}
          components={[<Buy />, <WithDrawn />, <AOISPower />]}
        />
      </View>
    </View>
  );
}

export default Transaction;
