import DividerLine from "@/components/Displays/Divider/DividerLine";
import VerticalDivider from "@/components/Displays/Divider/VerticalDivider";
import MissionCard from "@/components/Items/Mission/MissionCard";
import SearchHeader from "@/components/Layouts/SearchHeader";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function MissionsScreen() {
  const router = useRouter();
  const handleNavigateMissionDetail = (e) => {
    router.navigate("/mission/1");
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading((loading) => false);
  }, []);

  const data = [1, 2, 3, 4, 5, 6];

  if (loading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="bg-surface mb-4">
        <SearchHeader placeholder={"Missions"} />
      </View>

      <View
        className="bg-surface flex flex-col mb-4 mx-4 py-2 border-border border-[1px] rounded-md"
        style={{ elevation: 2 }}
      >
        <View className="flex flex-row justify-between mx-2 items-center py-1">
          <Pressable className="flex-1">
            <Text className="font-readexRegular text-secondary mx-auto">
              All
            </Text>
          </Pressable>

          <VerticalDivider />

          <Pressable className="flex-1">
            <Text className="font-readexRegular text-secondary mx-auto">
              Available
            </Text>
          </Pressable>

          <VerticalDivider />

          <Pressable className="flex flex-row space-x-1 items-center flex-1">
            <Text className="font-readexRegular text-secondary mx-auto">
              Ended
            </Text>
          </Pressable>
        </View>
        <DividerLine />
      </View>

      <FlatList
        style={{ paddingHorizontal: 16, marginBottom: 0 }}
        columnWrapperStyle={{ gap: 4, marginBottom: 4 }}
        contentContainerStyle={{ flexGrow: 1, gap: 8 }}
        data={data}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => {
          return (
            <Pressable onPress={handleNavigateMissionDetail} className="flex-1">
              <MissionCard />
            </Pressable>
          );
        }}
      />
    </View>
  );
}
