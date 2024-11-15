import XProject from "@/components/Items/XProject";
import YProject from "@/components/Items/YProject";
import Header from "@/components/Layouts/Header";
import { colors } from "@/constants/Colors";
import React from "react";
import {
  SafeAreaView,
  Image,
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Shadow } from "react-native-shadow-2";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const banner = require("@/assets/logos/Kima.png");
  return (
    <ScrollView className="flex flex-col px-4 bg-background">
      <Shadow
        stretch={true}
        offset={[0, 0]}
        startColor={"#2F66F61F"}
        distance={1}
        containerStyle={{
          borderRadius: 16,
          marginTop: 16,
          borderWidth: 1,
          borderColor: "#2F66F61F",
        }}
        style={{ borderRadius: 16 }}
      >
        <View className="w-full rounded-2xl h-fit">
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
      </Shadow>

      <View className="flex flex-col mt-4">
        <View className="flex flex-row justify-between mb-1">
          <Text className="text-textColor text-md font-readexBold">
            Upcoming Projects
          </Text>
          <Pressable>
            <Text className="text-md font-readexMedium text-primary">More</Text>
          </Pressable>
        </View>
        <View className="flex flex-row space-x-2  bg-white">
          <View className="flex-1 overflow-visible">
            <YProject />
          </View>
          <View className="flex-1 overflow-visible">
            <YProject />
          </View>
        </View>
        <View className="flex flex-col mt-4 mb-2">
          <View className="flex flex-row justify-between mb-1">
            <Text className="text-textColor text-md font-readexBold">
              Funded Projects
            </Text>
            <Pressable>
              <Text className="text-md font-readexMedium text-primary">
                More
              </Text>
            </Pressable>
          </View>
          <View className="flex flex-col">
            <View className="mb-2"><XProject /></View>
            <View className="mb-2"><XProject /></View>
            <View className="mb-2"><XProject /></View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
