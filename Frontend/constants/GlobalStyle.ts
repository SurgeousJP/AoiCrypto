import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const globalStyles = StyleSheet.create({
  // Layout
  statusBarHeight:{
    height: 44
  },
  navbarHeight: {
    height: 44
  },
  marginLayout: {
    marginHorizontal: 16
  },
  tabBarHeight: {
    height: 78
  },
  homeIndicator: {
    height: 34
  },

  // Font
  fontNormal: {
    fontFamily: "ReadexPro_400Regular"
  },
  fontBold: {
    fontFamily: "ReadexPro_700Bold"
  },

  //color: 
  primaryColor: {
    color: "#2F66F6", // Primary color for text
  },
  secondaryColor: {
    color: "#696F8C", // Secondary text color
  },
  errorColor: {
    color: "#CD0000", // Error text color
  },
  successColor: {
    color: "#098C26", // Success text color
  },
  fallColor: {
    color: "#F7931A", // Fall color for specific elements
  },
  background: {
    backgroundColor: "#F8F9FC", // Main background color
  },
  surface: {
    backgroundColor: "#FFFFFF", // Surface color for cards, containers, etc.
  },
  outline: {
    borderColor: "#D7D9E4", // Outline color for borders
    borderWidth: 1, // Border width
  },
});