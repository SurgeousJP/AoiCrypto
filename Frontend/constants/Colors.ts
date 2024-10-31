/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Define a TypeScript interface for the color palette
export interface ColorPalette {
  background: string;
  surface: string;
  outline: string;
  textColor: string;
  primary: string;
  primaryBtn: string;
  secondary: string;
  error: string;
  fall: string;
  success: string;
}

// Create a constant object that conforms to the ColorPalette interface
export const colors: ColorPalette = {
  background: "#F8F9FC",
  surface: "#FFFFFF",
  outline: "#D7D9E4",
  textColor: "#11183C",
  primary: "#2F66F6",
  primaryBtn: "#2F66F6",
  secondary: "#696F8C",
  error: "#CD0000",
  fall: "#F7931A",
  success: "#098C26",
};
