import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import Row from "@/components/Items/Project/Row";
import { colors } from "@/constants/Colors";
import React from "react";
import { FlatList, ScrollView, View } from "react-native";

const ApplicationSegment = () => {
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
      value: "Apply date",
      style: "font-readexBold text-sm",
    },
    {
      value: "Status",
      style: "font-readexBold text-sm",
    },
  ];
  const rowData = [
    [
      {
        value: "Wilder World",
        style: "font-readexRegular text-sm",
      },
      {
        value: "31/12/2024",
        style: "font-readexRegular text-sm",
      },
      {
        value: "Accepted",
        style: "font-readexRegular text-sm text-success",
      },
    ],
    [
      {
        value: "Wilder World",
        style: "font-readexRegular text-sm",
      },
      {
        value: "31/12/2024",
        style: "font-readexRegular text-sm",
      },
      {
        value: "Accepted",
        style: "font-readexRegular text-sm text-success",
      },
    ],
    [
      {
        value: "Wilder World",
        style: "font-readexRegular text-sm",
      },
      {
        value: "31/12/2024",
        style: "font-readexRegular text-sm",
      },
      {
        value: "Accepted",
        style: "font-readexRegular text-sm text-success",
      },
    ],
  ];

  const data = [1, 2, 3, 4, 5, 6];

  return (
    <View className="flex flex-col mt-2">
      <View className="overflow-hidden py-4 px-2 border-border border-[1px] rounded-lg mb-4 bg-surface">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="space-x-3 overflow-hidden"
        >
          <View className="flex flex-row space-x-3 items-center">
            <View className="w-[188px] h-8">
              <Searchbar placeholder={"Application search"} />
            </View>
            <View className="h-8 w-24">
              <CustomDropdown
                placeholder="Stage"
                width={null}
                data={projectState}
              />
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
          borderColor: colors.border,
          borderWidth: 0.5,
          elevation: 1,
        }}
        contentContainerStyle={{ flexGrow: 1, gap: 0 }}
        data={[headerData, ...rowData]}
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

export default ApplicationSegment;
