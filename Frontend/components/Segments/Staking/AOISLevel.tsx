import CurrencyLabel from "@/components/Displays/CurrencyLabel/CurrencyLabel";
import { colors } from "@/constants/Colors";
import React from "react";
import { View, Text } from "react-native";
import { Shadow } from "react-native-shadow-2";
import { SvgProps, Line } from "react-native-svg";

interface AOISLevel {
  label: string;
  value: number;
  probability: number;
}

const AOISLevelSegment = () => {
  const aoiLevels: AOISLevel[] = [
    { label: "AOIS Bronze", value: 1000, probability: 20.79 },
    { label: "AOIS Silver", value: 3000, probability: 35.62 },
    { label: "AOIS Gold", value: 10000, probability: 43.59 },
  ];

  return (
    <View className="bg-background pb-1 flex flex-col">
      <View className="mt-2">
        <Shadow
          stretch={true}
          startColor="#2F66F61F"
          distance={2}
          offset={[0, 2]}
          paintInside={true}
          style={{ margin: 1, borderRadius: 8 }}
        >
          <View className="flex flex-row justify-between px-4 py-2 rounded-lg bg-surface overflow-hidden">
            <View className="flex flex-row space-x-2">
              <Text className="font-readexRegular text-black">
                {"AOIS Power"}
              </Text>
            </View>
            <Text className="font-readexRegular">
              {"Allowlist Probability"}
            </Text>
          </View>
        </Shadow>
      </View>
      {aoiLevels.map((lvl, idx) => {
        return (
          <View className="mt-2">
            <Shadow
              stretch={true}
              startColor="#2F66F61F"
              distance={2}
              offset={[0, 2]}
              paintInside={true}
              style={{ margin: 1, borderRadius: 8 }}
            >
              <View className="flex flex-row justify-between px-4 py-2 rounded-lg bg-surface overflow-hidden items-center">
                <View className="flex flex-col">
                  <Text className="font-readexRegular text-black mb-0 pb-0">
                    {lvl.label}
                    {"\n"}
                    <Text className="font-readexRegular text-secondary">
                      {lvl.value}+ {idx === aoiLevels.length - 1 ? "(NO COOLDOWN)" : ""} 
                    </Text>
                  </Text>
                </View>
                <Text className="font-readexRegular">{lvl.probability}</Text>
              </View>
            </Shadow>
          </View>
        );
      })}
    </View>
  );
};

export default AOISLevelSegment;
