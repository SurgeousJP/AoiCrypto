import React, { useState } from "react";
import { View } from "react-native";

import LabelInput, { InputType } from "./LabelInput";
interface InputProps {
  label: string;
  type: InputType;
  placeholder?: string;
}

const Input: React.FC<InputProps> = (props) => {
  const [value, setValue] = useState("");

  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row space-x-2 items-center">
        <View className="w-full">
          <LabelInput
            title={props.label}
            type={props.type}
            value={value}
            onChange={(value) => setValue(value)}
            name={""}
            placeholder={props.placeholder ?? ""}
          />
        </View>
      </View>
    </View>
  );
};

export default Input;
