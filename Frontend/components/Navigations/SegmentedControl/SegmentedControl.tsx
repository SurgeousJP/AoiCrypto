import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SegmentedControl, { FontStyle } from '@react-native-segmented-control/segmented-control';
import { colors } from '@/constants/Colors';
import { useFonts } from 'expo-font';
import { ReadexPro_200ExtraLight, ReadexPro_300Light, ReadexPro_400Regular, ReadexPro_500Medium, ReadexPro_600SemiBold, ReadexPro_700Bold } from '@expo-google-fonts/readex-pro';
import { SplashScreen } from 'expo-router';

interface SegmentedControlProp{
  screens: string[],
  components: any[],
}

const CustomSegmentedControl:React.FC<SegmentedControlProp> = (props) => {
  let [loaded, error] = useFonts({
    ReadexPro_200ExtraLight,
    ReadexPro_300Light,
    ReadexPro_400Regular,
    ReadexPro_500Medium,
    ReadexPro_600SemiBold,
    ReadexPro_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleChange = (event) => {
    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
  };

  const customFont: FontStyle = {
    fontSize: 14,
    color: colors.secondary,
    fontFamily: 'ReadexPro_400Regular', // Use the correct loaded font for regular style
  };

  const customFontBold: FontStyle = {
    fontFamily: 'ReadexPro_700Bold', // Use the correct font for bold style
    fontWeight: 'light',
    color: colors.primary,  // Apply color if needed
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

      <View className='mt-2 w-full flex-1'>
        {props.components[selectedIndex]}
      </View>
    </View>
  );
};

export default CustomSegmentedControl;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedControl: {
    width: '100%'
  },
});
