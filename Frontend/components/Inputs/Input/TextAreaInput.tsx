import { colors } from "@/constants/colors";
import { BIGINT_CONVERSION_FACTOR } from "@/constants/conversion";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface LabelInputProps {
  type: InputType;
  title: string;
  name: string;
  placeholder: string;
  value: any;
  onChange: (name: any, value: any) => void;
  isUnitVisible?: boolean;
  initialValue?: any;
}

export type InputType =
  | "text"
  | "email"
  | "password"
  | "numeric"
  | "phone"
  | "decimal"
  | "datetime";

const TextAreaInput: React.FC<LabelInputProps> = ({
  isUnitVisible = false,
  ...props
}) => {
  const [value, setValue] = useState(props.initialValue);

  const handleChangeText = (text) => {
    props.onChange(props.name, text);
    setValue(text);
    console.log(value);
  };

  return (
    <View className="flex flex-col">
      <Text className="text-sm font-readexSemiBold">{props.title}</Text>
      <View
        style={{
          flexDirection: "col",
          alignItems: "start",
          borderWidth: 0.5,
          borderColor: colors.secondary,
          borderRadius: 4,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        <View className="flex flex-col">
          <TextInput
            textAlignVertical="top"
            multiline
            numberOfLines={6}
            id={props.name}
            value={value}
            style={{
              flex: 1,
              fontFamily: "ReadexPro_400Regular",
              alignSelf: "flex-start",
              height: "100%",
            }}
            keyboardType={"default"}
            onChangeText={handleChangeText}
          />
          {isUnitVisible && (
            <Text className="font-readexRegular text-secondary">ETH</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default TextAreaInput;
