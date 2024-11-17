import React from "react";
import { Pressable, View, Text } from "react-native";

interface MissionTagInterface{
  content: string
}

const MissionTag:React.FC<MissionTagInterface> = (props) => {
  return (
    <Pressable
      className={`w-full flex flex-row items-center justify-center space-x-2 h-fit rounded-lg bg-primary `}
    >
      <View className="flex flex-row space-x-2 items-center">
        <Text
          className={`text-surface font-readexRegular text-center text-[12px] my-auto`}
        >
          {props.content}
        </Text>
      </View>
    </Pressable>
  );
};

export default MissionTag;
