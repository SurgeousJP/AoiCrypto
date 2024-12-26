import DividerLine from "@/components/Displays/Divider/DividerLine";
import VerticalDivider from "@/components/Displays/Divider/VerticalDivider";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import ProjectCard from "@/components/Items/Project/ProjectCard";
import Setting from "@/assets/icons/system-icons-svg/Setting.svg";
import { colors } from "@/constants/colors";
import {
  BIGINT_CONVERSION_FACTOR,
  getDateFromUnixTimestamp,
} from "@/constants/conversion";
import { GET_PROJECTS } from "@/queries/projects";
import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import { Link } from "expo-router";
import { AuthContext } from "@/contexts/AuthProvider";

export default function ProjectScreen() {
  const { address } = useContext(AuthContext);

  const projectState = [
    { label: "Public", value: "PUBLIC_SALE" },
    { label: "Private", value: "PRIVATE_SALE" },
    { label: "Reset", value: null },
  ];

  const projectStatuses = [
    { label: "Ongoing", value: "Ongoing" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "Ended", value: "Ended" },
    { label: "All", value: null },
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

  const [saleType, setSaleType] = useState<string | null>(null);
  const onChangeSaleType = (value: any) => {
    setSaleType(value);
  };

  const [status, setStatus] = useState<string | null>(null);
  const onChangeStatus = (value: any) => {
    setStatus(value);
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
  } = useQuery(GET_PROJECTS(status, saleType), {
    variables: {
      orderBy,
      orderDirection,
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const onChangeSearchTerm = (value: any) => {
    setSearchTerm(value);
  };
  const [displayData, setDisplayData] = useState<any[] | null>(null);

  useEffect(() => {
    if (
      projectQueryData !== undefined &&
      projectQueryData.idopools !== undefined
    ) {
      // console.log(projectQueryData.idopools);
      setDisplayData(
        projectQueryData.idopools.filter((ido) =>
          ido.tokenPool.includes(searchTerm)
        )
      );
    }
  }, [projectQueryData, searchTerm]);

  return (
    <View className="flex-1 bg-background">
      <View className="bg-surface mb-2">
        <View
          className="flex flex-row justify-between items-center bg-surface px-2 space-x-2 border-b-[0.5px] border-border py-2 pb-3"
          style={{ elevation: 2 }}
        >
          <Searchbar
            value={searchTerm}
            onChange={onChangeSearchTerm}
            placeholder={"Search by token contract address"}
          />
          <TouchableOpacity onPress={() => {}}>
            <Link href={"/settings"}>
              <Setting fill={colors.secondary} width={24} height={24} />
            </Link>
          </TouchableOpacity>
        </View>
      </View>

      <View
        className="bg-surface flex flex-col mb-2 py-2"
        style={{ elevation: 2 }}
      >
        <View className="flex flex-row justify-between mx-2 items-center py-1 pb-2">
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
        <DividerLine color={colors.secondary} />
        <View className="overflow-hidden px-2">
          <ScrollView
            horizontal={true}
            indicatorStyle="white"
            showsHorizontalScrollIndicator={false}
            scrollToOverflowEnabled={false}
          >
            <View className="mt-2 mx-2 flex flex-row justify-between space-x-2 items-center">
              <View className="w-[100px]">
                <CustomDropdown
                  placeholder="Stage"
                  width={96}
                  data={projectState}
                  value={saleType}
                  onChange={onChangeSaleType}
                />
              </View>
              <View className="w-[112px]">
                <CustomDropdown
                  placeholder="Status"
                  width={96}
                  data={projectStatuses}
                  value={status}
                  onChange={onChangeStatus}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      {address && !isProjectLoading && projectQueryData && displayData && (
        <FlatList
          style={{ paddingHorizontal: 4 }}
          columnWrapperStyle={{ gap: 4, marginBottom: 4 }}
          contentContainerStyle={{ flexGrow: 1, gap: 4 }}
          data={displayData}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={(item) => {
            return (
              <View key={item.item.id} className="basis-1/2">
                <ProjectCard
                  isInProgress={true}
                  isPrivateSale={false}
                  softCap={item.item.softCap / BIGINT_CONVERSION_FACTOR}
                  pricePerToken={
                    (Number(item.item.pricePerToken) / BIGINT_CONVERSION_FACTOR) 
                  }
                  raisedAmount={
                    item.item.raisedAmount / BIGINT_CONVERSION_FACTOR
                  }
                  tokenAddress={item.item.tokenPool}
                  poolId={item.item.id}
                  startTime={
                    getDateFromUnixTimestamp(item.item.startTime)
                      .toISOString()
                      .split("T")[0]
                  }
                  isSeller={
                    item.item.poolOwner.account.address.toLowerCase() ==
                    address.toLowerCase()
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
