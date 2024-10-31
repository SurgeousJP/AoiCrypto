import React from "react";
import { View } from "react-native";

const ProgressBar = () => {
  return (
    <View className="flex flex-row gap-1 w-14 h-1">
      <View className="w-1/2 h-1 rounded-md bg-primary"></View>
      <View className="w-1/4 h-1 rounded-md bg-secondary"></View>
      <View className="w-1/4 h-1 rounded-md bg-secondary"></View>
    </View>
  );
};

export default ProgressBar;
