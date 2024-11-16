import React from "react";
import { View, Image, Text } from "react-native";
import { colors } from "@/constants/Colors";
import { Shadow } from "react-native-shadow-2";

const ScreenHeader = ({ LeftComponent, CenterComponent, RightComponent }) => {
  return (
    <Shadow
      stretch={true}
      offset={[0, 1]}
      startColor={"#2F66F61F"}
      distance={2}
    >
      <View className="flex flex-row justify-between items-center bg-surface py-2 px-4">
        {LeftComponent}
        {CenterComponent}
        {RightComponent}
      </View>
    </Shadow>
  );
};
export default ScreenHeader;
