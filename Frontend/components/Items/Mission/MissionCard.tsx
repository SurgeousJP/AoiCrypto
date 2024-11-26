import React from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import { Shadow } from "react-native-shadow-2";
import { useRouter } from "expo-router";
import MissionTag from "@/components/Buttons/Tags/MissionTag";

const MissionCard = () => {
  const projectIllust = require("@/assets/images/ProjectIllust.png");
  const projectLogo = require("@/assets/images/ProjectLogo.png");

  return (
    <View
      id="project-card"
      className="flex flex-col h-fit w-full bg-surface rounded-lg overflow-hidden border-border border-[1px]"
      style={{ elevation: 2 }}
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
      <View className="flex flex-col mt-4 px-2 py-2 pb-0">
        <Text className="font-readexSemiBold text-md">Onboarding</Text>
        <View className="flex flex-row space-x-2 h-[26px]">
          <View className="flex-1">
            <MissionTag content={"BOOST"} />
          </View>
          <View className="flex-1">
            <MissionTag content={"TOKEN"} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MissionCard;
