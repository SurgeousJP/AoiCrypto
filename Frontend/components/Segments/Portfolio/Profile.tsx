import LineChartComponent from "@/components/Displays/Chart/LineChart";
import Container from "@/components/Layouts/Container";
import React from "react";
import { View, Text } from "react-native";
import SummarySegment from "../Staking/Summary";
import PieChart from 'react-native-pie-chart'

const ProfileSegment = () => {
  return (
    <View className="flex flex-col mt-2">
      <View className="mb-4">
        <Container>
          <View className="bg-surface rounded-lg p-2">
            <Text className="font-readexRegular">
              Connected as{" "}
              <Text className="font-readexBold">
                0x9F1691585e3751b7886B1063f5BAA5500E9478e2
              </Text>
            </Text>
            <Text className="font-readexRegular text-black">
              0 <Text className="font-readexRegular text-secondary">ETH</Text>
            </Text>
          </View>
        </Container>
      </View>

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
    </View>
  );
};

export default ProfileSegment;
