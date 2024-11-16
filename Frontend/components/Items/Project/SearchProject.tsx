import React from "react";
import { View, Image, Text } from "react-native";
import { Shadow } from "react-native-shadow-2";
import CurrencyLabel from "../../Displays/CurrencyLabel/CurrencyLabel";

const SearchProject = () => {
  const projectLogo = require("@/assets/images/ProjectLogo.png");
  return (
    <Shadow
      stretch={true}
      offset={[0, 1]}
      startColor={"#2F66F61F"}
      distance={2}
      style={{ borderRadius: 8 }}
    >
      <View
        id="project-card"
        className="flex flex-row h-fit w-full bg-surface rounded-lg overflow-hidden py-2 items-center justify-between px-1"
      >
        <View className="flex flex-row space-x-1 items-center">
          <Image source={projectLogo} className="w-5 h-5" />
          <View className="flex flex-row">
            <Text className="font-readexRegular text-[12px]">Polytrade</Text>
          </View>
        </View>
          <Text className="font-readexRegular text-[12px] flex-1 text-right">
            $300,000
          </Text>
          <Text className="font-readexRegular text-[12px] flex-1 text-right mr-4">
            Oct 31, 2024
          </Text>
          <CurrencyLabel backgroundColor={"bg-error"} textColor={"text-surface"} content={"+469%"} />
      </View>
    </Shadow>
  );
};

export default SearchProject;
