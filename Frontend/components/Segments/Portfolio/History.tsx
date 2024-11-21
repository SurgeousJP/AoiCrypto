import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import Row from "@/components/Items/Project/Row";
import { colors } from "@/constants/Colors";
import React from "react";
import { FlatList, ScrollView, View, Text } from "react-native";

const HistorySegment = () => {
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
      value: "Status",
      style: "font-readexBold text-sm",
    },
  ];
  const rowData = [
    headerData,
    [
      {
        value: "Wilder World",
        style: "font-readexRegular text-sm",
      },
      {
        value: "2500 ETH",
        style: "font-readexRegular text-sm",
      },
      {
        value: "Ongoing",
        style: "font-readexRegular text-sm text-success",
      },
    ],
    [
      {
        value: "Wilder World",
        style: "font-readexRegular text-sm",
      },

      {
        value: "2500 ETH",
        style: "font-readexRegular text-sm",
      },
      {
        value: "Ongoing",
        style: "font-readexRegular text-sm text-success",
      },
    ],
    [
      {
        value: "Wilder World",
        style: "font-readexRegular text-sm",
      },
      {
        value: "2500 ETH",
        style: "font-readexRegular text-sm",
      },
      {
        value: "Ongoing",
        style: "font-readexRegular text-sm text-success",
      },
    ],
    [
      {
        value: "Wilder World",
        style: "font-readexRegular text-sm",
      },
      {
        value: "2500 ETH",
        style: "font-readexRegular text-sm",
      },
      {
        value: "Ongoing",
        style: "font-readexRegular text-sm text-success",
      },
    ],
    [
      {
        value: "Wilder World",
        style: "font-readexRegular text-sm",
      },
      {
        value: "2500 ETH",
        style: "font-readexRegular text-sm",
      },
      {
        value: "Ongoing",
        style: "font-readexRegular text-sm text-success",
      },
    ],
    [
      {
        value: "Wilder World",
        style: "font-readexRegular text-sm",
      },
      {
        value: "2500 ETH",
        style: "font-readexRegular text-sm",
      },
      {
        value: "Ongoing",
        style: "font-readexRegular text-sm text-success",
      },
    ],
  ];

  const data = [1, 2, 3, 4, 5, 6];

  return (
    <View className="flex flex-col mt-2">
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className="mb-4 bg-surface border-border border-[1px] space-x-3 overflow-hidden"
      >
        <View className="p-4 flex flex-row space-x-3 items-center">
          <View className="w-[188px] h-8">
            <Searchbar placeholder={"Project search"} />
          </View>
          <View className="h-8 w-24">
            <CustomDropdown
              placeholder="Stage"
              data={projectState}
            />
          </View>
          <View className="h-8 w-28">
            <CustomDropdown
              placeholder="Status"
              data={whitelistState}
            />
          </View>
        </View>
      </ScrollView>

      <FlatList
        style={{ paddingHorizontal: 0, borderColor: colors.border, borderWidth: 0.5, elevation: 1 }}
        contentContainerStyle={{ flexGrow: 1, gap: 0 }}
        data={[...rowData]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => {
          return (
            <View>
              <Row key={item.index} contents={item.item} />
            </View>
          );
        }}
      />
    </View>
  );
};

export default HistorySegment;
