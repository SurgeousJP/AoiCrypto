import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '@/constants/Colors';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

interface CustomDropdownProps{
  placeholder?: string,
  width: number,
  data: {label: string, value: string}[]
}

const CustomDropdown:React.FC<CustomDropdownProps> = (props) => {
  const [value, setValue] = useState(null);

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {/* {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )} */}
      </View>
    );
  };

  const styles = StyleSheet.create({
    dropdown: {
      width: props.width,
      height: 32,
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.5,
      shadowRadius: 1.41,
  
      elevation: 2,
    },
    icon: {
      marginRight: 5,
    },
    item: {
      fontFamily: 'ReadexPro_400Regular',
      color: colors.textColor,
      padding: 17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textItem: {
      fontFamily: 'ReadexPro_400Regular',
      color: colors.textColor,
      flex: 1,
      fontSize: 14,
    },
    placeholderStyle: {
      fontFamily: 'ReadexPro_400Regular',
      color: colors.textColor,
      fontSize: 14,
    },
    selectedTextStyle: {
      fontFamily: 'ReadexPro_400Regular',
      color: colors.textColor,
      fontSize: 14,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      fontFamily: 'ReadexPro_400Regular',
      height: 40,
      fontSize: 14,
    },
  });

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={props.data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={props.placeholder ?? "Select item"}
      searchPlaceholder="Search..."
      value={value}
      onChange={item => {
        setValue(item.value);
      }}
      // renderLeftIcon={() => (
      //   <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      // )}
      renderItem={renderItem}
    />
  );
};

export default CustomDropdown;

