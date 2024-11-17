import WhitelistApplication from "@/components/Items/Application/WhitelistApplication";
import Container from "@/components/Layouts/Container";
import CustomSegmentedControl from "@/components/Navigations/SegmentedControl/SegmentedControl";
import AOISLevelSegment from "@/components/Segments/Staking/AOISLevel";
import SummarySegment from "@/components/Segments/Staking/Summary";
import { colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";

export default function StakingScreen() {

  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(loading => false) },[])
  
  if (loading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex flex-col px-4 bg-background">
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
      <View className="flex flex-col h-[308px] overflow-hidden mt-4">
        <CustomSegmentedControl
          screens={["POLS Level", "Summary"]}
          components={[<AOISLevelSegment />, <SummarySegment />]}
        />
      </View>
      <View className="mt-4">
        <View className="flex flex-row justify-between">
          <Text className="font-readexSemiBold text-md">Your application</Text>
          <Text className="font-readexSemiBold text-md text-primary">More</Text>
        </View>
        <View className="mt-2"> 
        <WhitelistApplication />
        </View>
        <View className="mt-2"> 
        <WhitelistApplication />
        </View>
        <View className="mt-2"> 
        <WhitelistApplication />
        </View>
        <View className="mt-2"> 
        <WhitelistApplication />
        </View>
      </View>
    </ScrollView>
  );
}
