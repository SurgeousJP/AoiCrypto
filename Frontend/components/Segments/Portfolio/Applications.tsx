import DividerLine from "@/components/Displays/Divider/DividerLine";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import Row from "@/components/Items/Project/Row";
import { AuthContext } from "@/contexts/AuthProvider";
import { useGetAllowlistEntryByUserAddress } from "@/hooks/useApiHook";
import React, { useContext } from "react";
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
  const { address } = useContext(AuthContext);
  const { data, isLoading } = useGetAllowlistEntryByUserAddress(address);
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
    data?.map((entry) => [
      {
        value: entry.userFullName,
        style: "font-readexRegular text-sm",
      },
      {
        value: new Date().toLocaleDateString(), // Assuming apply date is current date
        style: "font-readexRegular text-sm",
      },
      {
        value: entry.status,
        style: `font-readexRegular text-sm ${
          entry.status === "Accepted" ? "text-success" : ""
        }`,
      },
    ]) || [];

  return (
    <View className="flex flex-col mt-2">
      <View className="overflow-hidden py-4 px-2 border-border border-[0.5px] mb-4 bg-surface">
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
