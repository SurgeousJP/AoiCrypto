import React from "react";
import { Pressable, View, Text } from "react-native";

interface NormalButtonInterface{
  content: string;
  onClick: () => void;
}

const NormalButton:React.FC<NormalButtonInterface> = (props) => {

  const onPress = (e) => {
    props.onClick();
  }

  return (
    <Pressable
      onPress={onPress}
      className={`w-full flex flex-row items-center justify-center space-x-2 p-1 h-fit rounded-md bg-primary `}
    >
      <View className="flex flex-row space-x-2 items-center">
        <Text
          className={`text-surface font-readexRegular text-center text-md my-auto`}
        >
          {props.content}
        </Text>
      </View>
    </Pressable>
  );
};

export default NormalButton;
