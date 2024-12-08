import DividerLine from "@/components/Displays/Divider/DividerLine";
import VerticalDivider from "@/components/Displays/Divider/VerticalDivider";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import ProjectCard from "@/components/Items/Project/ProjectCard";
import SearchHeader from "@/components/Layouts/SearchHeader";
import { colors } from "@/constants/colors";
import {
  BIGINT_CONVERSION_FACTOR,
  getUnixTimestampFromDate,
} from "@/constants/conversion";
import { GET_PROJECTS } from "@/queries/projects";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

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
  const [selectedOption, setSelectedOption] = useState<string>("Most recent");
  const getOrderVariables = () => {
    switch (selectedOption) {
      case "Popular":
        return { orderBy: "raisedAmount", orderDirection: "desc" };
      case "Token price":
        return { orderBy: "pricePerToken", orderDirection: "desc" };
      default: // "Most recent"
        return { orderBy: "startTime", orderDirection: "desc" };
    }
  };

  const handlePress = (option: string) => {
    setSelectedOption(option);
  };
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading((loading) => false);
  }, []);

  const { orderBy, orderDirection } = getOrderVariables();

  const {
    loading: isProjectLoading,
    error,
    data: projectQueryData,
  } = useQuery(GET_PROJECTS, {
    variables: {
      currentTime: getUnixTimestampFromDate(new Date()),
      orderBy,
      orderDirection,
    },
  });

  const data = [1, 2, 3, 4, 5, 6];

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
          <Pressable
            className="flex-1"
            onPress={() => handlePress("Most recent")}
          >
            <Text
              className={`font-readexRegular mx-auto ${
                selectedOption === "Most recent"
                  ? "text-blue-500"
                  : "text-secondary"
              }`}
            >
              Most recent
            </Text>
          </Pressable>

          <VerticalDivider />

          <Pressable className="flex-1" onPress={() => handlePress("Popular")}>
            <Text
              className={`font-readexRegular mx-auto ${
                selectedOption === "Popular"
                  ? "text-blue-500"
                  : "text-secondary"
              }`}
            >
              Popular
            </Text>
          </Pressable>

          <VerticalDivider />

          <Pressable
            className="flex flex-row space-x-1 items-center flex-1"
            onPress={() => handlePress("Token price")}
          >
            <Text
              className={`font-readexRegular mx-auto ${
                selectedOption === "Token price"
                  ? "text-blue-500"
                  : "text-secondary"
              }`}
            >
              Token price
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
      {!isProjectLoading && (
        <FlatList
          style={{ paddingHorizontal: 16 }}
          columnWrapperStyle={{ gap: 4, marginBottom: 4 }}
          contentContainerStyle={{ flexGrow: 1, gap: 8 }}
          data={projectQueryData.idopools}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => {
            return (
              <View className="flex-1">
                <ProjectCard
                  isInProgress={true}
                  isPrivateSale={false}
                  softCap={item.item.softCap / BIGINT_CONVERSION_FACTOR}
                  pricePerToken={
                    item.item.pricePerToken / BIGINT_CONVERSION_FACTOR
                  }
                  raisedAmount={
                    item.item.raisedTokenAmount / BIGINT_CONVERSION_FACTOR
                  }
                />
              </View>
            );
          }}
        />
      )}
      {isProjectLoading && (
        <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="font-readexRegular text-primary text-md">
            Loading
          </Text>
        </View>
      )}
    </View>
  );
}
