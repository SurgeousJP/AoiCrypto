import React from "react";
import { View, Text } from "react-native";
import Wallet from "@/assets/icons/system-icons-svg/Wallet.svg";
import Layers from "@/assets/icons/system-icons-svg/Layers.svg";
import Line from "@/assets/icons/system-icons-svg/Line.svg";
import Dollar from "@/assets/icons/system-icons-svg/Dollar.svg";
import { SvgProps } from "react-native-svg";
import { colors } from "@/constants/Colors";

interface SummaryItem {
  icon: React.FC<SvgProps>;
  label: string;
  value: string;
}

const SummarySegment = () => {
  const summaryItems: SummaryItem[] = [
    { icon: Wallet, label: "Funds Invested", value: "$1,000.0" },
    { icon: Layers, label: "AOIS Staked", value: "2520" },
    { icon: Line, label: "IDOs Participated", value: "20" },
    { icon: Dollar, label: "Completed Missions", value: "5" },
  ];

  return (
    <View className="bg-background pb-1 flex flex-col">
      {summaryItems.map((summary) => {
        const Icon = summary.icon;
        return (
          <View className="mt-2">
              <View className="flex flex-row justify-between p-4 rounded-xl bg-surface overflow-hidden border-border border-[0.5px]" style={{elevation: 2}}>
                <View className="flex flex-row space-x-2">
                  <Icon stroke={colors.secondary} />
                  <Text className="font-readexRegular text-black">
                    {summary.label}
                  </Text>
                </View>
                <Text className="font-readexRegular">{summary.value}</Text>
              </View>
          </View>
        );
      })}
    </View>
  );
};

export default SummarySegment;
