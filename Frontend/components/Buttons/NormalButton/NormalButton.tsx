import React from "react";
import { Pressable, View, Text } from "react-native";

interface NormalButtonInterface{
  content: string
}

const NormalButton:React.FC<NormalButtonInterface> = (props) => {
  return (
    <Pressable
      className={`w-full flex flex-row items-center justify-center space-x-2 h-fit rounded-xl bg-primary `}
    >
      <View className="flex flex-row space-x-2 items-center">
        <Text
          className={`text-surface font-readexBold text-center text-md my-auto`}
        >
          {props.content}
        </Text>
      </View>
    </Pressable>
  );
};

export default NormalButton;
