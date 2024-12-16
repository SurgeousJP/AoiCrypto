import { colors } from "@/constants/colors";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

interface PrimaryButtonProps {
  onPress: () => void;
  content: string;
  outlined?: boolean;
  disabled?: boolean;
}

function PrimaryButton({
  onPress,
  content,
  outlined = false,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`py-2.5 px-10 rounded-xl justify-center items-center inline-flex flex-row  ${
        outlined ? "border-2 border-blue-600 bg-transparent" : "bg-blue-600"
      }`}
    >
      {disabled && <ActivityIndicator size={"small"} color={!outlined ? "white" : colors.primary} />}
      <Text
        className={`text-center text-sm font-readexSemiBold ${
          outlined ? "text-blue-600" : "text-white"
        }`}
      > {content}
      </Text>
    </Pressable>
  );
}

export default PrimaryButton;
