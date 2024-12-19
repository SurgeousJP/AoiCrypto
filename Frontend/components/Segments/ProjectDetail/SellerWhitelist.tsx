import NoInbox from "@/components/Displays/Results/NoInbox/NoInbox";
import ScreenLoadingIndicator from "@/components/Displays/ScreenLoadingIndicator/ScreenLoadingIndicator";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import { colors } from "@/constants/colors";
import {
  useGetAllowlistEntryByPoolAddress,
  useUpdateAllowlistEntry,
} from "@/hooks/useApiHook";
import { AllowlistEntry } from "@/model/ApiModel";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  poolAddress: string;
}

const SellerAllowlistSegment: React.FC<Props> = ({ poolAddress }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AllowlistEntry | null>(
    null
  );
  const queryClient = useQueryClient();

  const { mutate: updateAllowlistEntry, isSuccess } = useUpdateAllowlistEntry();

  const openModal = (id: string) => {
    setSelectedEntry(allowlists.find((entry) => entry.id === id) || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEntry(null);
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (selectedEntry) {
      updateAllowlistEntry(
        {
          poolAddress,
          userAddress: selectedEntry.userAddress,
          entry: {
            ...selectedEntry,
            status: newStatus,
          },
        },
        {
          onSuccess: () => {
            alert("Status updated successfully!");
            queryClient.invalidateQueries({
              queryKey: ["allowlist", poolAddress],
            });
            closeModal();
          },
          onError: (error) => {
            alert(`Error updating status: ${error.message}`);
          },
        }
      );
    }
  };
  const whitelistState = [
    { label: "Accepted", value: "Accepted" },
    { label: "Pending", value: "Pending" },
    { label: "Rejected", value: "Rejected" },
    { label: "None", value: null },
  ];

  const { data: allowlists, isLoading } =
    useGetAllowlistEntryByPoolAddress(poolAddress);

  console.log(allowlists);

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

  const dynamicRowData = allowlists.map((item) => [
    {
      id: item.id,
      value: item.userAddress || "N/A",
      style: "font-readexRegular text-sm text-left",
    },
    {
      id: item.id,
      value: item.status || "N/A",
      style: `font-readexRegular text-sm text-right ${
        item.status === "Pending"
          ? "text-pending"
          : item.status === "Accepted"
          ? "text-success"
          : item.status === "Rejected"
          ? "text-error"
          : ""
      }`,
    },
  ]);

  // Combine header and rows
  const rowData = [headerData, ...dynamicRowData];

  const [displayData, setDisplayData] = useState(rowData);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  // Search filter logic
  const onChangeSearchText = (value: string) => {
    setSearchText(value);
    setDisplayData(
      rowData.filter(
        (row, index) =>
          index === 0 ||
          row[0].value.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // Status filter logic
  useEffect(() => {
    let filteredData = rowData;
    if (status) {
      filteredData = rowData.filter(
        (row, index) => index === 0 || row[1].value === status
      );
    }
    if (searchText) {
      filteredData = filteredData.filter(
        (row, index) =>
          index === 0 ||
          row[0].value.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setDisplayData(filteredData);
  }, [status, searchText]);

  const onChangeStatus = (value: string) => {
    setStatus(value);
  };

  useEffect(() => {
    if (status === null) {
      setDisplayData(
        rowData.filter(
          (value, index) => index === 0 || value[0].value.includes(searchText)
        )
      );
    } else {
      setDisplayData(
        rowData.filter(
          (value, index) =>
            index === 0 ||
            (value[0].value.includes(searchText) && value[1].value === status)
        )
      );
    }
  }, [status]);

  if (isLoading || allowlists === undefined) return <ScreenLoadingIndicator />;

  if (allowlists === null)
    return (
      <View className="flex flex-1 flex-col justify-center items-center mt-[-128px]">
        <NoInbox />
      </View>
    );

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
              <CustomDropdown
                placeholder="Status"
                data={whitelistState}
                value={status}
                onChange={onChangeStatus}
              />
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
                    <TouchableOpacity
                      onPress={() => openModal(content.id)}
                      className={`flex-1 px-4 py-3 ${
                        item.index % 2 === 1 ? colorStyle : ""
                      } ${content.style} ${
                        item.index < rowData.length - 1 ? "" : ""
                      } ${index === 0 ? "basis-8/12" : "basis-4/12"}`}
                    >
                      <Text className={`${content.style} `}>
                        {content.value}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          }}
        />
      )}
      {isModalVisible && selectedEntry && (
        <Modal transparent visible={isModalVisible} animationType="slide">
          <View className="flex-1 justify-center items-center border border-gray-950 bg-opacity-50">
            <View className="w-4/5 bg-white rounded-lg p-4">
              <Text className="font-readexBold text-lg mb-4">
                Update Status for {selectedEntry.userAddress}
              </Text>
              <View className="flex-row justify-around">
                <TouchableOpacity
                  onPress={() => handleUpdateStatus("Accepted")}
                  className="px-4 py-2 bg-success rounded-lg"
                >
                  <Text className="text-white">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleUpdateStatus("Rejected")}
                  className="px-4 py-2 bg-error rounded-lg"
                >
                  <Text className="text-white">Reject</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={closeModal}
                className="mt-4 px-4 py-2 bg-gray-300 rounded-lg"
              >
                <Text className="text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default SellerAllowlistSegment;
