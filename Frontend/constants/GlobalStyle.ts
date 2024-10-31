import { StyleSheet } from "react-native";

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
    fontFamily: "Figtree_400Regular"
  },
  fontBold: {
    fontFamily: "Figtree_700Bold"
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
  innerShadow: {
    borderRadius: 10,
    overflow: 'hidden', // To hide the overflow of inner shadow
    // Shadow properties for outer shadow simulation
    shadowColor: 'rgba(0, 0, 0, 0.05)', // Similar to rgb(0, 0, 0, 0.05)
    shadowOffset: {
      width: 0,
      height: 2, // Vertical offset to simulate inset
    },
    shadowOpacity: 1, // Full opacity for the shadow effect
    shadowRadius: 4, // Radius for the blur effect
    elevation: 4, // Android elevation for shadow
  },
});