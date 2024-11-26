import React from "react";
import { View, Text } from "react-native";
import { Shadow } from "react-native-shadow-2";

const MissionTask = ({icon, content}) => {
  return (
      <View className="bg-surface p-2 rounded-lg border-border border-[1px]" style={{elevation: 2}}>
        <View className="flex flex-row space-x-1">
          {icon}
          <Text className="font-readexRegular">{content}</Text>
        </View>
      </View>
  );
};

export default MissionTask;
