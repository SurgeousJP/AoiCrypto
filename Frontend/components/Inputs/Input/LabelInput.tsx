import { colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from expo
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
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
  value: any;
  placeholder: string;
  onChange: (e: any) => void;
}

export type InputType =
  | "text"
  | "email"
  | "password"
  | "numeric"
  | "phone"
  | "decimal"
  | "datetime";

const LabelInput: React.FC<LabelInputProps> = (props) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const inputProps: Record<InputType, TextInputProps> = {
    text: { keyboardType: "default", secureTextEntry: false },
    email: { keyboardType: "email-address", secureTextEntry: false },
    password: { keyboardType: "default", secureTextEntry: true },
    numeric: { keyboardType: "numeric", secureTextEntry: false },
    phone: { keyboardType: "phone-pad", secureTextEntry: false },
    decimal: { keyboardType: "decimal-pad", secureTextEntry: false },
    datetime: {}, // Placeholder for DateTime Picker handling
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // Keep the picker open on iOS
    if (selectedDate) {
      props.onChange(selectedDate);
    }
  };

  const handleChangeText = (text) => {
    if (props.type !== "numeric") {
      props.onChange(text);
    } else {
      const regex = /^[0-9]*$/; // Allow only digits (no negative or decimal point)
      if (regex.test(text)) {
        props.onChange(+text);
      }
    }
  };

  return (
    <View className="flex flex-col">
      <Text className="text-sm font-readexSemiBold">{props.title}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 0.5,
          borderColor: colors.secondary,
          borderRadius: 4,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        {props.type === "datetime" ? (
          <>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="font-readexRegular text-gray-400">
                {props.value
                  ? new Date(props.value).toLocaleString()
                  : props.placeholder}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={props.value ? new Date(props.value) : new Date()}
                mode="date" // android datetime picker is fucked up will update later https://github.com/react-native-datetimepicker/datetimepicker/pull/929
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={handleDateChange}
              />
            )}
          </>
        ) : (
          <TextInput
            id={props.name}
            placeholder={props.placeholder}
            value={props.value}
            style={{
              flex: 1,
              fontFamily: "ReadexPro_400Regular",
            }}
            keyboardType={inputProps[props.type].keyboardType}
            secureTextEntry={inputProps[props.type].secureTextEntry}
            onChangeText={handleChangeText}
          />
        )}
      </View>
    </View>
  );
};

export default LabelInput;
