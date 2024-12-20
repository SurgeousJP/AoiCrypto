import LineChartComponent from "@/components/Displays/Chart/LineChart";
import Container from "@/components/Layouts/Container";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Capital from "@/assets/icons/system-icons-svg/Capital.svg";
import Participants from "@/assets/icons/system-icons-svg/Participants.svg";
import VerticalDivider from "@/components/Displays/Divider/VerticalDivider";
import { FlatList } from "react-native";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  GET_PROJECT_BY_POOL_ID,
  getTransactionHistory,
} from "@/queries/projects";
import { useQuery } from "@apollo/client";
import {
  BIGINT_CONVERSION_FACTOR,
  getDateFromUnixTimestamp,
} from "@/constants/conversion";
import NoDocument from "@/components/Displays/Results/NoDocument/NoDocument";
import NoInbox from "@/components/Displays/Results/NoInbox/NoInbox";
import NoInboxState from "@/assets/images/NoInboxState.svg";

interface Props {
  poolAddress: string;
}

// [{"__typename": "InvestorActivity", "investor": {"__typename": "Investor", "account": [Object]}, "timestamp": "1733973204", "transactionHash": "0xe60bfb19520eefdde979983bd1a7861b37671b84f5019b4d12227e5fc2a00001", "type": "INVEST", "value": "200000000000000"}]

const getTransactionHistoryDisplayData = (transactions: any) => {
  return transactions.map((transaction) => {
    const transactionColor =
      transaction.type === "INVEST" ? "text-success" : "text-primary";
    return [
      {
        value: transaction.transactionHash,
        style: `font-readexRegular text-sm ${transactionColor}`,
      },
      {
        value: getDateFromUnixTimestamp(transaction.timestamp)
          .toISOString()
          .split("T")[0],
        style: `font-readexRegular text-sm ${transactionColor}`,
      },
      {
        value: Number(transaction.value) / BIGINT_CONVERSION_FACTOR + " ETH",
        style: `font-readexRegular text-sm ${transactionColor}`,
      },
    ];
  });
};

const getInvestData = (transactions: any) => {
  return transactions
    .filter((transaction: any) => transaction.type === "INVEST")
    .map(
      (transaction: any) => Number(transaction.value) / BIGINT_CONVERSION_FACTOR
    );
};

