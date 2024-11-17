import Tag from "@/components/Buttons/Tags/Tag";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import MissionCard from "@/components/Items/Mission/MissionCard";
import { colors } from "@/constants/Colors";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View, Text } from "react-native";
import { Shadow } from "react-native-shadow-2";

export default function Missions() {
  const router = useRouter();
  const handleNavigateMissionDetail = (e) => {
    router.navigate("/mission/1");
  }

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
      <View className="mt-4">
        <Searchbar placeholder="Mission search" />
      </View>
      <View className="flex flex-row space-x-2 mt-4">
        <View>
          <Shadow
            stretch={true}
            startColor="#2F66F61F"
            distance={1}
            offset={[1, 1]}
            paintInside={true}
            containerStyle={{ width: "100%", height: "auto" }}
            style={{ margin: 1, borderRadius: 8 }}
          >
            <Tag
              label={"All"}
              count={3}
              backgroundStyle={"bg-primary"}
              textStyle={"text-white"}
            />
          </Shadow>
        </View>
        <View>
          <Shadow
            stretch={true}
            startColor="#2F66F61F"
            distance={1}
            offset={[1, 1]}
            paintInside={true}
            containerStyle={{ width: "100%", height: "auto" }}
            style={{ margin: 1, borderRadius: 8 }}
          >
            <Tag
              label={"Available"}
              count={2}
              backgroundStyle={"bg-surface"}
              textStyle={"text-secondary"}
            />
          </Shadow>
        </View>
        <View>
          <Shadow
            stretch={true}
            startColor="#2F66F61F"
            distance={1}
            offset={[1, 1]}
            paintInside={true}
            containerStyle={{ width: "100%", height: "auto" }}
            style={{ margin: 1, borderRadius: 8 }}
          >
            <Tag
              label={"Ended"}
              count={1}
              backgroundStyle={"bg-surface"}
              textStyle={"text-secondary"}
            />
          </Shadow>
        </View>
      </View>
      <View className="flex flex-row space-x-2 mt-4">
        <Pressable onPress={handleNavigateMissionDetail} className="flex-1">
          <MissionCard />
        </Pressable>

        <Pressable onPress={handleNavigateMissionDetail} className="flex-1">
          <MissionCard />
        </Pressable>
      </View>
    </ScrollView>
  );
}
