import { colors } from "@/constants/colors";
import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface LabelInputProps {
  type: InputType;
  title: string;
  name: string;
  value: any;
  placeholder: string;
  onChange: (e) => void;
}

type InputType =
  | "text"
  | "email"
  | "password"
  | "numeric"
  | "phone"
  | "decimal";

const LabelInput: React.FC<LabelInputProps> = (props) => {
  const inputProps: Record<InputType, TextInputProps> = {
    text: { keyboardType: "default", secureTextEntry: false },
    email: { keyboardType: "email-address", secureTextEntry: false },
    password: { keyboardType: "default", secureTextEntry: true },
    numeric: { keyboardType: "numeric", secureTextEntry: false },
    phone: { keyboardType: "phone-pad", secureTextEntry: false },
    decimal: { keyboardType: "decimal-pad", secureTextEntry: false },
  };

  const handleChangeText = (text) => {
    if (props.type !== "numeric") {
      props.onChange(text);
    } else {
      const regex = /^[0-9]*$/; // Allow only digits (no negative or decimal point)
      if (regex.test(text)) {
        props.onChange(text);
      }
    }
  };

  return (
    <View className="flex flex-col">
      <Text className="text-sm font-readexSemiBold">{props.title}</Text>
      <View className="">
        <TextInput
          id={props.name}
          placeholder={""}
          value={props.value}
          style={{
            borderWidth: 0.5,
            borderColor: colors.secondary,
            borderRadius: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
            fontFamily: "ReadexPro_400Regular",
          }}
          keyboardType={inputProps[props.type].keyboardType}
          secureTextEntry={inputProps[props.type].secureTextEntry}
          onChangeText={handleChangeText}
        ></TextInput>
      </View>
    </View>
  );
};

export default LabelInput;
