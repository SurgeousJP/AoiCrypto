import React from "react";
import {
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Missions() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >

    </SafeAreaView>
  );
}