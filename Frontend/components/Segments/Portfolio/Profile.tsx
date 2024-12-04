import LineChartComponent from "@/components/Displays/Chart/LineChart";
import Container from "@/components/Layouts/Container";
import React from "react";
import { View, Text, ScrollView } from "react-native";
import SummarySegment from "@/components/Segments/Staking/Summary";

const ProfileSegment = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex flex-col mt-2"
    >
      <Text className="font-readexSemiBold text-[20px] mt-2 mb-2">Analytics</Text>
      <View className="mb-4">
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
      <View className="mb-2">
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
      <SummarySegment />
    </ScrollView>
  );
};

export default ProfileSegment;
