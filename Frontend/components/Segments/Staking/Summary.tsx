import Dollar from "@/assets/icons/system-icons-svg/Dollar.svg";
import Layers from "@/assets/icons/system-icons-svg/Layers.svg";
import Line from "@/assets/icons/system-icons-svg/Line.svg";
import Wallet from "@/assets/icons/system-icons-svg/Wallet.svg";
import { colors } from "@/constants/Colors";
import React from "react";
import { Text, View } from "react-native";
import { SvgProps } from "react-native-svg";

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
      <Text className="font-readexSemiBold text-[20px] mt-2 mb-[-4px]">
        {" "}
        Metrics
      </Text>
      {summaryItems.map((summary, index) => {
        const Icon = summary.icon;
        return (
          <View id={index.toString()} className="mt-3">
            <View
              className="flex flex-row justify-between p-4 rounded-xl bg-surface overflow-hidden border-border border-[0.5px]"
              style={{ elevation: 2 }}
            >
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
