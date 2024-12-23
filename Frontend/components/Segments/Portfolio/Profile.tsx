import Line from "@/assets/icons/system-icons-svg/Line.svg";
import Wallet from "@/assets/icons/system-icons-svg/Wallet.svg";
import Transaction from "@/assets/icons/system-icons-svg/Transaction.svg";
import LineChartComponent from "@/components/Displays/Chart/LineChart";
import DividerLine from "@/components/Displays/Divider/DividerLine";
import Container from "@/components/Layouts/Container";
import { colors } from "@/constants/colors";
import { BIGINT_CONVERSION_FACTOR } from "@/constants/conversion";
import { AuthContext } from "@/contexts/AuthProvider";
import { GET_INVESTED_PROJECT } from "@/queries/portfolio";
import { useQuery } from "@apollo/client";
import React, { useContext } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgProps } from "react-native-svg";
import { handleCopyToClipboard } from "@/utils/clipboard";
import { Ionicons } from "@expo/vector-icons";

interface SummaryItem {
  icon: React.FC<SvgProps>;
  label: string;
  value: string;
}

const getInvestData = (transactions: any) => {
  let sum = 0;
  return transactions
    .map((arr) => arr[0])
    .filter((transaction: any) => transaction.type === "INVEST")
    .map((transaction: any) => {
      sum = sum + Number(transaction.value) / BIGINT_CONVERSION_FACTOR;
      return Math.round(sum * 1e10) / 1e10;
    });
};

const ProfileSegment = () => {
  const { address } = useContext(AuthContext);
  const {
    loading: isProjectLoading,
    error,
    data: investedProject,
  } = useQuery(GET_INVESTED_PROJECT, {
    variables: { id: address },
  });

  // Extracting data from the query
  const account = investedProject?.account;
  const totalInvested = account.investedTotal;
  const totalInvestedAmount =
    (account.investedTotalAmount ?? 0) / BIGINT_CONVERSION_FACTOR;
  const investHistory = account.investors
    .map((pool) => pool.activities)
    .sort((a, b) => a.timestamp - b.timestamp);

  console.log(investHistory);
  console.log(getInvestData(investHistory));

  const summaryItems: SummaryItem[] = [
    {
      icon: Wallet,
      label: "Wallet Address",
      value: address.slice(0, 12) + "...",
    },
    { icon: Line, label: "IDOs Participated", value: totalInvested },
    {
      icon: Transaction,
      label: "Total Transactions",
      value: `${investHistory.length}`,
    },
  ];

  const copyAddressToClipboard = async () => {
    try {
      await handleCopyToClipboard(address);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  if (isProjectLoading) {
    return (
      <View className="flex flex-col flex-1 items-center justify-center my-auto bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="font-readexRegular text-primary text-md">Loading</Text>
      </View>
    );
  }

  if (error) {
    return (
      <Text className="text-red-500 text-center mt-4">
        Error loading data: {error.message}
      </Text>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex flex-col mt-2 pb-4"
    >
      <View className="bg-background pb-1 flex flex-col">
        <Text className="font-readexSemiBold text-md mt-2 ml-2 mb-2">
          Overview
        </Text>
        {summaryItems.map((summary, index) => {
          const Icon = summary.icon;
          return (
            <View key={summary.label} className="">
              {index === 0 && <DividerLine />}
              <View className="flex flex-row justify-between p-4 bg-surface">
                <View className="flex flex-row space-x-2">
                  <Icon stroke={colors.secondary} />
                  <Text className="font-readexRegular text-black">
                    {summary.label}
                  </Text>
                </View>
                <Pressable className="flex flex-row space-x-2 items-center">
                  <Text className="font-readexRegular">{summary.value}</Text>
                  {index === 0 && (
                    <TouchableOpacity onPress={copyAddressToClipboard}>
                      <Ionicons
                        name="copy-outline"
                        size={14}
                        color={colors.secondary}
                      />
                    </TouchableOpacity>
                  )}
                </Pressable>
              </View>
              {<DividerLine />}
            </View>
          );
        })}
      </View>
      <Text className="font-readexSemiBold text-md ml-2 mt-2 mb-2">
        Analytics
      </Text>
      <View className="mb-4 border-border border-[0.5px]">
        <Container>
          <View className="bg-surface rounded-lg p-2 flex flex-col items-center">
            <Text className="font-readexSemiBold text-md">
              Portfolio Report
            </Text>
            <Text className="font-readexBold text-xl">
              {totalInvestedAmount}
              {" ETH"}
            </Text>
            {investHistory !== undefined && getInvestData(investHistory) > 0 && <LineChartComponent
              legendString="Total ETH invested"
              input={getInvestData(investHistory)}
            />}
          </View>
        </Container>
      </View>
    </ScrollView>
  );
};

export default ProfileSegment;
