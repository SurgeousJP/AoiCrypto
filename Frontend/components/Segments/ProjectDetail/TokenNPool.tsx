import Container from "@/components/Layouts/Container";
import React from "react";
import { View, Text } from "react-native";

const TokenNPool = () => {
  const tokenOverview = [
    { label: "Address", data: "N/A" },
    { label: "Name", data: "High" },
    { label: "Symbol", data: "High" },
    { label: "Decimals", data: "18" },
    { label: "Total Supply", data: "21,000,000" },
  ];

  const poolInfo = [
    { label: "Address", data: "N/A" },
    { label: "Token For Presale", data: "14,444,444 High" },
    { label: "Token For Liquidity", data: "6,852,953.118 High" },
    { label: "Initial Market Cap", data: "$44,483.2935" },
    { label: "SoftCap", data: "50ETH" },
    { label: "Start Time", data: "2024/11/07" },
    { label: "End Time", data: "2024/11/08" },
    { label: "Listing On", data: "Pancakeswap" },
    { label: "Liquidity", data: "51%" },
    { label: "Listing Until", data: "180 days after pool ends" },
  ]

  return (
    <View className="w-full">
      <View className="mt-2">
        <Container>
          <View className="bg-surface rounded-lg px-4 py-2 flex flex-col">
            <Text className="font-readexBold text-md text-primary">
              Token
            </Text>
            {tokenOverview.map((p) => {
              return (
                <View
                  key={p.label}
                  className="flex flex-row justify-between mt-2"
                >
                  <Text className="font-readexRegular">{p.label}</Text>
                  <Text className="font-readexRegular">{p.data}</Text>
                </View>
              );
            })}
          </View>
        </Container>
      </View>
      <View className="mt-2">
        <Container>
          <View className="bg-surface rounded-lg px-4 py-2 flex flex-col">
            <Text className="font-readexBold text-md text-primary">
              Pool Info
            </Text>
            {poolInfo.map((p) => {
              return (
                <View
                  key={p.label}
                  className="flex flex-row justify-between mt-2"
                >
                  <Text className="font-readexRegular">{p.label}</Text>
                  <Text className="font-readexRegular">{p.data}</Text>
                </View>
              );
            })}
          </View>
        </Container>
      </View>
    </View>
  );
};

export default TokenNPool;
