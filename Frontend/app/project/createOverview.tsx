import React from "react";
import { View, Text, ScrollView, ImageBackground } from "react-native";
import Illustration from "@/assets/images/illustration.svg";
import StepIndicatorComponent from "@/components/Navigations/StepIndicator/StepIndicator";
import NormalButton from "@/components/Buttons/NormalButton/NormalButton";
import { Link, useRouter } from "expo-router";

const CreateProjectOverview = () => {
  const labels = [
    "Project Information & Liquidity",
    "Sale Configuration & Whitelist Upload",
    "Review and Submit",
  ];

  const router = useRouter();
  const navigateToStepOne = () => {
    router.navigate("/project/createStepOne")
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex flex-col p-4">
        <Text className="text-[32px] font-readexSemiBold mb-2 text-center">
          Get started in 3 easy steps
        </Text>
        <View className="mx-auto">
          <Illustration width={322} height={284} />
        </View>

        <View className="h-[200px]">
          <StepIndicatorComponent mode={'horizontal'} labels={labels} currentPosition={-1} />
        </View>

        <View href='/project/createStepOne' className="h-[48px]">
          <NormalButton onClick={navigateToStepOne} content="Continue" />
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateProjectOverview;
