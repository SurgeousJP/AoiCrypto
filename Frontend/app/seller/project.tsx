import DividerLine from "@/components/Displays/Divider/DividerLine";
import VerticalDivider from "@/components/Displays/Divider/VerticalDivider";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import ProjectCard from "@/components/Items/Project/ProjectCard";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import { colors } from "@/constants/colors";
import {
  BIGINT_CONVERSION_FACTOR,
  getUnixTimestampFromDate,
} from "@/constants/conversion";
import { AuthContext } from "@/contexts/AuthProvider";
import { GET_PROJECTS_FROM_OWNER } from "@/queries/projects";
import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminProjectScreen() {
  const projectState = [
    { label: "Public", value: "PUBLIC_SALE" },
    { label: "Private", value: "PRIVATE_SALE" },
    { label: "Reset", value: null },
  ];

  const [selectedOption, setSelectedOption] = useState<string>("Most recent");
  const [isPriceAscending, setPriceAscending] = useState<boolean | undefined>(
    undefined
  );

  const getOrderVariables = () => {
    switch (selectedOption) {
      case "Popular":
        return { orderBy: "raisedAmount", orderDirection: "desc" };
      case "Token price":
        let setOrderDirection = isPriceAscending ? "asc" : "desc";
        let setOrderBy = "pricePerToken";
        return { orderBy: setOrderBy, orderDirection: setOrderDirection };
      default: // "Most recent"
        return { orderBy: "startTime", orderDirection: "desc" };
    }
  };

  const handlePress = (option: string) => {
    setSelectedOption(option);
    if (option === "Token price") {
      if (isPriceAscending === true) {
        setPriceAscending(false);
      } else if (isPriceAscending === false) {
        setPriceAscending(undefined);
      } else if (isPriceAscending === undefined) {
        setPriceAscending(true);
      }
    }
  };

  const [saleType, setSaleType] = useState<boolean | null>(null);
  const onChangeSaleType = (value: any) => {
    setSaleType(value);
  }

  const { address } = useContext(AuthContext);

  const { orderBy, orderDirection } = getOrderVariables();

  const {
    loading: isProjectLoading,
    error,
    data: projectQueryData,
  } = useQuery(GET_PROJECTS_FROM_OWNER(saleType), {
    variables: {
      currentTime: getUnixTimestampFromDate(new Date()),
      orderBy,
      orderDirection,
      status: saleType,
      poolOwner: address
    },
  });

  return (
    <View className="flex-1 bg-background">
      <View className="bg-surface mb-4">
      <View
      className="flex flex-row justify-between items-center bg-surface px-4 space-x-2 border-b-[0.5px] border-border py-2 pb-3"
      style={{ elevation: 2 }}
    >
      <Searchbar placeholder={"Search projects"} />
      <TouchableOpacity onPress={() => {}}>
        <Link href={"/seller/setting"}>
          <Setting fill={colors.secondary} width={24} height={24} />
        </Link>
      </TouchableOpacity>
    </View>
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
              Token price{" "}
              {orderBy === "pricePerToken" && orderDirection === "asc" && (
                <Ionicons
                  name="arrow-up-outline"
                  size={12}
                  color={colors.primary}
                />
              )}
              {orderBy === "pricePerToken" && orderDirection === "desc" && (
                <Ionicons
                  name="arrow-down-outline"
                  size={12}
                  color={colors.primary}
                />
              )}
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
                  value={saleType}
                  onChange={onChangeSaleType}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      {!isProjectLoading && projectQueryData && (
        <FlatList
          style={{ paddingHorizontal: 16 }}
          columnWrapperStyle={{ gap: 4, marginBottom: 4,overflow: "visible" }}
          contentContainerStyle={{ flexGrow: 1, gap: 8, overflow: "visible" }}
          data={projectQueryData.idopools}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => {
            return (
              <View className="basis-[50%]">
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
