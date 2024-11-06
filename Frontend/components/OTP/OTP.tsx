import { colors } from "@/constants/Colors";
import { globalStyles } from "@/constants/GlobalStyle";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

const OTP = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isFocus, setIsFocus] = useState(false);

  const handleFocus = () => {
    setIsFocus(true);
  };
  const handleBlur = () => {
    setIsFocus(false);
  };

  const handleChange = (text, index) => {
    console.log("Text: ", text);
    console.log("index: ", index);
    const numericValue = text.replace(/[^0-9]/g, ""); //  Ensure only numbers are accepted

    // Create a new array with the updated value at the specific index
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp]; // Create a copy of the existing array
      newOtp[index] = numericValue; // Update the specific index with the new value
      return newOtp; // Return the updated array
    });
  };

  useEffect(() => {
    console.log(otp);
  }, [otp]);

  return (
    <View className="flex flex-row space-x-2">
      <OtpInput
        numberOfDigits={6}
        type="numeric"
        focusColor={colors.primary}
        focusStickBlinkingDuration={500}
        onTextChange={(text) => console.log(text)}
        onFilled={(text) => console.log(`OTP is ${text}`)}
        textInputProps={{
          accessibilityLabel: "One-Time Password",
        }}
        theme={{
          containerStyle: { width: "auto", height: 36, gap: 8 },
          pinCodeContainerStyle: StyleSheet.flatten([
            { width: 36, height: 36, borderRadius: 8 },
            globalStyles.innerShadow,
            globalStyles.background
          ]),
          pinCodeTextStyle: StyleSheet.flatten([
            { fontFamily: "ReadexPro_400Regular", fontSize: 16, fontWeight: 'bold' },
          ]),
        }}
      />
    </View>
  );
};

export default OTP;
