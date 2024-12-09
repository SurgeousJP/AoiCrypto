import DividerLine from "@/components/Displays/Divider/DividerLine";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import Row from "@/components/Items/Project/Row";
import { colors } from "@/constants/colors";
import React from "react";
import { FlatList, ScrollView, View } from "react-native";

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
        contentContainerStyle={{
          overflow: "hidden",
        }}
        showsVerticalScrollIndicator={false}
        data={[...rowData]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => {
          return (
            <View key={item.index}>
              {item.index === 0 && <DividerLine />}

              <Row key={item.index} contents={item.item} />
              {item.index < rowData.length && <DividerLine />}
            </View>
          );
        }}
      />
    </View>
  );
};

export default HistorySegment;
