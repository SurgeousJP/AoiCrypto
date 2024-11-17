import Chart from "@/components/Displays/Chart/Chart";
import Container from "@/components/Layouts/Container";
import React from "react";
import { View, Text } from "react-native";

const ProfileSegment = () => {
  return (
    <View className="flex flex-col">
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
            <Text className="font-readexBold text-xl">$2,760.23$</Text>
            <Text className="font-readexSemiBold text-md mb-2">+2.60%</Text>
            <Chart />
          </View>
        </Container>
      </View>

      <View className="mb-4">
        <Container>
          <View className="bg-surface rounded-lg p-2 flex flex-col">
            <View className="flex flex-row justify-between mb-2">
              <Text className="font-readexRegular text-secondary">Total Pool Invested</Text>
              <Text className="font-readexRegular text-black">25</Text>
            </View>
            <View className="flex flex-row justify-between mb-2">
              <Text className="font-readexRegular text-secondary">Total ETH Invested</Text>
              <Text className="font-readexRegular text-black">252</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="font-readexRegular text-secondary">Total Invested</Text>
              <Text className="font-readexRegular text-black">$5,200</Text>
            </View>
          </View>
        </Container>
      </View>
    </View>
  );
};

export default ProfileSegment;
