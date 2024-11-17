import { styles } from "@/components/Inputs/Input/styles";
import XProject from "@/components/Items/Project/XProject";
import YProject from "@/components/Items/Project/YProject";
import TabHeader from "@/components/Layouts/TabHeader";
import { colors } from "@/constants/Colors";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  Image,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Shadow } from "react-native-shadow-2";

export default function HomeScreen() {
  
  const banner = require("@/assets/logos/Kima.png");
  
  // const [loading, setLoading] = useState(true);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setLoading(true);
  //     const timer = setTimeout(() => setLoading(false), 100); // Simulate loading
  //     return () => clearTimeout(timer);
  //   }, [])
  // );

  // if (loading) {
  //   return (
  //     <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
  //       <ActivityIndicator size="large" color={colors.primary} />
  //       <Text className="font-readexRegular text-primary text-md">Loading</Text>
  //     </View>
  //   );
  // }

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
              <Text className="text-md font-readexMedium text-primary">
                More
              </Text>
            </Pressable>
          </View>
          <View className="flex flex-row space-x-2">
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
              <Pressable className="mb-2">
                <XProject />
              </Pressable>
              <Pressable className="mb-2">
                <XProject />
              </Pressable>
              <Pressable className="mb-2">
                <XProject />
              </Pressable>
            </View>
          </View>
        </View>
    </ScrollView>
  );
}
