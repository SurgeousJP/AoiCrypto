import { colors } from "@/constants/colors";
import React from "react";
import { Text, View } from "react-native";
import StepIndicator from "react-native-step-indicator";
interface StepIndicatorProps {
  labels: string[];
  currentPosition: number;
  mode: string;
}

const StepIndicatorComponent: React.FC<StepIndicatorProps> = ({
  labels,
  currentPosition,
  mode,
}) => {
  const placeHolderLabels = ["Cart", "Delivery Address", "Order Summary"];
  const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colors.primary,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: colors.primary,
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: colors.primary,
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: colors.primary,
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 16,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: colors.primary,
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#000000",
    labelFontFamily: "ReadexPro_400Regular",
    labelSize: 16,
    currentStepLabelColor: "#ffffff",
  };

  return (
    <StepIndicator
      direction={"horizontal"}
      stepCount={3}
      customStyles={customStyles}
      currentPosition={currentPosition ?? 1}
      labels={labels.length > 0 ? labels : placeHolderLabels}
      renderStepIndicator={(obj) => {
        return (
          <Text
            className={`font-readexBold ${
              obj.position + 1 <= currentPosition ? "text-white" : "Text-black"
            }`}
          >
            {obj.position + 1}
          </Text>
        );
      }}
      renderLabel={(obj) => {
        return (
          <View className="flex text-left">
            <Text
              className="font-readexRegular text-center"
              style={{ writingDirection: "ltr" }}
            >
              {obj.label}
            </Text>
          </View>
        );
      }}
    />
  );
};

export default StepIndicatorComponent;
