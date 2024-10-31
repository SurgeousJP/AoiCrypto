import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ToggleSwitch from "toggle-switch-react-native";
import Switch from "react-native-switch-toggles";

const CustomSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View>
      <ToggleSwitch
        isOn={isEnabled}
        onColor="#2F66F6"
        offColor="#D7D9E4"
        labelStyle={{ color: "black", fontWeight: "900" }}
        size="medium"
        onToggle={toggleSwitch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CustomSwitch;
