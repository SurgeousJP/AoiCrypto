import { colors } from "@/constants/colors";
import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

const ScreenLoadingIndicator = () => {
  return (
    <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
      <ActivityIndicator size={"large"} color={colors.primary} />
      <Text className="font-readexRegular text-primary text-md">Loading</Text>
    </View>
  );
};

export default ScreenLoadingIndicator;
