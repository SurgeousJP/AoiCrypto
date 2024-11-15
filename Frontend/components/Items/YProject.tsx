import React from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import { Shadow } from "react-native-shadow-2";

const YProject = () => {
  const projectIllust = require("@/assets/images/ProjectIllust.png");
  const projectLogo = require("@/assets/images/ProjectLogo.png");
  return (
    <Shadow
      stretch={true}
      offset={[0, 1]}
      startColor={"#2F66F61F"}
      distance={2}
      style={{borderRadius: 8}}
    >
      <View
        id="project-card"
        className="flex flex-col h-fit w-full bg-surface rounded-lg overflow-hidden"
      >
        <View className="w-full relative">
          <ImageBackground
            source={projectIllust}
            className="w-full h-[183px] rounded-lg"
          />
          <View className="w-[22px] h-[22px] border border-white rounded-[10px] items-center justify-center absolute bottom-[-10px] left-[10px]">
            <Image source={projectLogo} className="w-5 h-5" />
          </View>
        </View>
        <View className="flex flex-col mt-4 px-2 py-2">
          <Text className="font-readexMedium text-md">Highstreet</Text>
          <Text className="font-readexRegular text-secondary">
            Shopify on an MMORPG
          </Text>
          <View className="flex flex-row gap-1">
            <Text className="font-readexBold">$500,000</Text>
            <Text className="font-readexRegular">raised</Text>
          </View>
          <View className="flex flex-row gap-1">
            <Text className="font-readexBold">1200</Text>
            <Text className="font-readexRegular">participants</Text>
          </View>
          <View className="flex flex-row gap-1">
            <Text className="font-readexRegular">Ended on</Text>
            <Text className="font-readexBold">21/8/2024</Text>
          </View>
        </View>
      </View>
    </Shadow>
  );
};

export default YProject;
