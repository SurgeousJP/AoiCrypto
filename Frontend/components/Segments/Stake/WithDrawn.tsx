import PrimaryButton from "@/components/Buttons/PrimaryButton/PrimaryButton";
import WarningCard from "@/components/Cards/WarningCard/WarningCard";
import React from "react";
import { Text, View } from "react-native";

function WithDrawn() {
  return (
    <View>
      <View className="flex flex-col items-center">
        <Text className="text-center mt-4 text-blue-600 text-xl font-readexBold leading-[38px]">
          0
        </Text>
        <Text className="text-center mt-1 text-blue-600 text-md font-readexBold leading-none mb-2">
          0.00 AOIS
          {"\n"}
          <Text className="text-center mb-1 text-blue-600 text-md font-readexBold leading-none">
            in wallet
          </Text>
        </Text>
        <PrimaryButton
          onPress={() => {
            console.log("test");
          }}
          content="Withdraw all"
        />
        <View className="mt-6">
          <WarningCard
            iconColor="#fed0d0"
            content={
              "Withdrawing your staked AOIS will reduce your AOIS Power and associated benefits. Please consider the impact on your tier status and IDO participation."
            }
          />
        </View>
      </View>
      <Text className="text-textColor text-md mt-3 font-readexBold">
        Upcoming Projects
      </Text>
      <View className="space-y-2 p-3 rounded-md mt-2 bg-white shadow">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-sm text-slate-900 font-readexRegular">
            AOIs Power Tier
          </Text>
          <Text className="text-sm text-slate-900 font-readexRegular">
            N/A{" "}
            <Text className="text-sm text-slate-500 font-readexRegular">
              {`(<1,000)`}
            </Text>
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-sm text-slate-900 font-readexRegular">
            Lottery Probability
          </Text>
          <Text className="text-sm text-slate-900 font-readexRegular">
            Not Eligible{" "}
            <Text className="text-sm text-slate-500 font-readexRegular">
              {`(<1,000)`}
            </Text>
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-sm text-slate-900 font-readexRegular">
            IDO Cooldown
          </Text>
          <Text className="text-sm text-slate-900 font-readexRegular">
            Not Eligible{" "}
            <Text className="text-sm text-slate-500 font-readexRegular">
              {`(<1,000)`}
            </Text>
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-sm text-slate-900 font-readexRegular">
            Lock-up Period
          </Text>
          <Text className="text-sm text-slate-900 font-readexRegular">
            7 days
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-sm text-slate-900 font-readexRegular">
            Total Staked{" "}
          </Text>
          <Text className="text-sm text-slate-900 font-readexRegular">
            0{" "}
            <Text className="text-sm text-slate-500 font-readexRegular">
              {`AOIS`}
            </Text>
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-sm text-slate-900 font-readexRegular">
            AOIS Power Gain{" "}
          </Text>
          <Text className="text-sm text-slate-900 font-readexRegular">
            0{" "}
            <Text className="text-sm text-slate-500 font-readexRegular">
              {`AOIS POWER`}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

export default WithDrawn;
