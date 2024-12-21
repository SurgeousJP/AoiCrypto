import DividerLine from "@/components/Displays/Divider/DividerLine";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import Row from "@/components/Items/Project/Row";
import { colors } from "@/constants/colors";
import { BIGINT_CONVERSION_FACTOR } from "@/constants/conversion";
import { AuthContext } from "@/contexts/AuthProvider";
import { GET_INVESTED_PROJECT, GET_INVESTED_TOKEN } from "@/queries/portfolio";
import { useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
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
    { label: "Ongoing", value: "Ongoing" },
    { label: "Ended", value: "Ended" },
    { label: "Reset", value: null },
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
      value: "Total invested",
      style: "font-readexBold text-sm",
    },
    {
      value: "Project status",
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

      let status = "";
      if (
        currentTime > investor.idoPool.startTime &&
        investor.idoPool.endTime > currentTime
      ) {
        status = "Ongoing";
      } else if (currentTime < investor.idoPool.startTime) {
        status = "Upcoming";
      } else {
        status = "Ended";
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
            status === "Ongoing" ? "text-success" : ""
          } ${status === "Ended" ? "text-secondary" : ""}
          `,
        },
      ];
    });
  };

  const isLoading = isProjectLoading || isTokenLoading;

  const [rowData, setRowData] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);

  useEffect(() => {
    setDisplayData(rowData);
  }, [rowData]);

  useEffect(() => {
    if (investedProject !== undefined && tokensData !== undefined) {
      setRowData(getMappedData(investedProject, tokensData, Date.now()));
    }
  }, [investedProject, tokensData]);

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const onChangeSearchTerm = (value: string) => {
    setSearchTerm(value);
    setDisplayData(
      rowData.filter((row: any, index: number) =>
        row[0].value.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // Status filter logic
  useEffect(() => {
    let filteredData = rowData;
    if (status) {
      filteredData = rowData.filter((row, index) => row[2].value === status);
    }
    if (searchTerm) {
      filteredData = filteredData.filter((row, index) =>
        row[0].value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setDisplayData(filteredData);
  }, [status, searchTerm]);

  const onChangeStatus = (value: string) => {
    setStatus(value);
    console.log(status);
  };

  useEffect(() => {
    if (status === null) {
      setDisplayData(
        rowData.filter((value, index) => value[0].value.includes(searchTerm))
      );
    } else {
      setDisplayData(
        rowData.filter(
          (value, index) =>
            value[0].value.includes(searchTerm) && value[2].value === status
        )
      );
    }
  }, [status]);

  if (isLoading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col flex-1 mt-2">
      <View className="overflow-hidden py-4 px-2 border-border border-[0.5px] mb-4 bg-surface">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="space-x-3"
        >
          <View className="flex flex-row space-x-3 items-center">
            <View className="w-[230px] h-8">
              <Searchbar
                placeholder={"Project search"}
                value={searchTerm}
                onChange={onChangeSearchTerm}
              />
            </View>
            <View className="h-8 w-24">
              <CustomDropdown
                placeholder="Stage"
                data={projectState}
                value={status}
                onChange={onChangeStatus}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      {!isLoading &&
        rowData &&
        displayData &&
        (rowData.length > 0 || displayData.length > 0) && (
          <FlatList
            contentContainerStyle={{ overflow: "hidden" }}
            showsVerticalScrollIndicator={false}
            data={[headerData, ...displayData]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View key={index}>
                {index === 0 && <DividerLine />}
                <Row key={index} contents={item} />
                {index <= investedProject?.account?.investors.length && (
                  <DividerLine />
                )}
              </View>
            )}
          />
        )}
    </View>
  );
};

export default HistorySegment;
