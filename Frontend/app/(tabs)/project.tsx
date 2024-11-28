import ProjectCard from "@/components/Items/Project/ProjectCard";
import SearchHeader from "@/components/Layouts/SearchHeader";
import { colors } from "@/constants/Colors";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Move from "@/assets/icons/system-icons-svg/Move.svg";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import DividerLine from "@/components/Displays/Divider/DividerLine";
import VerticalDivider from "@/components/Displays/Divider/VerticalDivider";

export default function ProjectScreen() {
  const projectState = [
    { label: "Public", value: "Public" },
    { label: "Presale", value: "Presale" },
    { label: "Private", value: "Private" },
  ];
  const whitelistState = [
    { label: "Approved", value: "Approved" },
    { label: "Waiting", value: "Waiting" },
    { label: "None", value: "None" },
  ];

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
        <SearchHeader placeholder={"Projects"} />
      </View>

      <View
        className="bg-surface flex flex-col mb-4 mx-4 py-2 border-border border-[1px] rounded-md"
        style={{ elevation: 2 }}
      >
        <View className="flex flex-row justify-between mx-2 items-center py-1">
          <Pressable className="flex-1">
            <Text className="font-readexRegular text-secondary mx-auto">
              Most recent
            </Text>
          </Pressable>

          <VerticalDivider />

          <Pressable className="flex-1">
            <Text className="font-readexRegular text-secondary mx-auto">
              Popular
            </Text>
          </Pressable>

          <VerticalDivider />

          <Pressable className="flex flex-row space-x-1 items-center flex-1">
            <Text className="font-readexRegular text-secondary mx-auto">
              Token price
              {/* <Move width={12} height={12} stroke={colors.secondary} /> */}
            </Text>
          </Pressable>
        </View>
        <DividerLine />
        <View className="overflow-hidden px-2">
          <ScrollView
            horizontal={true}
            indicatorStyle="white"
            showsHorizontalScrollIndicator={false}
            scrollToOverflowEnabled={false}
          >
            <View className="mt-2 mx-2 flex flex-row justify-between space-x-2 items-center">
              <View className="flex-1">
                <CustomDropdown
                  placeholder="Stage"
                  width={96}
                  data={projectState}
                />
              </View>
              <View className="flex-1">
                <CustomDropdown
                  placeholder="Whitelisted"
                  width={124}
                  data={whitelistState}
                />
              </View>
              <View className="flex-1">
                <CustomDropdown
                  placeholder="Token"
                  width={124}
                  data={whitelistState}
                />
              </View>
              <View className="flex-1">
                <CustomDropdown
                  placeholder="Category"
                  width={124}
                  data={whitelistState}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <FlatList
        style={{ paddingHorizontal: 16 }}
        columnWrapperStyle={{ gap: 4, marginBottom: 4 }}
        contentContainerStyle={{ flexGrow: 1, gap: 8 }}
        data={data}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => {
          if (item.index < 5)
            return (
              <View className="flex-1">
                <ProjectCard isInProgress={true} isPrivateSale={false} />
              </View>
            );
          return (
            <View className="flex-1">
              <ProjectCard isInProgress={false} isPrivateSale={true} />
            </View>
          );
        }}
      />
    </View>
  );
}
