import NoInbox from "@/components/Displays/Results/NoInbox/NoInbox";
import ScreenLoadingIndicator from "@/components/Displays/ScreenLoadingIndicator/ScreenLoadingIndicator";
import CustomDropdown from "@/components/Inputs/Dropdown/CustomDropdown";
import Searchbar from "@/components/Inputs/Searchbar/Searchbar";
import { colors } from "@/constants/colors";
import { AuthContext } from "@/contexts/AuthProvider";
import { useRegisterPrivatePool } from "@/hooks/smart-contract/IDOPool/useRegisterPrivatePool";
import {
  useGetAllowlistEntryByPoolAddress,
  useUpdateAllowlistEntry,
} from "@/hooks/useApiHook";
import { AllowlistEntry } from "@/model/ApiModel";
import { showToast } from "@/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
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
    setSelectedEntry(allowlists?.find((entry) => entry.id === id) || null);
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
            showToast(
              "success",
              "Successful mutation",
              "Allowlist status updated successfully"
            );
            queryClient.invalidateQueries({
              queryKey: ["allowlist", poolAddress],
            });
            closeModal();
          },
          onError: (error) => {
            showToast(
              "error",
              "Error mutation",
              `Error updating status: ${error.message}`
            );
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

  const [dynamicRowData, setDynamicRowData] = useState<any[]>([]);

  useEffect(() => {
    if (allowlists !== undefined && allowlists !== null) {
      setDynamicRowData(
        allowlists?.map((item) => [
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
        ])
      );
    }
  }, [allowlists]);

  // Combine header and rows
  const [rowData, setRowData] = useState<any[]>([]);
  useEffect(() => {
    setRowData([headerData, ...dynamicRowData]);
  }, [dynamicRowData]);
  const [displayData, setDisplayData] = useState(rowData);

  useEffect(() => {
    if (rowData.length > 0) {
      setDisplayData(rowData);
    }
  }, [rowData]);

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

  const { chainId } = useContext(AuthContext);

  if (isLoading || allowlists === undefined) return <ScreenLoadingIndicator />;

  if (allowlists === null)
    return (
      <View className="flex flex-1 flex-col justify-center items-center mt-[-128px]">
        <NoInbox />
      </View>
    );

  return (
    <View className="flex flex-col flex-1 mt-2">
      <View className="overflow-hidden py-4 px-2 border-border border-[0.5px] mb-4 bg-surface">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="space-x-3"
        >
          <View className="flex flex-row space-x-3 items-center">
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
      {!isLoading &&
        rowData &&
        displayData &&
        (rowData.length > 0 || displayData.length > 0) && (
          <FlatList
            contentContainerStyle={{
              overflow: "hidden",
              borderColor: colors.border,
              borderWidth: 0.5,
            }}
            data={displayData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item) => {
              const colorStyle = "bg-gray-50";
              return (
                <View key={item.index} className="flex flex-row bg-surface">
                  {item.item.map((content, index) => {
                    return (
                      <Pressable
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
                      </Pressable>
                    );
                  })}
                </View>
              );
            }}
          />
        )}
      {isModalVisible && selectedEntry && (
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
        >
          <View className="flex-1 justify-center items-center border border-gray-950 bg-opacity-50  bg-[#0008]">
            <View className="w-4/5 bg-white rounded-lg p-4">
              <Text className="font-readexRegular text-md mb-4">
                Update allowlist status for user:{"\n"}
                <Text className="text-primary">
                  {selectedEntry.userAddress}
                </Text>
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={() => handleUpdateStatus("Accepted")}
                  className="px-4 py-2 bg-success rounded-lg basis-[48%]"
                >
                  <Text className="text-white font-readexBold text-center">
                    Approve
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleUpdateStatus("Rejected")}
                  className="px-4 py-2 bg-error rounded-lg basis-[48%]"
                >
                  <Text className="text-white font-readexBold text-center">
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={closeModal}
                className="mt-4 px-4 py-2 bg-gray-300 rounded-lg"
              >
                <Text className="text-textColor font-readexBold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default SellerAllowlistSegment;
