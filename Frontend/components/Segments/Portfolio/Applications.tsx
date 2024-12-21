import DividerLine from "@/components/Displays/Divider/DividerLine";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import Row from "@/components/Items/Project/Row";
import { colors } from "@/constants/colors";
import { AuthContext } from "@/contexts/AuthProvider";
import { useGetAllowlistEntryByUserAddress } from "@/hooks/useApiHook";
import http from "@/http/http";
import { Project } from "@/model/ApiModel";
import { useQueries } from "@tanstack/react-query";
import React, { useContext } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";

const ApplicationSegment = () => {
  const whitelistState = [
    { label: "Approved", value: "Approved" },
    { label: "Waiting", value: "Waiting" },
    { label: "None", value: "None" },
  ];
  const { address } = useContext(AuthContext);
  const { data, isLoading: isAllowListLoading } =
    useGetAllowlistEntryByUserAddress(address);

  const projectAddress = data?.map((entry) => entry.poolAddress);

  const results = useQueries({
    queries:
      projectAddress?.map((address) => ({
        queryKey: ["project", address],
        queryFn: async () => {
          const response = await http.get<Project>(
            `/api/project/address/${address}`
          );
          return response.data;
        },
      })) ?? [],
  });
  const headerData = [
    {
      value: "Project name",
      style: "font-readexBold text-sm",
    },
    {
      value: "Apply date",
      style: "font-readexBold text-sm",
    },
    {
      value: "Status",
      style: "font-readexBold text-sm",
    },
  ];

  const rowData =
    data?.map((entry) => {
      const project = results.find(
        (result) => result.data?.poolAddress === entry.poolAddress
      )?.data;

      return [
        {
          value: project?.name || "Unknown Project", // Use project name
          style: "font-readexRegular text-sm",
        },
        {
          value: entry.createdAt
            ? new Date(entry.createdAt).toLocaleDateString("en-GB")
            : null,
          style: "font-readexRegular text-sm",
        },
        {
          value: entry.status,
          style: `font-readexRegular text-sm ${
            entry.status === "Accepted" ? "text-success" : ""
          }`,
        },
      ];
    }) || [];

  const isLoading =
    isAllowListLoading || results.some((result) => result.isLoading);

  if (isLoading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }
  return (
    <View className="flex flex-col mt-2">
      <View className="overflow-hidden py-4 px-2 border-border border-[0.5px] mb-4 bg-surface">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="space-x-3 overflow-hidden"
        >
          <View className="flex flex-row space-x-3 items-center">
            <View className="w-[224px] h-8">
              <Searchbar placeholder={"Application search"} />
            </View>
            <View className="h-8 w-28">
              <CustomDropdown
                placeholder="Status"
                width={null}
                data={whitelistState}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <FlatList
        style={{
          paddingHorizontal: 0,
        }}
        contentContainerStyle={{ flexGrow: 1, gap: 0 }}
        data={[headerData, ...rowData]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => {
          return (
            <View>
              {item.index === 0 && <DividerLine />}
              <Row key={item.index} contents={item.item} />
              {item.index < [headerData, ...rowData].length && <DividerLine />}
            </View>
          );
        }}
      />
    </View>
  );
};

export default ApplicationSegment;
