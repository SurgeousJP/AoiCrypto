import AOISPowerCard from "@/components/Cards/AOISPowerCard/AOISPowerCard";
import Container from "@/components/Layouts/Container";
import React from "react";
import { Text, View } from "react-native";
function AOISPower() {
  return (
    <View>
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
      <View className="flex flex-col mt-4">
        <View className="mb-4 bg-surface px-4 py-2 rounded-md border-border border-[1px]" style={{elevation: 2}}>
          <View className="flex flex-row items-center justify-between w-full">
            <View>
              <Text className="text-md font-readexRegular text-black">
                AOIS Power
              </Text>
            </View>
            <Text className="text-md font-readexRegular text-black ml-2">
              Allowlist Probability
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <AOISPowerCard
            quantity={"1,000+"}
            percentage={"20.79%"}
            tier={"AOIS Bronze"}
          />
        </View>
        <View className="mb-4">
          <AOISPowerCard
            quantity={"2,000+"}
            percentage={"35.62%"}
            tier={"AOIS Silver"}
          />
        </View>
        <View>
          <AOISPowerCard
            quantity={"3,000+"}
            percentage={"43.59%"}
            tier={"AOIS Gold"}
          />
        </View>
      </View>
    </View>
  );
}

export default AOISPower;
