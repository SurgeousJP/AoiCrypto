import { colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface CustomDropdownProps {
  placeholder?: string;
  width?: number;
  data: { label: string; value: string }[];
  value: any;
  onChange: (value: any) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = (props) => {

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    dropdown: {
      height: 32,
      backgroundColor: props.value !== null ? colors.surface : "#f4f4f4",
      borderWidth: props.value !== null ? 0.5 : 0,
      borderColor: colors.primary,
      borderRadius: 4,
      padding: 12,
      elevation: 2,
    },
    icon: {
      marginRight: 5,
    },
    item: {
      fontFamily: "ReadexPro_400Regular",
      color: colors.textColor,
      padding: 17,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textItem: {
      fontFamily: "ReadexPro_400Regular",
      color: colors.textColor,
      flex: 1,
      fontSize: 14,
    },
    placeholderStyle: {
      fontFamily: "ReadexPro_400Regular",
      color: colors.textColor,
      fontSize: 14,
    },
    selectedTextStyle: {
      fontFamily: "ReadexPro_400Regular",
      color: colors.primary,
      fontSize: 14,
    },
    iconStyle: {
      tintColor: props.value !== null ? colors.primary : colors.secondary,
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      fontFamily: "ReadexPro_400Regular",
      height: 40,
      fontSize: 14,
    },
  });

  return (
    <View>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={props.data}
        maxHeight={300}
        search={false}
        labelField="label"
        valueField="value"
        placeholder={props.placeholder ?? "Select item"}
        searchPlaceholder="Search..."
        value={props.value}
        onChange={(item) => {
          props.onChange(item.value);
        }}
        renderItem={renderItem}
      />
    </View>
  );
};

export default CustomDropdown;
