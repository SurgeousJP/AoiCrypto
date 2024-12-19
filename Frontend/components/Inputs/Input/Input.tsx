import React from "react";
import { View } from "react-native";

import LabelInput, { InputType } from "./LabelInput";
interface InputProps {
  label: string;
  type: InputType;
  placeholder?: string;
  name: string;
  value: any;
  readonly?: boolean;
  onChange: (name: any, value: any) => void;
  isUnitVisible?: boolean;
  initialValue?: any;
}

const Input: React.FC<InputProps> = ({ isUnitVisible = false, ...props }) => {
  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row space-x-2 items-center">
        <View className="w-full">
          <LabelInput
            title={props.label}
            type={props.type}
            initialValue={props.initialValue}
            value={props.value}
            onChange={props.onChange}
            readonly={props.readonly}
            name={props.name}
            placeholder={props.placeholder ?? ""}
            isUnitVisible={isUnitVisible}
          />
        </View>
      </View>
    </View>
  );
};

export default Input;
