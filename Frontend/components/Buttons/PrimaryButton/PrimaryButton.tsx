import React from "react";
import { Pressable, Text } from "react-native";

interface PrimaryButtonProps {
  onPress: () => void;
  content: string;
  outlined?: boolean;
}

function PrimaryButton({
  onPress,
  content,
  outlined = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2.5 rounded-xl justify-start items-center inline-flex ${
        outlined ? "border-2 border-blue-600 bg-transparent" : "bg-blue-600"
      }`}
    >
      <Text
        className={`text-center text-sm font-readexSemiBold ${
          outlined ? "text-blue-600" : "text-white"
        }`}
      >
        {content}
      </Text>
    </Pressable>
  );
}

export default PrimaryButton;
