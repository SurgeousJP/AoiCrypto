import AOISPowerCard from "@/components/Cards/AOISPowerCard/AOISPowerCard";
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
      <View className="flex flex-col space-y-3 mt-4">
        <View>
          <AOISPowerCard
            percentage={"Allowlist Probability "}
            tier={"AOIS Power"}
          />
        </View>
        <View>
          <AOISPowerCard
            quantity={"1,000+"}
            percentage={"20.79%"}
            tier={"AOIS Bronze"}
          />
        </View>
        <View>
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
