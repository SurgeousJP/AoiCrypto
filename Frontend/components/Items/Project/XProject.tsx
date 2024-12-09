import React from "react";
import { View, Image, Text } from "react-native";

const XProject = () => {
  const projectLogo = require("@/assets/images/ProjectLogo.png"); 
  return (
      <View
        id="project-card"
        className="flex flex-row h-fit w-full bg-surface rounded-lg overflow-hidden py-2 px-4 items-center justify-between" style={{elevation: 1}}
      >
        <View className="flex flex-row space-x-2 items-center">
          <Image source={projectLogo} className="w-8 h-8" />
          <View className="flex flex-col">
            <Text className="font-readexRegular text-md">Polytrade</Text>
            <Text className="font-readexRegular text-sm text-secondary">
              TRADE
            </Text>
          </View>
        </View>
        <View className="flex flex-col">
            <Text className="font-readexBold text-md flex-1 text-right">$300,000</Text>
            <Text className="font-readexRegular text-sm flex-1 text-right text-success">
              1423 funders
            </Text>
          </View>
      </View>
  );
};

export default XProject;
