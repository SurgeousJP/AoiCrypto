import React from "react";
import { View, Text } from "react-native";
import { Shadow } from "react-native-shadow-2";

const MissionTask = ({icon, content}) => {
  return (
    <Shadow
      stretch={true}
      startColor="#2F66F61F"
      distance={3}
      offset={[1, 1]}
      paintInside={true}
      containerStyle={{ width: "100%", height: "auto" }}
      style={{ margin: 1, borderRadius: 8 }}
    >
      <View className="bg-surface p-2 rounded-lg">
        <View className="flex flex-row space-x-1">
          {icon}
          <Text className="font-readexRegular">{content}</Text>
        </View>
      </View>
    </Shadow>
  );
};

export default MissionTask;
