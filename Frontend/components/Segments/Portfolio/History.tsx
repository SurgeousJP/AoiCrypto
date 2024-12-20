import DividerLine from "@/components/Displays/Divider/DividerLine";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import Row from "@/components/Items/Project/Row";
import { colors } from "@/constants/colors";
import { BIGINT_CONVERSION_FACTOR } from "@/constants/conversion";
import { AuthContext } from "@/contexts/AuthProvider";
import { GET_INVESTED_PROJECT, GET_INVESTED_TOKEN } from "@/queries/portfolio";
import { useQuery } from "@apollo/client";
import React, { useContext } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";

const HistorySegment = () => {
  const { address } = useContext(AuthContext);

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

  const {
    loading: isProjectLoading,
    error,
    data: investedProject,
  } = useQuery(GET_INVESTED_PROJECT, {
    variables: { id: address },
  });
  const tokenIds = investedProject?.account?.investors?.map(
    (investor: any) => investor.idoPool.tokenPool
  );
  const {
    loading: isTokenLoading,
    error: tokenError,
    data: tokensData,
  } = useQuery(GET_INVESTED_TOKEN, {
    variables: { tokenIds: tokenIds },
    skip: !investedProject || !tokenIds,
  });

  const headerData = [
    {
      value: "Project name",
      style: "font-readexBold text-sm",
    },
    {
      value: "Invested",
      style: "font-readexBold text-sm",
    },
    {
      value: "Stage",
      style: "font-readexBold text-sm",
    },
  ];
  const getMappedData = (
    investedProject: any,
    tokensData: any,
    currentTime: number
  ) => {
    console.log("TokensData", tokensData);
    if (!investedProject?.account?.investors || !tokensData?.tokens) return [];

    return investedProject.account.investors.map((investor: any) => {
      const tokenPoolId = investor.idoPool.tokenPool;
      const token = tokensData.tokens.find((t: any) => t.id === tokenPoolId);
      const totalInvestValue = investor.activities
        .filter((activity: any) => activity.type === "INVEST")
        .reduce(
          (total: number, activity: any) =>
            total + Number(activity.value) / BIGINT_CONVERSION_FACTOR,
          0
        );

      let status = "Ongoing";
      if (
        currentTime > investor.idoPool.startPublicSale &&
        investor.idoPool.startPublicSale !== 0 &&
        investor.idoPool.endTime > currentTime
      ) {
        status = "Public";
      } else if (currentTime < investor.idoPool.startTime) {
        status = "Presale";
      } else if (
        currentTime > investor.idoPool.startTime &&
        currentTime < investor.idoPool.startPublicSale &&
        investor.idoPool.endTime > currentTime
      ) {
        status = "Private";
      }
      console.log("Status", status);
      return [
        {
          value: token ? token.name : "Unknown Token",
          style: "font-readexRegular text-sm",
        },
        {
          value: `${totalInvestValue} ETH`,
          style: "font-readexRegular text-sm",
        },
        {
          value: status,
          style: `font-readexRegular text-sm text-success ${
            status === "Ongoing" || status === "Public"
              ? "text-success"
              : "text-warning"
          }`,
        },
      ];
    });
  };

  const isLoading = isProjectLoading || isTokenLoading;

  if (isLoading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  const mappedData = getMappedData(investedProject, tokensData, Date.now());

  return (
    <View className="flex flex-col flex-1 mt-2">
      <View className="overflow-hidden py-4 px-2 border-border border-[0.5px] mb-4 bg-surface">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="space-x-3"
        >
          <View className="flex flex-row space-x-3 items-center">
            <View className="w-[188px] h-8">
              <Searchbar placeholder={"Project search"} />
            </View>
            <View className="h-8 w-24">
              <CustomDropdown placeholder="Stage" data={projectState} />
            </View>
            <View className="h-8 w-28">
              <CustomDropdown placeholder="Status" data={whitelistState} />
            </View>
          </View>
        </ScrollView>
      </View>
      <FlatList
        contentContainerStyle={{ overflow: "hidden" }}
        showsVerticalScrollIndicator={false}
        data={[headerData, ...mappedData]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View key={index}>
            {index === 0 && <DividerLine />}
            <Row key={index} contents={item} />
            {index < investedProject?.account?.investors.length && (
              <DividerLine />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default HistorySegment;
