import Header from "@/components/Layouts/Header";
import { colors } from "@/constants/Colors";
import React from "react";
import { SafeAreaView, Image, View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const banner = require("@/assets/logos/Kima.png");
  return (
    <ScrollView className="flex flex-col px-4">
      <View className="w-full rounded-md mt-4 h-fit">
        <Image
          source={banner}
          style={{
            flex: 1,
            width: "100%",
            height: 112,
            borderRadius: 16,
          }}
        />
      </View>
    </ScrollView>
  );
}
