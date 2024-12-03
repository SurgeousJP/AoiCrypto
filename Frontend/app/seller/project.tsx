import Add from "@/assets/icons/system-icons-svg/Add.svg";
import Move from "@/assets/icons/system-icons-svg/Move.svg";
import DividerLine from "@/components/Displays/Divider/DividerLine";
import VerticalDivider from "@/components/Displays/Divider/VerticalDivider";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import ProjectCard from "@/components/Items/Project/ProjectCard";
import { colors } from "@/constants/Colors";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function AdminProjectScreen() {
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
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background ">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pb-2">
      <View className="bg-surface mb-4">
        <View className="flex flex-row justify-between items-center bg-surface px-4 space-x-2 border-b-[0.5px] border-border py-2 pb-3">
          <Searchbar placeholder={"Search project"} />
          <Link href={"/project/createOverview"}>
            <Add width={24} height={24} stroke={colors.secondary} />
          </Link>
        </View>
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
              Token price{" "}
              <Move width={12} height={12} stroke={colors.secondary} />
            </Text>
          </Pressable>
        </View>
        <DividerLine />
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