const SellerAnalyticsSegment: React.FC<Props> = ({ poolAddress }) => {
  console.log(poolAddress);

  const headerData = [
    {
      value: "Transaction hash",
      style: "font-readexBold text-sm",
    },
    {
      value: "Time",
      style: "font-readexBold text-sm",
    },
    {
      value: "Amount",
      style: "font-readexBold text-sm",
    },
  ];

  const { loading, data: query } = useQuery(GET_PROJECT_BY_POOL_ID, {
    variables: {
      poolId: poolAddress,
    },
  });

  const { loading: loadingTransaction, data: queryHistory } = useQuery(
    getTransactionHistory(),
    {
      variables: {
        poolAddress: poolAddress,
      },
    }
  );

  const project = query?.idopool;

  const [isAddressAscending, setAddressAscending] = useState<
    boolean | undefined
  >(undefined);
  const [isAmountAscending, setAmountAscending] = useState<boolean | undefined>(
    undefined
  );
  const [isDateAscending, setDateAscending] = useState<boolean | undefined>(
    undefined
  );

  const [investData, setInvestData] = useState<number[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>(rowData);

  useEffect(() => {
    setDisplayData(rowData);
  }, [rowData]);

  useEffect(() => {
    if (
      !loadingTransaction &&
      queryHistory !== undefined &&
      queryHistory.idopools !== undefined
    ) {
      setRowData(
        getTransactionHistoryDisplayData(
          queryHistory.idopools[0].investorActivities
        )
      );
      setInvestData(getInvestData(queryHistory.idopools[0].investorActivities));
      console.log(getInvestData(queryHistory.idopools[0].investorActivities));
    }
  }, [loadingTransaction, queryHistory]);

  const ADDRESS_POSITION = 0;
  const DATE_POSITION = 1;
  const AMOUNT_POSITION = 2;
  const handlePress = (option: string) => {
    switch (option) {
      case "Hash":
        setAmountAscending(undefined);
        setDateAscending(undefined);
        setAddressAscending(getNextBooleanValue(isAddressAscending));
        break;
      case "Amount":
        setAddressAscending(undefined);
        setDateAscending(undefined);
        setAmountAscending(getNextBooleanValue(isAmountAscending));
        break;
      case "Date":
        setAddressAscending(undefined);
        setAddressAscending(undefined);
        setDateAscending(getNextBooleanValue(isDateAscending));
        break;
    }
  };

  useEffect(() => {
    if (isAddressAscending === undefined) {
      setDisplayData(rowData);
      return;
    }
    const newDisplayData = displayData;
    if (isAddressAscending) {
      newDisplayData.sort((a, b) =>
        b[ADDRESS_POSITION].value > a[ADDRESS_POSITION].value ? 1 : -1
      );
    } else {
      newDisplayData.sort((a, b) =>
        a[ADDRESS_POSITION].value > b[ADDRESS_POSITION].value ? 1 : -1
      );
    }
    setDisplayData(newDisplayData);
  }, [isAddressAscending]);

  useEffect(() => {
    if (isDateAscending === undefined) {
      setDisplayData(rowData);
      return;
    }
    const newDisplayData = displayData;
    if (isDateAscending) {
      newDisplayData.sort((a, b) =>
        b[DATE_POSITION].value > a[DATE_POSITION].value ? 1 : -1
      );
    } else {
      newDisplayData.sort((a, b) =>
        a[DATE_POSITION].value > b[DATE_POSITION].value ? 1 : -1
      );
    }
    setDisplayData(newDisplayData);
  }, [isDateAscending]);

  useEffect(() => {
    if (isAmountAscending === undefined) {
      setDisplayData(rowData);
      return;
    }
    const newDisplayData = displayData;
    if (isAmountAscending) {
      newDisplayData.sort((a, b) =>
        Number(b[AMOUNT_POSITION].value) > Number(a[AMOUNT_POSITION].value)
          ? 1
          : -1
      );
    } else {
      newDisplayData.sort((a, b) =>
        Number(a[AMOUNT_POSITION].value) > Number(b[AMOUNT_POSITION].value)
          ? 1
          : -1
      );
    }
    setDisplayData(newDisplayData);
  }, [isAmountAscending]);

  const getNextBooleanValue = (value: boolean | undefined) => {
    if (value === true) return false;
    if (value === false) return undefined;
    if (value === undefined) return true;
  };

  if (loading || !project) {
    return (
      <View className="flex-1 my-auto items-center justify-center">
        <ActivityIndicator size={"large"} color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex flex-col mt-2"
    >
      <View className="mb-3">
        <Text className="font-readexSemiBold text-md mt-2 ml-2">Metrics</Text>

        <View className="">
          <View
            className="flex flex-row justify-between bg-surface border-border border-[0.5px] p-4 items-center"
            style={{ elevation: 2 }}
          >
            <View className="flex flex-row space-x-2 items-center">
              <Participants />
              <Text className="font-readexRegular text-black text-md">
                Participants
              </Text>
            </View>
            <Text className="font-readexSemiBold text-black text-md">
              {project.investors.length}
            </Text>
          </View>

          <View
            className="flex flex-row justify-between bg-surface border-border border-[0.5px] p-4 items-center mt-2"
            style={{ elevation: 2 }}
          >
            <View className="flex flex-row space-x-2 items-center">
              <Capital />
              <Text className="font-readexRegular text-black text-md">
                Raised Capital
              </Text>
            </View>
            <Text className="font-readexSemiBold text-black text-md">
              {project.raisedAmount / BIGINT_CONVERSION_FACTOR}{" "}
              <Text className="text-secondary font-readexRegular">ETH</Text>
            </Text>
          </View>
        </View>
      </View>
      <Text className="font-readexSemiBold text-md mt-2 mb-2 ml-2">
        Analytics
      </Text>
      <View className="mb-4">
        <Container>
          <View className="bg-surface rounded-lg p-2 flex flex-col items-center">
            <Text className="font-readexSemiBold text-md">
              Project progress
            </Text>
            <Text className="font-readexBold text-xl">
              {project.raisedAmount / BIGINT_CONVERSION_FACTOR}
              {" ETH"}
            </Text>
            {investData !== undefined && investData.length > 0 && (
              <LineChartComponent input={investData} />
            )}
          </View>
        </Container>
      </View>
      <Text className="font-readexSemiBold text-md mt-2 mb-2 ml-2">
        Contributions
      </Text>
      {displayData !== undefined &&
      displayData !== null &&
      displayData.length > 0 ? (
        <View className="flex flex-col">
          <View className="bg-surface flex flex-col border-border border-[1px]">
            <View className="flex flex-row justify-between mx-2 items-center py-1">
              <Pressable className="flex-1" onPress={() => handlePress("Hash")}>
                <Text
                  className={`font-readexRegular text-secondary mx-auto ${
                    isAddressAscending !== undefined ? "text-primary" : ""
                  }`}
                >
                  Hash{" "}
                  {isAddressAscending !== undefined &&
                    (isAddressAscending ? (
                      <Ionicons
                        name="arrow-up-outline"
                        size={12}
                        color={colors.primary}
                      />
                    ) : (
                      <Ionicons
                        name="arrow-down-outline"
                        size={12}
                        color={colors.primary}
                      />
                    ))}
                </Text>
              </Pressable>

              <VerticalDivider />

              <Pressable className="flex-1" onPress={() => handlePress("Date")}>
                <Text
                  className={`font-readexRegular text-secondary mx-auto ${
                    isDateAscending !== undefined ? "text-primary" : ""
                  }`}
                >
                  Recent{" "}
                  {isDateAscending !== undefined &&
                    (isDateAscending ? (
                      <Ionicons
                        name="arrow-up-outline"
                        size={12}
                        color={colors.primary}
                      />
                    ) : (
                      <Ionicons
                        name="arrow-down-outline"
                        size={12}
                        color={colors.primary}
                      />
                    ))}
                </Text>
              </Pressable>

              <VerticalDivider />

              <Pressable
                className="flex flex-row space-x-1 items-center flex-1"
                onPress={() => handlePress("Amount")}
              >
                <Text
                  className={`font-readexRegular text-secondary mx-auto ${
                    isAmountAscending !== undefined ? "text-primary" : ""
                  }`}
                >
                  Amount{" "}
                  {isAmountAscending !== undefined &&
                    (isAmountAscending ? (
                      <Ionicons
                        name="arrow-up-outline"
                        size={12}
                        color={colors.primary}
                      />
                    ) : (
                      <Ionicons
                        name="arrow-down-outline"
                        size={12}
                        color={colors.primary}
                      />
                    ))}
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-3">
            <View className="flex flex-row justify-center space-x-3">
              <View className="flex flex-row space-x-1 items-center">
                <View className="w-3 h-3 bg-primary rounded-lg"></View>
                <Text className="font-readexRegular">Claim</Text>
              </View>
              <View className="flex flex-row space-x-1 items-center">
                <View className="w-3 h-3 bg-success rounded-lg"></View>
                <Text className="font-readexRegular">Invest</Text>
              </View>
            </View>
          </View>

          <View className="mt-3">
            <FlatList
              contentContainerStyle={{
                borderColor: colors.border,
                borderWidth: 1,
              }}
              scrollEnabled={false}
              data={[headerData, ...displayData]}
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
                            item.index < rowData.length - 1 ? borderStyle : ""
                          } ${index === 0 ? "basis-1/4" : ""}
                        ${index === 1 ? "basis-1/4" : ""}
                        ${index === 2 ? "basis-1/6  text-right" : ""}`}
                        >
                          <Text
                            className={`${content.style} ${
                              index === 1 ? "text-center" : ""
                            } ${index === 2 ? "text-right" : ""} `}
                          >
                            {content.value}
                            <Text className="text-secondary">
                              {item.index > 0 && index === 2 ? "" : ""}
                            </Text>
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                );
              }}
            ></FlatList>
          </View>
        </View>
      ) : (
        <View className=" mt-[-16px] bg-background flex items-center">
          <View className="m-0 p-0">
            <NoInboxState />
          </View>
          <Text className="font-readexSemiBold text-md mt-[-30px] text-center">
            {"No contributions found"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default SellerAnalyticsSegment;
