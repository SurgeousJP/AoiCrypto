import { colors } from "@/constants/colors";
import React, { useState } from "react";
import { View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

interface CheckboxProps {
  keyValue: string;
  content: string;
  onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = (props) => {
  const [localChecked, setLocalChecked] = useState(false);
  return (
    <View>
      <BouncyCheckbox
        key={props.keyValue}
        isChecked={localChecked}
        size={24}
        fillColor={colors.primary}
        unFillColor={colors.surface}
        text={props.content}
        useBuiltInState={false}
        iconStyle={{ borderColor: "red", borderRadius: 12 }}
        innerIconStyle={{
          borderWidth: 2,
          borderRadius: 12,
        }}
        textStyle={{
          fontFamily: "ReadexPro_400Regular",
          color: colors.textColor,
          fontSize: 14,
          textDecorationLine: "none",
        }}
        onPress={(isChecked: boolean) => {
          console.log(isChecked);
          setLocalChecked(!localChecked);
          if (props.onChange) {
            props.onChange(!localChecked);
          }
        }}
      />
    </View>
  );
};

export default Checkbox;
