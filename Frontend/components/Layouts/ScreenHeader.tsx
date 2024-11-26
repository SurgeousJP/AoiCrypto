import React from "react";
import { View, Image, Text } from "react-native";

const ScreenHeader = ({ LeftComponent, CenterComponent, RightComponent }) => {
  return (
      <View className="flex flex-row justify-between items-center bg-surface py-2 px-4" style={{elevation: 2}}>
        {LeftComponent}
        {CenterComponent}
        {RightComponent}
      </View>
  );
};
export default ScreenHeader;
