import LineChartComponent from "@/components/Displays/Chart/LineChart";
import Container from "@/components/Layouts/Container";
import React from "react";
import { View, Text, ScrollView } from "react-native";
import Dollar from "@/assets/icons/system-icons-svg/Dollar.svg";
import Layers from "@/assets/icons/system-icons-svg/Layers.svg";
import Line from "@/assets/icons/system-icons-svg/Line.svg";
import Wallet from "@/assets/icons/system-icons-svg/Wallet.svg";
import { colors } from "@/constants/colors";
import { SvgProps } from "react-native-svg";
import DividerLine from "@/components/Displays/Divider/DividerLine";

interface SummaryItem {
  icon: React.FC<SvgProps>;
  label: string;
  value: string;
}

const ProfileSegment = () => {
  const summaryItems: SummaryItem[] = [
    { icon: Wallet, label: "Funds Invested", value: "$1,000.0" },
    { icon: Layers, label: "AOIS Staked", value: "2520" },
    { icon: Line, label: "IDOs Participated", value: "20" },
    { icon: Dollar, label: "Completed Missions", value: "5" },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex flex-col mt-2 pb-4"
    >
      <Text className="font-readexSemiBold text-md ml-2 mt-2 mb-2">
        Analytics
      </Text>
      <View className="mb-4 border-border border-[0.5px]">
        <Container>
          <View className="bg-surface rounded-lg p-2 flex flex-col items-center">
            <Text className="font-readexSemiBold text-md">
              Portfolio Report
            </Text>
            <Text className="font-readexBold text-xl">$2,760.23</Text>
            <Text className="font-readexSemiBold text-md mb-2">+2.60%</Text>
            <LineChartComponent />
          </View>
        </Container>
      </View>
      <View className="mb-2 border-border border-[0.5px]">
        <Container>
          <View className="bg-surface rounded-lg p-2 flex flex-col">
            <View className="flex flex-row justify-between mb-2">
              <Text className="font-readexRegular text-secondary">
                Total Pool Invested
              </Text>
              <Text className="font-readexRegular text-black">25</Text>
            </View>
            <View className="flex flex-row justify-between mb-2">
              <Text className="font-readexRegular text-secondary">
                Total ETH Invested
              </Text>
              <Text className="font-readexRegular text-black">252</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="font-readexRegular text-secondary">
                Total Invested
              </Text>
              <Text className="font-readexRegular text-black">$5,200</Text>
            </View>
          </View>
        </Container>
      </View>
      <View className="bg-background pb-1 flex flex-col">
        <Text className="font-readexSemiBold text-md mt-2 ml-2 mb-2">
          Metrics
        </Text>
        {summaryItems.map((summary, index) => {
          const Icon = summary.icon;
          return (
            <View id={summary.label} className="">
              <View className="flex flex-row justify-between p-4 bg-surface">
                <View className="flex flex-row space-x-2">
                  <Icon stroke={colors.secondary} />
                  <Text className="font-readexRegular text-black">
                    {summary.label}
                  </Text>
                </View>
                <Text className="font-readexRegular">{summary.value}</Text>
              </View>
              {index < summaryItems.length - 1 && <DividerLine />}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ProfileSegment;
