import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SegmentedControl, { FontStyle } from '@react-native-segmented-control/segmented-control';
import { colors } from '@/constants/Colors';
import { useFonts } from 'expo-font';
import { ReadexPro_200ExtraLight, ReadexPro_300Light, ReadexPro_400Regular, ReadexPro_500Medium, ReadexPro_600SemiBold, ReadexPro_700Bold } from '@expo-google-fonts/readex-pro';
import { SplashScreen } from 'expo-router';

const CustomSegmentedControl = () => {
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
        values={['Option 1', 'Option 2', 'Option 3']}
        selectedIndex={selectedIndex}
        onChange={handleChange}
        style={styles.segmentedControl}        
      />
    </View>
  );
};

export default CustomSegmentedControl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedControl: {
    width: '80%',
    marginVertical: 20,
  },
});
