import { colors } from "@/constants/colors";
import SegmentedControl, {
  FontStyle,
} from "@react-native-segmented-control/segmented-control";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface SegmentedControlProp {
  screens: string[];
  components: any[];
}

const CustomSegmentedControl: React.FC<SegmentedControlProp> = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500); // 500ms delay for loading
  };

  const customFont: FontStyle = {
    fontSize: 14,
    color: colors.secondary,
    fontFamily: "ReadexPro_400Regular", // Use the correct loaded font for regular style
  };

  const customFontBold: FontStyle = {
    fontFamily: "ReadexPro_700Bold", // Use the correct font for bold style
    fontWeight: "light",
    color: colors.primary, // Apply color if needed
  };

  return (
    <View style={styles.container}>
      <SegmentedControl
        fontStyle={customFont} // Regular font
        activeFontStyle={customFontBold} // Bold font for active state
        values={props.screens}
        selectedIndex={selectedIndex}
        onChange={handleChange}
        style={styles.segmentedControl}
      />

      <View className="mt-2 w-full flex-1">
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          props.components[selectedIndex]
        )}
      </View>
    </View>
  );
};

export default CustomSegmentedControl;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  segmentedControl: {
    width: "100%",
  },
  loaderContainer: {
    marginTop: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.primary,
    fontFamily: "ReadexPro_400Regular",
  },
});
