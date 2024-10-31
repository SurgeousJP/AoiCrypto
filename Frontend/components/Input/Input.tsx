import React, { useEffect } from "react";
import {
  Text,
  Image,
  ImageSourcePropType,
  View,
  TextInput,
} from "react-native";
import { useState } from "react";

import FloatingLabel from "./FloatingLabel";
import { setGlobalStyles } from "react-native-floating-label-input";

interface InputProps {
  label: string;
  isPassword?: true | false;
}

const Input: React.FC<InputProps> = (props) => {
  const [value, setValue] = useState("");

  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row space-x-2 items-center">
        <View className="w-full">
          <FloatingLabel
            label={props.label}
            isPassword={props.isPassword}
            value={value}
            onChangeText={(value) => setValue(value)}
          />
        </View>
      </View>
    </View>
  );
};

export default Input;
