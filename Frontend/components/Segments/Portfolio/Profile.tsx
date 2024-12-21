import Dollar from "@/assets/icons/system-icons-svg/Dollar.svg";
import Layers from "@/assets/icons/system-icons-svg/Layers.svg";
import Line from "@/assets/icons/system-icons-svg/Line.svg";
import Wallet from "@/assets/icons/system-icons-svg/Wallet.svg";
import DividerLine from "@/components/Displays/Divider/DividerLine";
import Container from "@/components/Layouts/Container";
import { colors } from "@/constants/colors";
import { BIGINT_CONVERSION_FACTOR } from "@/constants/conversion";
import { AuthContext } from "@/contexts/AuthProvider";
import { GET_INVESTED_PROJECT } from "@/queries/portfolio";
import { useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SvgProps } from "react-native-svg";

interface SummaryItem {
  icon: React.FC<SvgProps>;
  label: string;
  value: string;
}

const ProfileSegment = () => {
  const { address } = useContext(AuthContext);
  const {
    loading: isProjectLoading,
    error,
    data: investedProject,
  } = useQuery(GET_INVESTED_PROJECT, {
    variables: { id: address },
  });

  // Extracting data from the query
  const account = investedProject?.account;
  const totalInvested = account.investedTotal;
  const totalInvestedAmount =
    (account.investedTotalAmount ?? 0) / BIGINT_CONVERSION_FACTOR;

  const fakeToMoney = 3407.8;

  const summaryItems: SummaryItem[] = [
    {
      icon: Wallet,
      label: "Funds Invested",
      value: `$${(totalInvestedAmount * fakeToMoney).toFixed(2)}`,
    },
    { icon: Layers, label: "AOIS Staked", value: "2520" }, // Replace with actual data if available
    { icon: Line, label: "IDOs Participated", value: "20" }, // Replace with actual data if available
    { icon: Dollar, label: "Completed Missions", value: "5" }, // Replace with actual data if available
  ];

  if (isProjectLoading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  if (error) {
    return (
      <Text className="text-red-500 text-center mt-4">
        Error loading data: {error.message}
      </Text>
    );
  }

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
            <Text className="font-readexBold text-xl">
              ${(totalInvestedAmount * fakeToMoney).toFixed(2)}
            </Text>
            <Text className="font-readexSemiBold text-md mb-2">+2.60%</Text>
            {/* <LineChartComponent /> */}
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
              <Text className="font-readexRegular text-black">
                {totalInvested}
              </Text>
            </View>
            <View className="flex flex-row justify-between mb-2">
              <Text className="font-readexRegular text-secondary">
                Total ETH Invested
              </Text>
              <Text className="font-readexRegular text-black">
                {totalInvestedAmount}
              </Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="font-readexRegular text-secondary">
                Total Invested
              </Text>
              <Text className="font-readexRegular text-black">
                ${(totalInvestedAmount * fakeToMoney).toFixed(2)}
              </Text>
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
            <View key={summary.label} className="">
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
