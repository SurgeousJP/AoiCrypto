import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import { colors } from "@/constants/colors";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, View, Text } from "react-native";

const SellerWhitelistSegment = () => {
  const whitelistState = [
    { label: "Accepted", value: "Accepted" },
    { label: "Pending", value: "Pending" },
    { label: "Rejected", value: "Rejected" },
    { label: "None", value: null },
  ];

  const headerData = [
    {
      value: "User address",
      style: "font-readexBold text-sm text-left",
    },
    {
      value: "Status",
      style: "font-readexBold text-sm text-right",
    },
  ];
  const rowPendingValueSample = [
    {
      value: "0xda64bb5e5601f3c37880272607e5909D44B09841",
      style: "font-readexRegular text-sm text-left",
    },
    {
      value: "Pending",
      style: "font-readexRegular text-sm text-right text-pending",
    },
  ];

  const rowAcceptedValueSample = [
    {
      value: "0xab64bb5e5601f3c37880272607e5909D44B09841",
      style: "font-readexRegular text-sm text-left",
    },
    {
      value: "Accepted",
      style: "font-readexRegular text-sm text-right text-success",
    },
  ];

  const rowRejectValueSample = [
    {
      value: "0xcf64bb5e5601f3c37880272607e5909D44B09841",
      style: "font-readexRegular text-sm text-left",
    },
    {
      value: "Rejected",
      style: "font-readexRegular text-sm text-right text-error",
    },
  ];
  const repeatedPendingRows = Array(3).fill(rowPendingValueSample);
  const repeatedAcceptedRows = Array(3).fill(rowAcceptedValueSample);
  const repeatedRejectedRows = Array(3).fill(rowRejectValueSample);
  const rowData = [
    headerData,
    ...repeatedPendingRows,
    ...repeatedAcceptedRows,
    ...repeatedRejectedRows,
  ];

  const [displayData, setDisplayData] = useState(rowData);

  const [searchText, setSearchText] = useState("");
  const onChangeSearchText = (value: string) => {
    setSearchText(value);
    setDisplayData(
      rowData.filter(
        (value, index) => index === 0 || value[0].value.includes(searchText)
      )
    );
  };
  const [status, setStatus] = useState<string | null>(null);
  const onChangeStatus = (value: string) => {
    setStatus(value);
  };

  useEffect(() => {
    if (status === null){
      setDisplayData(rowData.filter(
        (value, index) => index === 0 || value[0].value.includes(searchText)
      ));
    }
    else {
      setDisplayData(rowData.filter(
        (value, index) => index === 0 || value[0].value.includes(searchText) && value[1].value === status
      ));
    }
  }, [status]);

  return (
    <View className="flex flex-col flex-1 mt-2">
      <View className="overflow-hidden py-4 px-2 border-border border-[1px] rounded-lg mb-4 bg-surface">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="space-x-3 rounded-lg"
        >
          <View className="flex flex-row space-x-3 items-center rounded-lg">
            <View className="w-[176px] h-8">
              <Searchbar
                placeholder={"User search"}
                value={searchText}
                onChange={onChangeSearchText}
              />
            </View>
            <View className="h-8 w-[120px]">
              <CustomDropdown placeholder="Status" data={whitelistState} value={status} onChange={onChangeStatus} />
            </View>
          </View>
        </ScrollView>
      </View>
      {rowData && displayData && (
        <FlatList
          contentContainerStyle={{
            borderRadius: 8,
            overflow: "hidden",
            borderColor: colors.border,
            borderWidth: 1,
          }}
          data={displayData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => {
            const borderStyle = "border-b-[0.5px] border-border";
            const colorStyle = "bg-gray-50";
            return (
              <View key={item.index} className="flex flex-row bg-surface">
                {item.item.map((content, index) => {
                  return (
                    <View
                      className={`flex-1 px-4 py-3 ${
                        item.index % 2 === 1 ? colorStyle : ""
                      } ${content.style} ${
                        item.index < rowData.length - 1 ? 
                        "" : ""
                      } ${index === 0 ? "basis-8/12" : "basis-4/12"}`}
                    >
                      <Text className={`${content.style} `}>
                        {content.value}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default SellerWhitelistSegment;
